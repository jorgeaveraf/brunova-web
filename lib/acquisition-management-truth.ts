import type { acquisitionApi } from "./acquisition-api"

export type DiscoveryTruth = Awaited<
  ReturnType<typeof acquisitionApi.discovery>
>
type Candidate = DiscoveryTruth["candidates"][number]
type Journey = NonNullable<DiscoveryTruth["journeys"]>[number]

const text = (value: unknown): string =>
  typeof value === "string" && value.trim() ? value : ""

/** A presentation projection over one authoritative Engine read. It never
 * promotes a Candidate to Account or treats a search market as domicile. */
export function candidateManagementTruth(data: DiscoveryTruth) {
  const journeys = new Map<string, Journey>(
    (data.journeys ?? []).map((journey) => [journey.candidate_id, journey]),
  )
  const latestWave = (data.learningWaves ?? [])[0]
  const targets = new Map(
    (latestWave?.targets ?? []).map((target) => [target.candidateId, target]),
  )
  const nameCounts = new Map<string, number>()
  for (const candidate of data.candidates)
    nameCounts.set(
      candidate.name ?? "",
      (nameCounts.get(candidate.name ?? "") ?? 0) + 1,
    )
  return data.candidates.map((candidate: Candidate) => {
    const journey = journeys.get(candidate.id)
    const target = targets.get(candidate.id)
    const performed = (data.workExecution ?? [])
      .flatMap((execution) => execution.items)
      .filter((item) => item.candidateId === candidate.id && item.outcome)
    const lastPerformed = performed.sort((a, b) =>
      String(b.outcome?.recordedAt).localeCompare(
        String(a.outcome?.recordedAt),
      ),
    )[0]
    const latestInvestigation = [...(journey?.investigations ?? [])].sort(
      (a, b) => b.recordedAt.localeCompare(a.recordedAt),
    )[0]
    const batch = (data.batchCandidates ?? []).find(
      (item) => item.candidate_id === candidate.id,
    )
    const effect = data.firstExploratoryEffect?.find(
      (item) =>
        item.company === candidate.name && item.effect_status === "SUCCEEDED",
    )
    const exactEffect =
      target && effect && nameCounts.get(candidate.name ?? "") === 1
        ? effect
        : null
    const sourceCoverage = new Set(
      performed.map((item) => text(item.selectedDimension)).filter(Boolean),
    )
    for (const origin of journey?.origins ?? [])
      if (origin.source === "remotive-hiring") sourceCoverage.add("JOB")
    const latestOutcome = lastPerformed?.outcome
    const observation =
      latestOutcome?.recordedAt ??
      latestInvestigation?.recordedAt ??
      candidate.last_seen ??
      candidate.first_seen ??
      null
    return {
      id: candidate.id,
      name: candidate.name ?? "Unknown organization",
      searchMarkets: candidate.market_contexts ?? [],
      identity: candidate.identity_state,
      screen: candidate.screen_state,
      contactState: exactEffect?.contact_strategy_state ?? null,
      followUpAuthority: exactEffect?.follow_up_authority ?? null,
      nextReviewAt: exactEffect?.next_review_at ?? null,
      contacted: exactEffect?.effect_status === "SUCCEEDED",
      coverage: [...sourceCoverage],
      sources: candidate.sources ?? [],
      sightings: candidate.sightings,
      known:
        text(latestOutcome?.evidenceSummary) ||
        text(latestInvestigation?.summary) ||
        text(batch?.found_because),
      unknown:
        text(latestOutcome?.unknownAfter) ||
        (candidate.missing.length
          ? "Identity, intervention evidence or problem ownership still needs corroboration."
          : "No explicit unresolved question recorded."),
      nextAction:
        text(latestOutcome?.nextAction) ||
        text(latestInvestigation?.nextAction) ||
        text(batch?.reviewed_next_action),
      lastAction: observation,
      worthiness:
        text(latestOutcome?.worthinessAfter) || text(batch?.research_outcome),
      target: target
        ? {
            why: target.why,
            hypothesis: target.hypothesis,
            falsifier: target.falsifier,
          }
        : null,
      discoveryReason: text(journey?.origins?.[0]?.reason),
      sourceHypothesis: text(journey?.origins?.[0]?.hypothesis),
      missingCodes: candidate.missing,
      exactEffect,
      journey,
    }
  })
}

export function marketContextCounts(data: DiscoveryTruth) {
  return {
    MX: data.candidates.filter((c) => c.market_contexts?.includes("MX")).length,
    US: data.candidates.filter((c) => c.market_contexts?.includes("US")).length,
    ambiguous: data.candidates.filter(
      (c) => !c.market_contexts?.length || c.market_contexts.length > 1,
    ).length,
  }
}
