"use client"

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type SyntheticEvent,
} from "react"

import { trackEvent } from "@/lib/analytics"
import { contactAttributionFromStorage } from "@/lib/attribution"
import { problemCategories } from "@/lib/contact/categories"
import { browserContactFieldErrors } from "@/lib/contact/client-validation"
import {
  applyMaterialEdit,
  completeSubmission,
  createIdempotencyState,
  markSubmissionAttempt,
  serializeSubmissionIntent,
  type IdempotencyState,
} from "@/lib/contact/idempotency"
import type { ContactFieldErrors, ContactResponse } from "@/lib/contact/types"

type FormStatus =
  | "initial"
  | "validation"
  | "submitting"
  | "success"
  | "service_error"
  | "network_error"
  | "rejected"
  | "rate_limited"
  | "unexpected_error"

const statusCopy: Partial<
  Record<FormStatus, { title: string; message: string }>
> = {
  validation: {
    title: "Check the highlighted fields.",
    message: "A few details need attention before this can be sent.",
  },
  service_error: {
    title: "We couldn't send this right now.",
    message: "Your information is still here—please try again.",
  },
  network_error: {
    title: "The connection was interrupted.",
    message: "Your information is still here. Check the connection and retry.",
  },
  rejected: {
    title: "This request could not be accepted.",
    message: "Review the information and try again from this page.",
  },
  rate_limited: {
    title: "Please wait before trying again.",
    message: "Too many attempts were received in a short period.",
  },
  unexpected_error: {
    title: "We couldn't complete this request.",
    message: "Your information is still here—please try again.",
  },
}

function formValues(form: HTMLFormElement): Record<string, FormDataEntryValue> {
  return Object.fromEntries(new FormData(form).entries())
}

function createContactRequest(form: HTMLFormElement, formStartedAt: number) {
  const values = formValues(form)
  const value = (name: string) => String(values[name] ?? "")

  return {
    name: value("name"),
    email: value("email"),
    company: value("company"),
    role: value("role"),
    problemCategory: value("problemCategory"),
    problemDescription: value("problemDescription"),
    pagePath: "/contact" as const,
    utm: contactAttributionFromStorage(window.sessionStorage),
    website: value("website"),
    formStartedAt,
  }
}

function publicFieldErrors(
  request: ReturnType<typeof createContactRequest>,
): ContactFieldErrors {
  return browserContactFieldErrors(request)
}

function intentSnapshot(form: HTMLFormElement): string {
  const values = formValues(form)
  delete values.website
  return serializeSubmissionIntent(values)
}

function fieldDescriptionId(name: string) {
  return `${name}-description`
}

function FieldMessage({
  error,
  helper,
  name,
}: {
  error?: readonly string[]
  helper?: string
  name: string
}) {
  return (
    <p
      className="contact-field__message"
      data-error={error ? "true" : undefined}
      id={fieldDescriptionId(name)}
    >
      {error?.[0] ?? helper ?? "\u00a0"}
    </p>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("initial")
  const [errors, setErrors] = useState<ContactFieldErrors>({})
  const [idempotency, setIdempotency] = useState<IdempotencyState>(() =>
    createIdempotencyState(),
  )
  const formStartedAt = useRef(0)
  const started = useRef(false)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    formStartedAt.current = Date.now()
  }, [])

  useEffect(() => {
    if (
      status !== "initial" &&
      status !== "submitting" &&
      status !== "validation"
    ) {
      window.requestAnimationFrame(() => statusRef.current?.focus())
    }
  }, [status])

  const handleInteraction = (event: SyntheticEvent<HTMLFormElement>) => {
    const target = event.target
    if (
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) ||
      target.name === "website" ||
      started.current
    ) {
      return
    }

    started.current = true
    if (formStartedAt.current === 0) formStartedAt.current = Date.now()
    trackEvent("contact_form_started", { page_path: "/contact" })
  }

  const handleInput = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const target = event.target
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    )) {
      return
    }

    setIdempotency((current) =>
      applyMaterialEdit(current, intentSnapshot(form)),
    )

    if (errors[target.name]) {
      const nextErrors = publicFieldErrors(
        createContactRequest(form, formStartedAt.current),
      )
      setErrors((current) => ({
        ...current,
        [target.name]: nextErrors[target.name] ?? [],
      }))
    }

    if (status !== "initial" && status !== "submitting") {
      setStatus("initial")
    }
  }

  const handleBlur = (event: SyntheticEvent<HTMLFormElement, FocusEvent>) => {
    const form = event.currentTarget
    const target = event.target
    if (
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) ||
      target.name === "website"
    ) {
      return
    }

    const nextErrors = publicFieldErrors(
      createContactRequest(form, formStartedAt.current),
    )
    setErrors((current) => ({
      ...current,
      [target.name]: nextErrors[target.name] ?? [],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting") return

    const form = event.currentTarget
    const request = createContactRequest(
      form,
      formStartedAt.current || Date.now(),
    )
    const nextErrors = publicFieldErrors(request)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus("validation")
      trackEvent("contact_form_error", { code: "VALIDATION_ERROR" })

      const firstInvalidField = Object.keys(nextErrors)[0]
      if (firstInvalidField) {
        const field = form.elements.namedItem(firstInvalidField)
        if (field instanceof HTMLElement) field.focus()
      }
      return
    }

    const attemptedState = markSubmissionAttempt(
      idempotency,
      intentSnapshot(form),
    )
    setIdempotency(attemptedState)
    setErrors({})
    setStatus("submitting")
    trackEvent("contact_form_submitted", {
      problem_category: request.problemCategory,
    })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": attemptedState.key,
        },
        body: JSON.stringify(request),
      })

      let result: ContactResponse
      try {
        result = (await response.json()) as ContactResponse
      } catch {
        result = {
          ok: false,
          code: "INTERNAL_ERROR",
          message: "The response could not be read.",
        }
      }

      if (response.ok && result.ok) {
        setStatus("success")
        setIdempotency((current) => completeSubmission(current))
        trackEvent("contact_form_success", {
          problem_category: request.problemCategory,
        })
        return
      }

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        const nextStatus: FormStatus =
          result.code === "RATE_LIMITED"
            ? "rate_limited"
            : result.code === "REQUEST_REJECTED"
              ? "rejected"
              : result.code === "SERVICE_UNAVAILABLE"
                ? "service_error"
                : result.code === "VALIDATION_ERROR"
                  ? "validation"
                  : "unexpected_error"

        setStatus(nextStatus)
        trackEvent("contact_form_error", { code: result.code })
      }
    } catch {
      setStatus("network_error")
      trackEvent("contact_form_error", { code: "NETWORK_ERROR" })
    }
  }

  const beginAnotherSubmission = () => {
    setStatus("initial")
    setErrors({})
    setIdempotency((current) => completeSubmission(current))
    formStartedAt.current = Date.now()
    started.current = false
    window.requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>("#name")?.focus(),
    )
  }

  if (status === "success") {
    return (
      <div
        aria-atomic="true"
        aria-live="polite"
        className="contact-result contact-result--success"
        data-state="success"
        ref={statusRef}
        role="status"
        tabIndex={-1}
      >
        <p className="contact-result__mark" aria-hidden="true">
          ✓
        </p>
        <h2>Thanks. We received your note.</h2>
        <p>
          We’ll review the context and get back to you with the right next step.
        </p>
        <button onClick={beginAnotherSubmission} type="button">
          Send another note
        </button>
      </div>
    )
  }

  const currentStatus = statusCopy[status]

  return (
    <form
      aria-busy={status === "submitting"}
      className="contact-form"
      data-state={status}
      noValidate
      onBlur={handleBlur}
      onFocus={handleInteraction}
      onInput={handleInput}
      onSubmit={handleSubmit}
    >
      <p
        aria-atomic="true"
        aria-live="polite"
        className="contact-form__announcement"
      >
        {status === "submitting" ? "Sending your information." : ""}
      </p>

      <div className="contact-form__heading">
        <div>
          <h2>Describe the operating problem.</h2>
          <p>All fields are required.</p>
        </div>
        <p>
          A concrete description is useful. You do not need a polished brief.
        </p>
      </div>

      {currentStatus ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          className="contact-result"
          data-state={status}
          ref={statusRef}
          role={status === "validation" ? "alert" : "status"}
          tabIndex={-1}
        >
          <strong>{currentStatus.title}</strong>
          <p>{currentStatus.message}</p>
        </div>
      ) : null}

      <fieldset className="contact-form__group">
        <legend>About you</legend>
        <div className="contact-form__fields contact-form__fields--identity">
          <div className="contact-field">
            <label htmlFor="name">Name</label>
            <input
              aria-describedby={fieldDescriptionId("name")}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              id="name"
              maxLength={100}
              name="name"
              required
              type="text"
            />
            <FieldMessage error={errors.name} name="name" />
          </div>

          <div className="contact-field">
            <label htmlFor="email">Work email</label>
            <input
              aria-describedby={fieldDescriptionId("email")}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="email"
              inputMode="email"
              maxLength={254}
              name="email"
              required
              type="email"
            />
            <FieldMessage error={errors.email} name="email" />
          </div>

          <div className="contact-field">
            <label htmlFor="company">Company</label>
            <input
              aria-describedby={fieldDescriptionId("company")}
              aria-invalid={Boolean(errors.company)}
              autoComplete="organization"
              id="company"
              maxLength={120}
              name="company"
              required
              type="text"
            />
            <FieldMessage error={errors.company} name="company" />
          </div>

          <div className="contact-field">
            <label htmlFor="role">Role</label>
            <input
              aria-describedby={fieldDescriptionId("role")}
              aria-invalid={Boolean(errors.role)}
              autoComplete="organization-title"
              id="role"
              maxLength={100}
              name="role"
              required
              type="text"
            />
            <FieldMessage error={errors.role} name="role" />
          </div>
        </div>
      </fieldset>

      <fieldset className="contact-form__group">
        <legend>The operation</legend>
        <div className="contact-form__fields">
          <div className="contact-field">
            <label htmlFor="problemCategory">Problem category</label>
            <select
              aria-describedby={fieldDescriptionId("problemCategory")}
              aria-invalid={Boolean(errors.problemCategory)}
              defaultValue=""
              id="problemCategory"
              name="problemCategory"
              required
            >
              <option disabled value="">
                Choose the closest category
              </option>
              {problemCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <FieldMessage
              error={errors.problemCategory}
              name="problemCategory"
            />
          </div>

          <div className="contact-field">
            <label htmlFor="problemDescription">Problem description</label>
            <textarea
              aria-describedby={fieldDescriptionId("problemDescription")}
              aria-invalid={Boolean(errors.problemDescription)}
              id="problemDescription"
              maxLength={4000}
              name="problemDescription"
              required
              rows={8}
            />
            <FieldMessage
              error={errors.problemDescription}
              helper="What is difficult to operate, where does the friction show up, and what do you already know?"
              name="problemDescription"
            />
          </div>
        </div>
      </fieldset>

      <div aria-hidden="true" className="contact-form__trap">
        <label htmlFor="website">Website</label>
        <input
          autoComplete="off"
          id="website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="contact-form__submit">
        <button
          data-state={status === "submitting" ? "loading" : "default"}
          disabled={status === "submitting"}
          type="submit"
        >
          {status === "submitting" ? "Sending…" : "Send the context"}
        </button>
        <p>
          Brunova uses this information only to evaluate and respond to the
          operational context you share.
        </p>
      </div>
    </form>
  )
}
