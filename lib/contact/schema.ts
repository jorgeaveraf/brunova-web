import { z } from "zod"

import type { ContactFieldErrors } from "@/lib/contact/types"

export const problemCategories = [
  { value: "fragmented_systems", label: "Fragmented systems" },
  {
    value: "manual_operational_process",
    label: "Manual operational process",
  },
  { value: "fragile_automation", label: "Fragile automation" },
  {
    value: "data_reporting_reliability",
    label: "Data / reporting reliability",
  },
  { value: "financial_operations", label: "Financial operations" },
  { value: "internal_platform", label: "Internal platform" },
  { value: "something_else", label: "Something else" },
] as const

export const problemCategoryValues = problemCategories.map(
  ({ value }) => value,
) as [
  (typeof problemCategories)[number]["value"],
  ...(typeof problemCategories)[number]["value"][],
]

const normalizedText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum)

const utmValueSchema = z.string().trim().max(200).nullable()

export const contactRequestSchema = z
  .object({
    name: normalizedText(2, 100),
    email: z
      .string()
      .trim()
      .max(254)
      .email()
      .transform((value) => value.toLowerCase()),
    company: normalizedText(2, 120),
    role: normalizedText(2, 100),
    problemCategory: z.enum(problemCategoryValues),
    problemDescription: normalizedText(30, 4000),
    pagePath: z.literal("/contact"),
    utm: z
      .object({
        source: utmValueSchema,
        medium: utmValueSchema,
        campaign: utmValueSchema,
        term: utmValueSchema,
        content: utmValueSchema,
      })
      .strict(),
    website: z.string().trim().max(200),
    formStartedAt: z.number().int().nonnegative(),
  })
  .strict()

export const idempotencyKeySchema = z.string().uuid()

export type ContactRequest = z.infer<typeof contactRequestSchema>
export type ProblemCategory = ContactRequest["problemCategory"]

export function contactFieldErrors(
  error: z.ZodError<ContactRequest>,
): ContactFieldErrors {
  const errors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form"
    errors[field] ??= []
    errors[field].push(issue.message)
  }

  return errors
}
