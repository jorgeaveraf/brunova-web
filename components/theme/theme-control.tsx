"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const

export function ThemeControl() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )

  return (
    <label className="theme-control" data-state={mounted ? "ready" : "loading"}>
      <span className="theme-control__label">Appearance</span>
      <select
        aria-label="Appearance"
        disabled={!mounted}
        onChange={(event) => setTheme(event.currentTarget.value)}
        value={mounted ? theme : "system"}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
