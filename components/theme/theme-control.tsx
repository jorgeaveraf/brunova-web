"use client"

import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const

export function ThemeControl({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )

  return (
    <label
      className={`theme-control${compact ? " theme-control--compact" : ""}`}
      data-state={mounted ? "ready" : "loading"}
    >
      <span className="theme-control__label">
        {compact ? "Theme" : "Appearance"}
      </span>
      <select
        aria-label={compact ? "Theme" : "Appearance"}
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
