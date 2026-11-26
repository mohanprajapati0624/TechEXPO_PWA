"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { PhoneInput } from "react-international-phone";
import { ArrowRight, Check, CheckCircle2, ChevronDown, Globe2, LockKeyhole, UsersRound } from "lucide-react";
import { CATEGORIES, registrationSchema } from "@/lib/registration";
import { InstallBanner } from "./install-banner";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "category", string>>;
const subscribe = () => () => {};

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const source = new URLSearchParams(window.location.search).get("source") === "qr" ? "qr" : "direct";
    const result = registrationSchema.safeParse({ name, email, phone, category, source });
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      setErrors({ name: fields.name?.[0], email: fields.email?.[0], phone: fields.phone?.[0], category: fields.category?.[0] });
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
        setMessage(data.error ?? "Unable to save your registration. Please try again.");
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
        <Link className="brand" href="/" aria-label="Tech Expo home"><span className="brand-mark">T<span>.</span></span><span>tech<span className="brand-light">expo</span><small>CONNECT. DISCOVER. GROW.</small></span></Link>
        <div className="header-note"><span className="status-dot" /> REGISTRATION OPEN</div>
      </header>

      <main className="main-content">
        <section className="intro" aria-labelledby="intro-heading">
          <div className="eyebrow"><span className="eyebrow-dot" /> WELCOME TO TECH EXPO</div>
          <h1 id="intro-heading">Good ideas start with <em>great connections.</em></h1>
          <p>Discover new ideas, meet new people, and be part of what&apos;s next.</p>
          <div className="intro-foot"><span className="intro-icon"><UsersRound size={20} /></span><div><strong>Everyone is welcome</strong><span>Register to join the experience.</span></div></div>
        </section>

        <section className="form-area" aria-label="Registration">
          <div className="form-card">
            {success ? (
              <div className="success-panel" role="status">
                <span className="success-icon"><CheckCircle2 size={32} /></span>
                <div className="form-kicker">YOU&apos;RE ALL SET</div>
                <h2>Registration successful!</h2>
                <p>Your registration has been received. We&apos;re excited to connect with you.</p>
              </div>
            ) : (
              <>
                <div className="card-heading"><div><div className="form-kicker">REGISTRATION</div><h2>Let&apos;s get you started.</h2><p>Just a few details to join us.</p></div></div>
                <form action="/api/registrations" method="post" onSubmit={submit} noValidate>
                  <div className="field"><label htmlFor="name">Full name <span>*</span></label><input id="name" name="name" autoComplete="name" maxLength={100} required placeholder="How should we call you?" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
                  <div className="field"><label htmlFor="email">Email address <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" maxLength={255} required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
                  <div className="field"><label htmlFor="phone">Phone number <span>*</span></label><PhoneInput defaultCountry="in" value={phone} onChange={setPhone} inputProps={{ id: "phone", name: "phone", autoComplete: "tel", inputMode: "tel", required: true, "aria-invalid": !!errors.phone, "aria-describedby": errors.phone ? "phone-error" : undefined }} placeholder="Enter your phone number" />{errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}</div>
                  <div className="field"><label htmlFor="category">I&apos;m joining as <span>*</span></label><div className="select-wrap"><select id="category" name="category" required value={category} onChange={(e) => setCategory(e.target.value)} aria-invalid={!!errors.category} aria-describedby={errors.category ? "category-error" : undefined}><option value="">Select your category</option>{CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={17} aria-hidden="true" /></div>{errors.category && <span className="field-error" id="category-error">{errors.category}</span>}</div>
                  {message && <div className="form-error" role="alert">{message}</div>}
                  <button className="submit-button" type="submit" disabled={!ready || submitting}>{!ready ? "Loading form..." : submitting ? "Registering..." : "Complete registration"} <ArrowRight size={19} /></button>
                  <noscript><div className="form-error">JavaScript is required to submit this form. Please enable it and reload the page.</div></noscript>
                </form>
                <div className="privacy-note"><LockKeyhole size={14} /> Your details are safe with us.</div>
              </>
            )}
          </div>
          <div className="under-card"><span><Check size={14} /> QUICK &amp; EASY</span><span><Globe2 size={14} /> OPEN TO EVERYONE</span></div>
          <InstallBanner />
        </section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} TECH EXPO</span><span>MADE FOR MEANINGFUL CONNECTIONS</span></footer>
    </div>
  );
}
