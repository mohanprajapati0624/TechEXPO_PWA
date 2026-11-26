import { Prisma } from "@prisma/client";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { getPrisma } from "@/lib/db";
import { registrationSchema } from "@/lib/registration";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const result = registrationSchema.safeParse(payload);
  if (!result.success) {
    return Response.json({ error: "Please check your details and try again.", fields: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, company, interests, description, source } = result.data;
  const parsed = parsePhoneNumberFromString(phone);
  if (!parsed || !parsed.isValid() || parsed.ext) {
    return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  try {
    await getPrisma().registration.create({
      data: {
        name, email, company, interests, source,
        description: interests.includes("Others") ? description : null,
        countryCode: `+${parsed.countryCallingCode}`,
        phoneNumber: parsed.nationalNumber,
        fullPhone: parsed.number,
      },
    });
    return Response.json({ message: "Details submitted successfully." }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Details with this phone number have already been submitted." }, { status: 409 });
    }
    console.error("Registration failed:", error);
    return Response.json({ error: "Unable to save your details. Please try again." }, { status: 500 });
  }
}
