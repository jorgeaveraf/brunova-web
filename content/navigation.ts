import type { NavigationItem } from "@/content/types"

export const primaryNavigation = [
  { label: "Capabilities", href: "/capabilities" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
] as const satisfies readonly NavigationItem[]

export const portalNavigation = {
  label: "Portal",
  href: "/portal",
  analyticsEvent: "portal_clicked",
} as const satisfies NavigationItem

export const footerNavigation = [
  ...primaryNavigation,
  { label: "Contact", href: "/contact" },
  portalNavigation,
  { label: "Privacy", href: "/privacy" },
] as const satisfies readonly NavigationItem[]
