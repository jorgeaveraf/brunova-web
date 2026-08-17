import { problemCategoryValues } from "@/lib/contact/categories"
import type { ContactFieldErrors, ContactUtm } from "@/lib/contact/types"

export type BrowserContactRequest = {
  name: string
  email: string
  company: string
  role: string
  problemCategory: string
  problemDescription: string
  pagePath: "/contact"
  utm: ContactUtm
  website: string
  formStartedAt: number
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hasTrimmedLength(value: string, minimum: number, maximum: number) {
  const length = value.trim().length
  return length >= minimum && length <= maximum
}

export function browserContactFieldErrors(
  request: BrowserContactRequest,
): ContactFieldErrors {
  const errors: Record<string, string[]> = {}

  if (!hasTrimmedLength(request.name, 2, 100)) {
    errors.name = ["Enter your name using 2–100 characters."]
  }
  if (
    !hasTrimmedLength(request.email, 3, 254) ||
    !emailPattern.test(request.email.trim())
  ) {
    errors.email = ["Enter a valid work email address."]
  }
  if (!hasTrimmedLength(request.company, 2, 120)) {
    errors.company = ["Enter your company using 2–120 characters."]
  }
  if (!hasTrimmedLength(request.role, 2, 100)) {
    errors.role = ["Enter your role using 2–100 characters."]
  }
  if (
    !problemCategoryValues.includes(
      request.problemCategory as (typeof problemCategoryValues)[number],
    )
  ) {
    errors.problemCategory = ["Choose the category closest to the problem."]
  }
  if (!hasTrimmedLength(request.problemDescription, 30, 4000)) {
    errors.problemDescription = [
      "Describe the operational problem using 30–4,000 characters.",
    ]
  }

  return errors
}
