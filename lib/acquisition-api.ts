import { z } from "zod"

const version = z.literal("1")
export const sessionSchema = z.object({
  authenticated: z.literal(true),
  actor: z.object({ email: z.string(), capabilities: z.array(z.string()) }),
  csrfToken: z.string(),
  expiresAt: z.string(),
})
export type PortalSession = z.infer<typeof sessionSchema>
const cycleSchema = z.object({
  schemaVersion: version,
  cycleId: z.string(),
  status: z.string(),
  policy: z.object({ id: z.string(), version: z.string() }),
  outcomeCounts: z.record(z.string(), z.number()),
  stageCounts: z.record(z.string(), z.number()),
})
const accountSchema = z.object({
  schemaVersion: version,
  accountId: z.string(),
  cycleId: z.string(),
  canonicalIdentity: z.object({ domain: z.string(), displayName: z.string() }),
  researchOutcome: z.string().nullable(),
  stage: z.string(),
  latestMaterialActivityAt: z.string().nullable(),
})
const assertionSchema = z.object({
  id: z.string(),
  epistemic_status: z.string(),
  statement: z.string(),
  confidence: z.string(),
  falsifier: z.string().nullable().optional(),
})
const detailSchema = accountSchema.extend({
  assertions: z.array(assertionSchema),
  knownUnknowns: z.array(z.string()),
  rationale: z
    .object({ summary: z.string().optional() })
    .passthrough()
    .nullable(),
  materialEvents: z.array(
    z.object({ event_type: z.string(), occurred_at: z.string() }).passthrough(),
  ),
})
const prioritySchema = z.object({
  tier: z.enum(["HIGH", "MEDIUM", "LOW"]),
  evidenceConfidence: z.string(),
  hypothesisConfidence: z.string(),
  recommendation: z.string(),
  whyNow: z.array(
    z.object({
      assertionId: z.string(),
      observedContext: z.string(),
      validAsOf: z.string().nullable(),
    }),
  ),
  hardStops: z.array(z.string()),
  limitingFactors: z.array(z.string()),
  supportingAssertionIds: z.array(z.string()),
  knownUnknowns: z.array(z.string()),
  materialUnknowns: z.array(z.string()),
  policyId: z.string(),
  policyVersion: z.string(),
  hypothesisRefs: z.array(
    z.object({ assertionId: z.string(), falsifier: z.string() }),
  ),
})
export const dispositionSchema = z.enum(["CONTINUE", "HOLD", "REJECT"])
const attentionSchema = z.object({
  schemaVersion: version,
  attention_id: z.string(),
  account_id: z.string(),
  cycle_id: z.string(),
  displayName: z.string(),
  domain: z.string(),
  status: z.string(),
  version: z.number().int(),
  stale: z.boolean(),
  eligible: z.boolean(),
  reconsideration_required: z.boolean(),
  next_stage_ready: z.boolean(),
  result: prioritySchema,
  allowedDispositions: z.array(dispositionSchema),
  human: z
    .object({
      decision: dispositionSchema,
      reason: z.string(),
      notes: z.string(),
      decidedAt: z.string(),
    })
    .passthrough()
    .nullable(),
})
const countsSchema = z.object({
  schemaVersion: version,
  configured: z.boolean(),
  counts: z
    .object({
      capacity: z.number(),
      prioritized_count: z.number(),
      active_count: z.number(),
      overflow_count: z.number(),
      eligible_unresolved_count: z.number(),
      candidate_count: z.number(),
    })
    .nullable(),
  tiers: z.object({ high: z.number(), medium: z.number(), low: z.number() }),
})
const healthSchema = z.object({
  schemaVersion: version,
  databaseReady: z.boolean(),
  realAcquisitionDataAllowed: z.boolean(),
  externalEffectsMode: z.string(),
  pendingWorkCount: z.number(),
  oldestPendingAt: z.string().nullable(),
})
const workSchema = z.object({
  schemaVersion: version,
  workItemId: z.string(),
  workType: z.string(),
  state: z.string(),
  attemptCount: z.number(),
  maxAttempts: z.number(),
  availableAt: z.string(),
  correlationId: z.string().nullable(),
})
const page = <T extends z.ZodType>(item: T) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() })
export type Cycle = z.infer<typeof cycleSchema>
export type Account = z.infer<typeof accountSchema>
export type AccountDetail = z.infer<typeof detailSchema>
export type Attention = z.infer<typeof attentionSchema>
export type Counts = z.infer<typeof countsSchema>
export type Health = z.infer<typeof healthSchema>
export type Work = z.infer<typeof workSchema>
export type Disposition = z.infer<typeof dispositionSchema>
export type DispositionInput = {
  schemaVersion: "1"
  commandId: string
  attentionId: string
  expectedVersion: number
  disposition: Disposition
  reason: string
  notes: string
}
export class AcquisitionError extends Error {
  constructor(public status: number) {
    super(
      (
        {
          401: "Tu sesión terminó. Vuelve a iniciar sesión.",
          403: "Tu identidad no tiene permiso para esta acción.",
          409: "El ítem cambió. Revisa el estado actualizado antes de decidir.",
          422: "La decisión no puede aplicarse al estado actual.",
          429: "Espera un momento antes de volver a intentar.",
          503: "El servicio no está disponible. Intenta actualizar en unos momentos.",
          502: "El contrato del Portal no es compatible. No se aplicó ninguna acción automática.",
        } as Record<number, string>
      )[status] ??
        "No se pudo confirmar la operación. Puedes reintentar la misma solicitud de forma segura.",
    )
  }
}
async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api/acquisition/v1${path}`, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
    })
  } catch {
    throw new AcquisitionError(503)
  }
  if (!response.ok) throw new AcquisitionError(response.status)
  const parsed = schema.safeParse(await response.json())
  if (!parsed.success) throw new AcquisitionError(502)
  return parsed.data
}
const id = encodeURIComponent
export const acquisitionApi = {
  contract: () =>
    request(
      "/contract",
      z.object({
        schemaVersion: version,
        attentionSurfaceVersion: z.literal("3g-v1"),
      }),
    ),
  cycles: () => request("/cycles?limit=100", page(cycleSchema)),
  accounts: (cycle: string, outcome: string, cursor = "") =>
    request(
      `/cycles/${id(cycle)}/accounts?limit=20${outcome ? `&outcome=${id(outcome)}` : ""}${cursor ? `&cursor=${id(cursor)}` : ""}`,
      page(accountSchema),
    ),
  detail: (cycle: string, account: string) =>
    request(`/cycles/${id(cycle)}/accounts/${id(account)}`, detailSchema),
  attention: (cycle: string, active: boolean) =>
    request(
      `/cycles/${id(cycle)}/attention?active=${active}`,
      z.object({ schemaVersion: version, items: z.array(attentionSchema) }),
    ),
  attentionDetail: (attention: string) =>
    request(`/attention/${id(attention)}`, attentionSchema),
  counts: (cycle: string) =>
    request(`/cycles/${id(cycle)}/attention-counts`, countsSchema),
  health: () => request("/engine-health", healthSchema),
  work: (cycle: string, cursor = "") =>
    request(
      `/work?limit=20${cycle ? `&cycleId=${id(cycle)}` : ""}${cursor ? `&cursor=${id(cursor)}` : ""}`,
      page(workSchema),
    ),
  disposition: (body: DispositionInput, csrf: string) =>
    request(
      "/commands/record-attention-disposition",
      z.object({
        schemaVersion: version,
        status: z.enum(["accepted", "already_applied"]),
        refill: z.object({
          activated: z.array(z.string()),
          withdrawn: z.array(z.string()),
        }),
        nextStageReady: z.boolean(),
      }),
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-csrf-token": csrf },
        body: JSON.stringify(body),
      },
    ),
  logout: async (csrf: string) => {
    const r = await fetch("/api/acquisition/v1/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "x-csrf-token": csrf },
    })
    if (!r.ok) throw new AcquisitionError(r.status)
  },
}
