import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ThemeControl } from "@/components/theme/theme-control"

const setTheme = vi.fn()

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system", setTheme }),
}))

describe("ThemeControl", () => {
  beforeEach(() => setTheme.mockClear())

  it("offers system, light, and dark preferences", () => {
    render(<ThemeControl />)

    const control = screen.getByRole("combobox", { name: "Appearance" })
    expect(control).toBeEnabled()
    expect(screen.getByRole("option", { name: "System" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Light" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Dark" })).toBeInTheDocument()
  })

  it("updates the explicit theme preference", () => {
    render(<ThemeControl />)

    fireEvent.change(screen.getByRole("combobox", { name: "Appearance" }), {
      target: { value: "dark" },
    })

    expect(setTheme).toHaveBeenCalledWith("dark")
  })
})
