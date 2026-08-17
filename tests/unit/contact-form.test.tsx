import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ContactForm } from "@/components/contact/contact-form"

function fillValidForm() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Lovelace" },
  })
  fireEvent.change(screen.getByLabelText("Work email"), {
    target: { value: "ada@example.com" },
  })
  fireEvent.change(screen.getByLabelText("Company"), {
    target: { value: "Analytical Engines" },
  })
  fireEvent.change(screen.getByLabelText("Role"), {
    target: { value: "Chief Operating Officer" },
  })
  fireEvent.change(screen.getByLabelText("Problem category"), {
    target: { value: "fragmented_systems" },
  })
  fireEvent.change(screen.getByLabelText("Problem description"), {
    target: {
      value:
        "Our operating data is fragmented across systems and manual handoffs.",
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("contact form", () => {
  it("focuses the first field and exposes associated validation errors", () => {
    render(<ContactForm />)
    fireEvent.click(screen.getByRole("button", { name: "Send the context" }))

    expect(screen.getByLabelText("Name")).toHaveFocus()
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "aria-invalid",
      "true",
    )
    expect(screen.getByText("Check the highlighted fields.")).toBeVisible()
  })

  it("renders the approved success experience", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), { status: 200 }),
        ),
      ),
    )
    render(<ContactForm />)
    fillValidForm()
    fireEvent.click(screen.getByRole("button", { name: "Send the context" }))

    expect(
      await screen.findByRole("heading", {
        name: "Thanks. We received your note.",
      }),
    ).toBeVisible()
    expect(screen.getByText(/right next step/)).toBeVisible()
  })

  it("preserves content and the logical key through a recoverable retry", async () => {
    const keys: string[] = []
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(async (_url: string, init: RequestInit) => {
        keys.push(new Headers(init.headers).get("idempotency-key") ?? "")
        return new Response(
          JSON.stringify({
            ok: false,
            code: "SERVICE_UNAVAILABLE",
            message: "Controlled failure",
          }),
          { status: 503 },
        )
      })
      .mockImplementationOnce(async (_url: string, init: RequestInit) => {
        keys.push(new Headers(init.headers).get("idempotency-key") ?? "")
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      })
    vi.stubGlobal("fetch", fetchMock)

    render(<ContactForm />)
    fillValidForm()
    fireEvent.click(screen.getByRole("button", { name: "Send the context" }))

    expect(
      await screen.findByText("We couldn't send this right now."),
    ).toBeVisible()
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace")

    fireEvent.click(screen.getByRole("button", { name: "Send the context" }))
    await waitFor(() => expect(keys).toHaveLength(2))
    expect(keys[0]).toBe(keys[1])
  })
})
