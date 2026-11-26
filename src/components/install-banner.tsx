"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowDownToLine, Share, X } from "lucide-react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const subscribe = () => () => {};
const isIosSafari = () => {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) && !window.matchMedia("(display-mode: standalone)").matches && !("standalone" in navigator && navigator.standalone);
};

export function InstallBanner() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const ios = useSyncExternalStore(subscribe, isIosSafari, () => false);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const installed = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (dismissed || (!installEvent && !ios)) return null;
  return (
    <aside className="install-banner" aria-label="Install app">
      <div className="install-icon">{ios ? <Share size={18} /> : <ArrowDownToLine size={18} />}</div>
      <div className="install-copy">
        <strong>Keep this page close</strong>
        <span>{ios ? "Tap Share, then Add to Home Screen." : "Add this app to your home screen."}</span>
      </div>
      {installEvent && <button className="install-action" onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}>Install</button>}
      <button className="icon-button" aria-label="Dismiss install instructions" onClick={() => setDismissed(true)}><X size={17} /></button>
    </aside>
  );
}
