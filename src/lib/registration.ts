import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { z } from "zod";

export const INTEREST_GROUPS = [
  { label: "Data Automation", interests: ["QuantumDataLytica"] },
  { label: "AI Agents", interests: [
    "Conversational AI", "MailPilot", "CampaignX", "MentorX", "IntelliHire",
    "CourseSmith", "StudyMate", "JobHunter", "ReviewBoost", "Solara",
  ] },
  { label: "Hotel Revenue", interests: ["Switchboard"] },
] as const;

export const INTERESTS = [
  ...INTEREST_GROUPS[0].interests, ...INTEREST_GROUPS[1].interests,
  ...INTEREST_GROUPS[2].interests, "Custom Solution", "Others",
] as const;

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters.").max(100, "Name must be 100 characters or fewer.")
    .regex(/^\p{L}[\p{L}\p{M} .'\u2019-]*$/u, "Please enter a name using letters, spaces, apostrophes, or hyphens."),
  email: z.string().trim().max(255, "Email must be 255 characters or fewer.").email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
  phone: z.string().refine((value) => {
    const parsed = parsePhoneNumberFromString(value);
    return !!parsed && parsed.isValid() && !parsed.ext;
  }, "Please enter a valid phone number for your country."),
  company: z.string().trim().min(1, "Please enter your company.").max(100, "Company must be 100 characters or fewer."),
  interests: z.array(z.enum(INTERESTS, { error: "Please select a valid interest." }))
    .min(1, "Please select at least one interest.")
    .refine((values) => new Set(values).size === values.length, "Please select each interest only once."),
  description: z.string().trim().max(1000, "Description must be 1000 characters or fewer.").optional(),
  source: z.string().trim().min(1).max(30).regex(/^[a-zA-Z0-9_-]+$/).default("direct"),
}).superRefine((value, context) => {
  if (value.interests.includes("Others") && !value.description) {
    context.addIssue({ code: "custom", path: ["description"], message: "Please describe your interest." });
  }
});
