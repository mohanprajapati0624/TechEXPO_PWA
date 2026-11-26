import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { z } from "zod";

// Replace this temporary list when the event's categories are confirmed.
export const CATEGORIES = ["Visitor"] as const;

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters.").max(100, "Name must be 100 characters or fewer.")
    .regex(/^\p{L}[\p{L}\p{M} .'\u2019-]*$/u, "Please enter a name using letters, spaces, apostrophes, or hyphens."),
  email: z.string().trim().max(255, "Email must be 255 characters or fewer.").email("Please enter a valid email address.").transform((value) => value.toLowerCase()),
  phone: z.string().refine((value) => {
    const parsed = parsePhoneNumberFromString(value);
    return !!parsed && parsed.isValid() && !parsed.ext;
  }, "Please enter a valid phone number for your country."),
  category: z.enum(CATEGORIES, { error: "Please select a category." }),
  source: z.string().trim().min(1).max(30).regex(/^[a-zA-Z0-9_-]+$/).default("direct"),
});
