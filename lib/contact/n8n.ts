import type { ContactEnvelope } from "@/lib/contact/types"

export const N8N_TIMEOUT_MS = 8_000

export type N8nConfiguration = {
  webhookUrl: URL
  webhookSecret: string
}

export async function sendContactToN8n({
  configuration,
  envelope,
  fetchImplementation = fetch,
  timeoutMs = N8N_TIMEOUT_MS,
}: {
  configuration: N8nConfiguration
  envelope: ContactEnvelope
  fetchImplementation?: typeof fetch
  timeoutMs?: number
}): Promise<boolean> {
  try {
    const response = await fetchImplementation(configuration.webhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${configuration.webhookSecret}`,
        "Content-Type": "application/json",
        "Idempotency-Key": envelope.idempotency_key,
        "X-Brunova-Request-Id": envelope.request_id,
      },
      body: JSON.stringify(envelope),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    })

    return response.status >= 200 && response.status < 300
  } catch {
    return false
  }
}
