import { Leaf, Sparkles, Users, Mail, Instagram, Youtube } from "lucide-react";

const stats = [
  { value: "1.2M+", label: "Mixes shared" },
  { value: "48", label: "Cities mixing" },
  { value: "100%", label: "Real fruit flavour" },
];

const values = [
  {
    icon: Sparkles,
    title: "Creativity first",
    body: "Every bottle is a blank canvas. We celebrate the mixes nobody saw coming.",
  },
  {
    icon: Users,
    title: "Built by community",
    body: "Our best-selling flavours started as fan recipes on this very wall.",
  },
  {
    icon: Leaf,
    title: "Real fruit, real fresh",
    body: "Sun-ripened fruit, no shortcuts, and a taste that stays true to the original.",
  },
];

export function AboutContact() {
  return (
    <>
      <section id="about" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-fruit">
                About Us
              </span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">
                A nation of <span className="text-juice">mixers</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Rasna: MixYourMagic turns a simple drink into a creative playground. We give you
                the flavour bases — you bring the imagination, the twist, and the story behind
                the glass.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="glass-panel rounded-2xl p-4 text-center">
                    <p className="font-display text-2xl">{s.value}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="card-hover flex items-start gap-4 rounded-[2rem] border border-border bg-card p-6"
                >
                  <span className="bg-sunrise grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-primary-foreground">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="glass-panel shadow-lift grid gap-8 rounded-[2.5rem] p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-fruit">
                Contact
              </span>
              <h2 className="mt-3 font-display text-4xl">Let's talk flavour</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Partnerships, press, or just an idea for the next big mix — our inbox is always
                open.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hello@mixyourmagic.com"
                className="bg-sunrise shadow-juice inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-extrabold text-primary-foreground transition-transform hover:scale-105"
              >
                <Mail className="h-4 w-4" /> hello@mixyourmagic.com
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card transition-transform hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card transition-transform hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
