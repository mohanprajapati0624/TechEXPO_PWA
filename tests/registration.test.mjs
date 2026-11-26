import { test } from "node:test";
import assert from "node:assert/strict";
import { INTERESTS, registrationSchema } from "../src/lib/registration.ts";

const valid = { name: "  Ada Lovelace  ", email: "  ADA@EXAMPLE.COM ", phone: "+919876543210", company: "  Analytical Engines  ", interests: ["Switchboard"] };

test("normalizes a valid registration and defaults its source", () => {
  const result = registrationSchema.parse(valid);
  assert.equal(result.name, "Ada Lovelace");
  assert.equal(result.email, "ada@example.com");
  assert.equal(result.company, "Analytical Engines");
  assert.equal(result.source, "direct");
});

test("rejects invalid numbers, unsupported interests and short names", () => {
  for (const changes of [{ phone: "+911234" }, { phone: "+91433434343" }, { phone: "+919876543210 ext. 1" }, { email: "mohan@example" }, { email: "a@@example.com" }, { interests: ["Unknown"] }, { name: " A " }, { name: "12345" }, { name: "Mohan123" }]) {
    assert.equal(registrationSchema.safeParse({ ...valid, ...changes }).success, false);
  }
});

test("validates company, multiple interests and the Others description", () => {
  assert.equal(registrationSchema.safeParse({ ...valid, company: " " }).success, false);
  assert.equal(registrationSchema.safeParse({ ...valid, interests: [] }).success, false);
  assert.equal(registrationSchema.safeParse({ ...valid, interests: ["Switchboard", "Switchboard"] }).success, false);
  assert.equal(registrationSchema.safeParse({ ...valid, interests: ["Others"], description: "  " }).success, false);
  assert.equal(registrationSchema.safeParse({ ...valid, interests: ["Others"], description: "x".repeat(1001) }).success, false);
  const result = registrationSchema.parse({ ...valid, interests: [...INTERESTS], description: "  A new idea  " });
  assert.equal(result.description, "A new idea");
  assert.deepEqual(result.interests, [...INTERESTS]);
});

test("accepts names in different scripts and common punctuation", () => {
  for (const name of ["મોહન પટેલ", "O'Connor", "Anne-Marie", "José García"]) {
    assert.equal(registrationSchema.safeParse({ ...valid, name }).success, true);
  }
});
