import { pathToFileURL } from "node:url"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"])

function defined(value) {
  return typeof value === "string" && value.trim().length > 0
}

function parseUrl(errors, name, value, { canonical = false } = {}) {
  if (!defined(value)) return undefined

  let parsed
  try {
    parsed = new URL(value)
  } catch {
    errors.push(`${name} must be a valid URL`)
    return undefined
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    errors.push(`${name} must use HTTP or HTTPS`)
  }

  if (
    canonical &&
    (parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash)
  ) {
    errors.push(`${name} must contain only the canonical origin`)
  }

  if (parsed.protocol !== "https:" || LOOPBACK_HOSTS.has(parsed.hostname)) {
    errors.push(`${name} must use a non-loopback HTTPS URL in production`)
  }

  return parsed
}

export function validateProductionEnvironment(environment) {
  const errors = []
  const siteUrl = parseUrl(errors, "SITE_URL", environment.SITE_URL, {
    canonical: true,
  })

  if (!defined(environment.SITE_URL)) errors.push("SITE_URL is required")
  if (environment.SEO_INDEXING_ENABLED !== "true") {
    errors.push(
      "SEO_INDEXING_ENABLED must be true for the canonical production deployment",
    )
  }

  const contactValues = [
    environment.N8N_CONTACT_WEBHOOK_URL,
    environment.N8N_CONTACT_WEBHOOK_SECRET,
    environment.CONTACT_RATE_LIMIT_SALT,
  ]
  const configuredContactValues = contactValues.filter(defined).length

  if (
    configuredContactValues > 0 &&
    configuredContactValues < contactValues.length
  ) {
    errors.push(
      "contact integration must configure all three N8N/rate-limit values or none",
    )
  }

  if (defined(environment.N8N_CONTACT_WEBHOOK_URL)) {
    parseUrl(
      errors,
      "N8N_CONTACT_WEBHOOK_URL",
      environment.N8N_CONTACT_WEBHOOK_URL,
    )
  }
  if (
    defined(environment.CONTACT_RATE_LIMIT_SALT) &&
    environment.CONTACT_RATE_LIMIT_SALT.trim().length < 16
  ) {
    errors.push("CONTACT_RATE_LIMIT_SALT must contain at least 16 characters")
  }

  if (defined(environment.PORTAL_URL)) {
    parseUrl(errors, "PORTAL_URL", environment.PORTAL_URL)
  }

  if ((environment.BIND_ADDRESS ?? "127.0.0.1") !== "127.0.0.1") {
    errors.push(
      "BIND_ADDRESS must remain 127.0.0.1 behind the trusted reverse proxy",
    )
  }

  const port = environment.PORT ?? "3000"
  if (!/^\d{2,5}$/.test(port) || Number(port) < 1024 || Number(port) > 65535) {
    errors.push("PORT must be an unprivileged TCP port between 1024 and 65535")
  }

  if (errors.length > 0) {
    throw new Error(`Invalid production environment:\n- ${errors.join("\n- ")}`)
  }

  return {
    contactEnabled: configuredContactValues === contactValues.length,
    portalEnabled: defined(environment.PORTAL_URL),
    siteOrigin: siteUrl.origin,
  }
}

function run() {
  const result = validateProductionEnvironment(process.env)
  console.log(
    `Production environment valid (contact: ${result.contactEnabled ? "enabled" : "disabled"}; portal: ${result.portalEnabled ? "enabled" : "disabled"}).`,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    run()
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Invalid production environment",
    )
    process.exitCode = 1
  }
}
