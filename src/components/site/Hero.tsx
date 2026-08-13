import { Citrus, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroBrand from "@/assets/hero-brand.jpg";

const floaters = [
  { id: "orange", color: "bg-orange-fruit", size: "h-16 w-16", className: "left-[6%] top-[22%]", delay: "0s" },
  { id: "lemon", color: "bg-lemon", size: "h-12 w-12", className: "left-[16%] bottom-[16%]", delay: "1.2s" },
  { id: "melon", color: "bg-melon", size: "h-20 w-20", className: "right-[6%] top-[14%]", delay: "0.6s" },
  { id: "mango", color: "bg-mango", size: "h-14 w-14", className: "right-[14%] bottom-[18%]", delay: "1.8s" },
  { id: "leaf", color: "bg-leaf", size: "h-10 w-10", className: "left-[45%] top-[6%]", delay: "2.4s" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-melon/30 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute -right-24 top-40 h-[26rem] w-[26rem] rounded-full bg-lemon/40 blur-3xl [animation-delay:2s]"
      />
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-leaf/20 blur-3xl [animation-delay:4s]"
      />

      {floaters.map((f) => (
        <span
          key={f.id}
          aria-hidden
          style={{ animationDelay: f.delay }}
          className={`animate-float pointer-events-none absolute hidden rounded-full opacity-80 shadow-juice ring-4 ring-background/60 sm:block ${f.size} ${f.color} ${f.className}`}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr]">
        <div className="animate-rise text-center lg:text-left">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="h-3.5 w-3.5 text-orange-fruit" />
            Create • Mix • Share
          </span>

          <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
            <span className="bg-sunrise shadow-juice grid h-14 w-14 shrink-0 place-items-center rounded-3xl text-primary-foreground">
              <Citrus className="h-7 w-7" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">Rasna</span>
          </div>

          <h1 className="mt-4 font-display text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.92] lg:text-7xl">
            <span className="text-juice">RASNA</span>
            <br />
            MIXYOURMAGIC
          </h1>

          <p className="mt-5 text-lg font-extrabold sm:text-2xl">
            Mix Your Mood. <span className="text-juice">Make It Yours.</span>
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground lg:mx-0">
            Discover our fruit flavours, blend your own signature drink in the MixLab, and share
            it with a nation of mixers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              to="/flavours"
              className="bg-sunrise shadow-juice min-h-12 rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105"
            >
              Explore Flavours
            </Link>
            <Link
              to="/mixlab"
              className="glass-panel min-h-12 rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide transition-transform hover:scale-105"
            >
              Discover MixLab
            </Link>
          </div>
        </div>

        <div className="animate-rise relative [animation-delay:150ms]">
          <div className="bg-tropic absolute inset-6 rounded-[3rem] opacity-30 blur-2xl" />
          <div className="glass-panel shadow-lift relative overflow-hidden rounded-[2.5rem] p-4 sm:rounded-[3rem] sm:p-6">
            <img
              src={heroBrand}
              alt="Rasna fruit drink with orange, mango, watermelon and lemon splashing around it"
              width={1024}
              height={1280}
              fetchPriority="high"
              className="animate-float-slow mx-auto w-full max-w-md rounded-[2rem] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
