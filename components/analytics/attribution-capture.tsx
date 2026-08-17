"use client"

import { useEffect } from "react"

import { captureFirstTouchAttribution } from "@/lib/attribution"

export function AttributionCapture() {
  useEffect(() => {
    captureFirstTouchAttribution({
      search: window.location.search,
      landingPath: `${window.location.pathname}${window.location.hash}`,
      referrer: document.referrer,
      storage: window.sessionStorage,
    })
  }, [])

  return null
}
