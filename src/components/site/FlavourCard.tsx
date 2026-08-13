import { Link } from "@tanstack/react-router";
import { Citrus } from "lucide-react";

export type Flavour = {
  name: string;
  description: string;
  image: string;
  accent: string;
  cta: string;
};

export function FlavourCard({ flavour }: { flavour: Flavour }) {
  return (
    <article className="card-hover group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 sm:p-6">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${flavour.accent} opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-2">
          <span className="bg-sunrise grid h-7 w-7 place-items-center rounded-xl text-primary-foreground">
            <Citrus className="h-3.5 w-3.5" />
          </span>
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em]">Rasna</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-background/50">
          <img
            src={flavour.image}
            alt={`Rasna ${flavour.name} drink`}
            loading="lazy"
            width={768}
            height={768}
            className="mx-auto max-h-64 w-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <h3 className="mt-5 font-display text-2xl sm:text-3xl">{flavour.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{flavour.description}</p>

        <div className="mt-auto pt-6">
          <Link
            to="/buy"
            className="glass-panel inline-flex min-h-11 items-center rounded-2xl px-5 py-3 text-xs font-extrabold uppercase tracking-wide transition-transform group-hover:scale-105"
          >
            {flavour.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}
