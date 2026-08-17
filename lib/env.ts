import { z } from "zod"

const absoluteUrl = z.url()
const externalHttpUrl = z
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
    message: "Expected an HTTP or HTTPS URL",
  })

const serverEnvironmentSchema = z.object({
  SITE_URL: absoluteUrl.default("http://localhost:3000"),
  N8N_CONTACT_WEBHOOK_URL: absoluteUrl.optional(),
  N8N_CONTACT_WEBHOOK_SECRET: z.string().min(1).optional(),
  CONTACT_RATE_LIMIT_SALT: z.string().min(16).optional(),
  PORTAL_URL: externalHttpUrl.optional(),
})

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>

let cachedEnvironment: ServerEnvironment | undefined

export function getServerEnvironment(): ServerEnvironment {
  cachedEnvironment ??= serverEnvironmentSchema.parse({
    SITE_URL: process.env.SITE_URL,
    N8N_CONTACT_WEBHOOK_URL: process.env.N8N_CONTACT_WEBHOOK_URL || undefined,
    N8N_CONTACT_WEBHOOK_SECRET:
      process.env.N8N_CONTACT_WEBHOOK_SECRET || undefined,
    CONTACT_RATE_LIMIT_SALT: process.env.CONTACT_RATE_LIMIT_SALT || undefined,
    PORTAL_URL: process.env.PORTAL_URL || undefined,
  })

  return cachedEnvironment
}

export function getSiteUrl(): URL {
  return new URL(getServerEnvironment().SITE_URL)
}

export function getPortalUrl(): URL | undefined {
  const portalUrl = getServerEnvironment().PORTAL_URL
  return portalUrl ? new URL(portalUrl) : undefined
}
