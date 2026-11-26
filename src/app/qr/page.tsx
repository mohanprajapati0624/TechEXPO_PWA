import { QrActions } from "@/components/qr-actions";
import { BrandLogo } from "@/components/brand-logo";
import Image from "next/image";

export default function QrPage() {
  return <main className="qr-page"><div className="qr-sheet"><BrandLogo /><h1>Let&apos;s start<br />with <em>hello.</em></h1><p>Scan the code to share your details and interests with Softqube.</p><div className="qr-image"><Image src="/qr/app-qr.svg" alt="QR code to open the contact details form" width="360" height="360" unoptimized /></div><div className="qr-caption">SCAN TO CONNECT <span>↗</span></div><QrActions /></div></main>;
}
