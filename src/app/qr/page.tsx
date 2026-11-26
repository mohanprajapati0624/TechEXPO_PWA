import { QrActions } from "@/components/qr-actions";
import Image from "next/image";

export default function QrPage() {
  return <main className="qr-page"><div className="qr-sheet"><div className="qr-brand">tech<span>expo</span><b>.</b></div><div className="qr-eyebrow">LET&apos;S CONNECT</div><h1>Big ideas start<br />with <em>hello.</em></h1><p>Scan the code to register and join the experience.</p><div className="qr-image"><Image src="/qr/app-qr.svg" alt="QR code to open the Tech Expo registration page" width="360" height="360" unoptimized /></div><div className="qr-caption">SCAN TO REGISTER <span>↗</span></div><QrActions /></div></main>;
}
