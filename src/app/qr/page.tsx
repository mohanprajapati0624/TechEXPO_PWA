import { QrActions } from "@/components/qr-actions";
import Image from "next/image";

export default function QrPage() {
  return <main className="qr-page"><div className="qr-sheet"><div className="qr-brand">let&apos;s <span>connect</span><b>.</b></div><div className="qr-eyebrow">START A CONVERSATION</div><h1>Let&apos;s start<br />with <em>hello.</em></h1><p>Scan the code to share your details and interests.</p><div className="qr-image"><Image src="/qr/app-qr.svg" alt="QR code to open the contact details form" width="360" height="360" unoptimized /></div><div className="qr-caption">SCAN TO CONNECT <span>↗</span></div><QrActions /></div></main>;
}
