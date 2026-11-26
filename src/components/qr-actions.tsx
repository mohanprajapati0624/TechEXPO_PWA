"use client";

import { Download, Printer } from "lucide-react";

export function QrActions() {
  return <div className="qr-actions"><a href="/qr/app-qr.svg" download="app-qr.svg"><Download size={16} /> Download SVG</a><a href="/qr/app-qr.png" download="app-qr.png"><Download size={16} /> Download PNG</a><button onClick={() => window.print()}><Printer size={16} /> Print A4 flyer</button></div>;
}
