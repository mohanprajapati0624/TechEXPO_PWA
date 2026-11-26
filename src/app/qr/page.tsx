import Image from "next/image";
import { QrActions } from "@/components/qr-actions";
import { BrandLogo } from "@/components/brand-logo";

export default function QrPage() {
  return (
    <main className="qr-page">
      <Image className="hero-bg" src="/hero/hero-bg-1672.webp" alt="" fill priority sizes="100vw" />
      <div className="qr-sheet">
        <span className="card-glow" aria-hidden="true" />
        <BrandLogo />
        <h1>Let&apos;s start<br />with <em>hello.</em></h1>
        <span className="hero-rule" aria-hidden="true" />
        <p>Scan the code to share your details and interests with Softqube.</p>
        <div className="qr-image"><Image src="/qr/app-qr.svg" alt="QR code to open the contact details form" width="360" height="360" unoptimized /></div>
        <div className="qr-caption">Scan to connect <span>↗</span></div>
        <QrActions />
      </div>
    </main>
  );
}
