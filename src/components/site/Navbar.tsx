import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Citrus } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Flavours", href: "#flavours" },
  { label: "Upload Your Unique", href: "#upload" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl px-4 py-3 transition-all duration-500 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] ${
          scrolled ? "glass-panel shadow-juice mx-3 lg:mx-auto" : "bg-transparent"
        }`}
      >
        <a href="#home" className="flex min-w-0 items-center gap-2">
          <span className="bg-sunrise grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-primary-foreground">
            <Citrus className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-extrabold tracking-tight sm:text-xl">
            Rasna<span className="text-juice">: MixYourMagic</span>
          </span>
        </a>

        <ul className="hidden items-center justify-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card transition-transform hover:scale-105"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#upload"
            className="bg-sunrise shadow-juice hidden rounded-2xl px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 sm:inline-flex"
          >
            Upload Recipe
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel animate-rise mx-3 mt-2 rounded-3xl p-3 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
