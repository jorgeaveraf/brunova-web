"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"

import { ThemeControl } from "@/components/theme/theme-control"
import type { NavigationItem } from "@/content/types"
import { trackEvent } from "@/lib/analytics"

export function MobileNavigation({
  primaryItems,
  primaryAction,
  portalItem,
}: {
  primaryItems: readonly NavigationItem[]
  primaryAction: NavigationItem
  portalItem: NavigationItem
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      firstLinkRef.current?.focus()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  function closeNavigation() {
    setIsOpen(false)
  }

  function restoreTriggerFocus() {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  function handleTrackedNavigation(item: NavigationItem) {
    if (item.analyticsEvent) trackEvent(item.analyticsEvent)
    closeNavigation()
  }

  return (
    <div className="mobile-navigation">
      <button
        aria-controls={dialogId}
        aria-expanded={isOpen}
        className="mobile-navigation__trigger"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
        type="button"
      >
        Menu
      </button>

      <dialog
        aria-labelledby={`${dialogId}-title`}
        className="mobile-navigation__dialog"
        id={dialogId}
        onCancel={(event) => {
          event.preventDefault()
          restoreTriggerFocus()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) restoreTriggerFocus()
        }}
        onClose={restoreTriggerFocus}
        ref={dialogRef}
      >
        <div className="mobile-navigation__panel">
          <div className="mobile-navigation__heading">
            <h2 id={`${dialogId}-title`}>Navigation</h2>
            <button
              className="mobile-navigation__close"
              onClick={closeNavigation}
              type="button"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className="mobile-navigation__links">
              {primaryItems.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => handleTrackedNavigation(item)}
                    ref={index === 0 ? firstLinkRef : undefined}
                  >
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-navigation__utilities">
            <Link
              className="action-link action-link--utility"
              href={portalItem.href}
              onClick={() => handleTrackedNavigation(portalItem)}
            >
              {portalItem.label}
            </Link>
            <Link
              className="action-link action-link--primary"
              href={primaryAction.href}
              onClick={() => handleTrackedNavigation(primaryAction)}
            >
              {primaryAction.label}
            </Link>
            <ThemeControl compact />
          </div>
        </div>
      </dialog>
    </div>
  )
}
