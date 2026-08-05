import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Citrus, Instagram, Mail, Youtube } from "lucide-react";

const SITE_URL = "https://rasna-mix-magic.lovable.app";

export function Footer() {
  const [qrUrl, setQrUrl] = useState(SITE_URL);

  useEffect(() => {
    setQrUrl(typeof window !== "undefined" ? window.location.origin : SITE_URL);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-border py-14">
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-orange-fruit/20 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="bg-sunrise grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-primary-foreground">
              <Citrus className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">Rasna: MixYourMagic</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">Create • Mix • Share</p>
        </div>

        <div className="flex flex-col items-start gap-6 lg:items-center lg:flex-row">
          <div className="glass-panel flex items-center gap-4 rounded-2xl p-4">
            <div className="shadow-juice rounded-xl bg-white p-2">
              <QRCodeSVG value={qrUrl} size={88} level="M" fgColor="#1a1205" bgColor="#ffffff" />
            </div>
            <div className="text-sm">
              <p className="font-extrabold">Scan to visit</p>
              <p className="max-w-[12rem] break-all text-xs font-medium text-muted-foreground">
                {qrUrl}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://instagram.com"
              className="glass-panel inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a
              href="https://youtube.com"
              className="glass-panel inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105"
            >
              <Youtube className="h-4 w-4" /> YouTube
            </a>
            <a
              href="mailto:hello@mixyourmagic.com"
              className="glass-panel inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </div>
      </div>

      <p className="relative mt-10 px-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rasna: MixYourMagic. All rights reserved.
      </p>
    </footer>
  );
}
