import { problemCategoryValues } from "@/lib/contact/categories"
import type { ContactFieldErrors, ContactUtm } from "@/lib/contact/types"
import type { Locale } from "@/lib/i18n"

export type BrowserContactRequest = {
  name: string
  email: string
  company: string
  role: string
  problemCategory: string
  problemDescription: string
  pagePath: "/contact" | "/es/contact"
  locale?: Locale
  utm: ContactUtm
  website: string
  formStartedAt: number
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hasTrimmedLength(value: string, minimum: number, maximum: number) {
  const length = value.trim().length
  return length >= minimum && length <= maximum
}

export function browserContactFieldErrors(
  request: BrowserContactRequest,
  locale: Locale = "en",
): ContactFieldErrors {
  const es = locale === "es"
  const errors: Record<string, string[]> = {}

  if (!hasTrimmedLength(request.name, 2, 100)) {
    errors.name = [
      es
        ? "Escriba su nombre con 2–100 caracteres."
        : "Enter your name using 2–100 characters.",
    ]
  }
  if (
    !hasTrimmedLength(request.email, 3, 254) ||
    !emailPattern.test(request.email.trim())
  ) {
    errors.email = [
      es
        ? "Escriba un correo electrónico de trabajo válido."
        : "Enter a valid work email address.",
    ]
  }
  if (!hasTrimmedLength(request.company, 2, 120)) {
    errors.company = [
      es
        ? "Escriba su empresa con 2–120 caracteres."
        : "Enter your company using 2–120 characters.",
    ]
  }
  if (!hasTrimmedLength(request.role, 2, 100)) {
    errors.role = [
      es
        ? "Escriba su puesto con 2–100 caracteres."
        : "Enter your role using 2–100 characters.",
    ]
  }
  if (
    !problemCategoryValues.includes(
      request.problemCategory as (typeof problemCategoryValues)[number],
    )
  ) {
    errors.problemCategory = [
      es
        ? "Elija la categoría más cercana al problema."
        : "Choose the category closest to the problem.",
    ]
  }
  if (!hasTrimmedLength(request.problemDescription, 30, 4000)) {
    errors.problemDescription = [
      es
        ? "Describa el problema operativo con 30–4,000 caracteres."
        : "Describe the operational problem using 30–4,000 characters.",
    ]
  }

  return errors
}
