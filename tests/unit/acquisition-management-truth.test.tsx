import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import {
  candidateManagementTruth,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"
import { CandidateInventory } from "@/components/acquisition/candidate-inventory"

const fixture = {
  schemaVersion: "1",
  state: "WAITING",
  displayLimits: { missions: 50, candidates: 50, planning: 20 },
  totals: {
    observations: 3,
    candidates: 2,
    resolved: 0,
    ambiguous: 0,
    unresolved: 2,
    held: 2,
    admitted: 0,
    pending_work: 0,
    active_cycles: 1,
  },
  sources: [],
  missions: [],
  planning: [],
  candidates: [
    {
      id: "c1",
      name: "SYNTHETIC Scania",
      domain: null,
      identity_state: "UNRESOLVED",
      screen_state: "HOLD",
      reasons: [],
      missing: ["ORGANIZATION_IDENTITY"],
      market_contexts: ["MX"],
      sources: ["synthetic-search"],
      sightings: 1,
      admissions: 0,
    },
    {
      id: "c2",
      name: "SYNTHETIC Other",
      domain: null,
      identity_state: "UNRESOLVED",
      screen_state: "HOLD",
      reasons: [],
      missing: [],
      market_contexts: ["US"],
      sources: [],
      sightings: 1,
      admissions: 0,
    },
  ],
  learningWaves: [
    {
      id: "w",
      cycle_id: "synthetic",
      version: 1,
      target_class: "EXPLORATORY_CANDIDATE_LEARNING",
      semantic_policy_version: 1,
      status: "AWAITING_HUMAN_REVIEW",
      outreach_authority: "NONE",
      executable: false,
      created_at: "2026-09-01",
      all_candidates: [],
      targets: [
        {
          position: 1,
          candidateId: "c1",
          company: "SYNTHETIC Scania",
          strictState: "HOLD",
          conversationWorthiness: "RETAIN",
          evidenceSnapshot: {},
          why: "Synthetic change signal",
          hypothesis: "Synthetic systems coordination",
          falsifier: "Already integrated",
        },
      ],
    },
  ],
  firstExploratoryEffect: [
    {
      company: "SYNTHETIC Other",
      decision: "HOLD",
      message_version: null,
      subject: null,
      text: null,
      message_hash: null,
      authorization_id: null,
      intent_id: null,
      work_item_id: null,
      effect_status: null,
      attempt_id: null,
      attempted_at: null,
      provider_observation: null,
      contact_strategy_state: null,
      next_review_at: null,
      follow_up_authority: null,
      logical_attempts: 0,
    },
    {
      company: "SYNTHETIC Scania",
      decision: "CONTACT",
      message_version: 1,
      subject: "Synthetic exact subject",
      text: "Synthetic exact text",
      message_hash: "hash",
      authorization_id: "auth",
      intent_id: "intent",
      work_item_id: "work",
      effect_status: "SUCCEEDED",
      attempt_id: "attempt",
      attempted_at: "2026-09-01T00:00:00Z",
      provider_observation: null,
      contact_strategy_state: "AWAITING_RESPONSE",
      next_review_at: "2026-09-08T00:00:00Z",
      follow_up_authority: "NONE",
      logical_attempts: 1,
    },
  ],
} as unknown as DiscoveryTruth

it("retains pre-Account candidates and binds contacted/waiting to the exact organization rather than first row", () => {
  const truth = candidateManagementTruth(fixture)
  expect(truth).toHaveLength(2)
  expect(truth[0]).toMatchObject({
    contacted: true,
    contactState: "AWAITING_RESPONSE",
    followUpAuthority: "NONE",
  })
  expect(truth[1]?.contacted).toBe(false)
  render(<CandidateInventory data={fixture} locale="en" />)
  expect(
    screen.getByText("Retained · Contacted · Waiting for reply"),
  ).toBeVisible()
  expect(screen.getByText(/2 retained candidates · 0 Accounts/)).toBeVisible()
  expect(screen.getByText(/Synthetic change signal/)).toBeVisible()
})
