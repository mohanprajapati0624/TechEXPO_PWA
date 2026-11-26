"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import { PhoneInput } from "react-international-phone";
import Select from "react-select";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { INTEREST_GROUPS, INTERESTS, registrationSchema } from "@/lib/registration";
import { BrandLogo } from "./brand-logo";
import { InstallBanner } from "./install-banner";

type Interest = (typeof INTERESTS)[number];
type FieldErrors = Partial<Record<"name" | "email" | "phone" | "company" | "interests" | "description", string>>;
const interestOptions = INTERESTS.map((interest) => ({ value: interest, label: interest }));
const groupedInterestOptions = [
  ...INTEREST_GROUPS.map((group) => ({
    label: group.label,
    options: group.interests.map((interest) => ({ value: interest, label: interest })),
  })),
  ...interestOptions.filter((option) => option.value === "Custom Solution" || option.value === "Others"),
];
const subscribe = () => () => {};

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const source = new URLSearchParams(window.location.search).get("source") === "qr" ? "qr" : "direct";
    const result = registrationSchema.safeParse({ name, email, phone, company, interests, description, source });
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      setErrors({ name: fields.name?.[0], email: fields.email?.[0], phone: fields.phone?.[0], company: fields.company?.[0], interests: fields.interests?.[0], description: fields.description?.[0] });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data: { error?: string } = await response.json();
      if (!response.ok) {
        setMessage(data.error ?? "Unable to save your details. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setMessage("Could not connect. Check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <BrandLogo />
          <div className="header-note"><span className="status-dot" /> GET IN TOUCH</div>
        </div>
      </header>

      <main className="hero">
        <Image className="hero-bg" src="/hero/hero-bg-1672.webp" alt="" fill priority sizes="100vw" />
        <div className="hero-inner">
          <section className="intro" aria-labelledby="intro-heading">
            <div className="eyebrow"><span className="eyebrow-dot" /> LET&apos;S START A CONVERSATION</div>
            <h1 id="intro-heading">Tell us a little <em>about yourself.</em></h1>
            <span className="hero-rule" aria-hidden="true" />
            <p>Share your details and the Softqube solutions you&apos;re interested in. We&apos;d love to learn more about what you&apos;re looking for.</p>
            <div className="intro-foot">
              <span className="card-glow" aria-hidden="true" />
              <span className="card-line" aria-hidden="true" />
              <strong>Built around your interests</strong>
              <span>Choose one or more solutions that matter to you.</span>
            </div>
          </section>

          <section className="form-area" aria-label="Share your details">
            <div className="form-card">
              <span className="card-glow" aria-hidden="true" />
              {success ? (
                <div className="success-panel" role="status">
                  <span className="success-icon"><CheckCircle2 size={34} /></span>
                  <div className="form-kicker">THANK YOU</div>
                  <h2>Your details have been shared.</h2>
                  <p>Thanks for telling us a little about yourself and your interests.</p>
                </div>
              ) : (
                <>
                  <div className="card-heading"><div><div className="form-kicker">GET IN TOUCH</div><h2>Let&apos;s get to know you.</h2><p>Fill in your details and tell us what interests you.</p></div></div>
                  <form action="/api/registrations" method="post" onSubmit={submit} noValidate>
                    <div className="field"><label htmlFor="name">Full name <span>*</span></label><input id="name" name="name" autoComplete="name" maxLength={100} required placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
                    <div className="field"><label htmlFor="email">Email address <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={255} required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
                    <div className="field"><label htmlFor="phone">Phone number <span>*</span></label><PhoneInput defaultCountry="in" value={phone} onChange={setPhone} inputProps={{ id: "phone", name: "phone", autoComplete: "tel", inputMode: "tel", required: true, "aria-invalid": !!errors.phone, "aria-describedby": errors.phone ? "phone-error" : undefined }} placeholder="Enter your phone number" />{errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}</div>
                    <div className="field"><label htmlFor="company">Company <span>*</span></label><input id="company" name="company" autoComplete="organization" maxLength={100} required placeholder="Your company" value={company} onChange={(e) => setCompany(e.target.value)} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />{errors.company && <span className="field-error" id="company-error">{errors.company}</span>}</div>
                    <div className="field"><label htmlFor="interests">Interested in <span>*</span></label><Select<({ value: Interest; label: Interest }), true> inputId="interests" instanceId="interests" classNamePrefix="interest-select" options={groupedInterestOptions} isMulti value={interestOptions.filter((option) => interests.includes(option.value))} onChange={(options) => { const selected = options.map((option) => option.value); setInterests(selected); if (!selected.includes("Others")) setDescription(""); }} placeholder="Select your interests" aria-invalid={!!errors.interests} aria-describedby={errors.interests ? "interests-error" : undefined} />{errors.interests && <span className="field-error" id="interests-error">{errors.interests}</span>}</div>
                    <p className="field-hint">You can select more than one.</p>
                    {interests.includes("Others") && <div className="field"><label htmlFor="description">Please describe your interest <span>*</span></label><textarea id="description" name="description" maxLength={1000} required placeholder="Tell us what you're interested in" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} />{errors.description && <span className="field-error" id="description-error">{errors.description}</span>}</div>}
                    {message && <div className="form-error" role="alert">{message}</div>}
                    <button className="submit-button" type="submit" disabled={!ready || submitting}>{!ready ? "Loading form..." : submitting ? "Sending details..." : "Share my details"} <ArrowRight size={20} aria-hidden="true" /></button>
                    <noscript><div className="form-error">JavaScript is required to submit this form. Please enable it and reload the page.</div></noscript>
                  </form>
                  <div className="required-note">Fields marked <span>*</span> are required.</div>
                </>
              )}
            </div>
            <InstallBanner />
          </section>
        </div>
      </main>

      <footer className="site-footer"><div className="site-footer-inner"><span>SOFTQUBE TECHNOLOGIES</span><span>GOOD CONVERSATIONS START HERE</span></div></footer>
    </div>
  );
}
