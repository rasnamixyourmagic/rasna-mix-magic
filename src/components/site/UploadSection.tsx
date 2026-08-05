import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { z } from "zod";
import { CheckCircle2, UploadCloud } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(255),
  title: z.string().trim().min(3, "Give your recipe a title").max(100),
  description: z.string().trim().min(10, "Tell us a little more").max(1000),
});

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPTED = [".mp4", ".mov", ".avi"];

const steps = [
  "Open website",
  "Explore flavours",
  "Click Upload",
  "Submit recipe",
  "Confetti + success message",
];

const FALLBACK_URL = "https://rasna-mix-magic.lovable.app/#upload";

export function UploadSection() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");
  const [done, setDone] = useState(false);
  const [qrUrl, setQrUrl] = useState(FALLBACK_URL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQrUrl(`${window.location.origin}/#upload`);
    if (window.location.hash === "#upload") {
      requestAnimationFrame(() =>
        document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  }, []);


  const celebrate = () => {
    const colors = ["#FF8C00", "#FFD700", "#FF4D4D", "#FFA500", "#228B22"];
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(
      () => confetti({ particleCount: 90, angle: 60, spread: 65, origin: { x: 0 }, colors }),
      180,
    );
    setTimeout(
      () => confetti({ particleCount: 90, angle: 120, spread: 65, origin: { x: 1 }, colors }),
      320,
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
    });

    const next: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
    }

    const file = data.get("video");
    if (!(file instanceof File) || file.size === 0) {
      next['video'] = "Please attach your recipe video";
    } else {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED.includes(ext)) next['video'] = "Only MP4, MOV or AVI files are accepted";
      else if (file.size > MAX_BYTES) next['video'] = "Video must be 50 MB or smaller";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setDone(true);
    celebrate();
    formRef.current?.reset();
    setFileName("");
  };

  const field =
    "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

  return (
    <section id="upload" className="relative py-24">
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-mango/25 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-fruit">
            Upload Your Unique
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Show us your <span className="text-juice">magic mix</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Film your recipe, send it over, and it could land on the community wall.
          </p>

          <div className="glass-panel mt-8 rounded-[2rem] p-6">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em]">
              <QrCode className="h-4 w-4 text-orange-fruit" /> How it works
            </span>
            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="shadow-juice rounded-2xl bg-white p-3">
                <QRCodeSVG value={qrUrl} size={132} level="M" fgColor="#1a1205" bgColor="#ffffff" />
              </div>
              <p className="text-center text-sm font-semibold text-muted-foreground sm:text-left">
                Scan to jump straight to the upload form on your phone.
                <span className="mt-2 block break-all text-xs font-medium">{qrUrl}</span>
              </p>
            </div>
            <ol className="mt-5 grid gap-3">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="bg-sunrise grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

        </div>

        <div className="glass-panel shadow-lift relative overflow-hidden rounded-[2.5rem] p-6 sm:p-9">
          {done ? (
            <div className="animate-rise flex min-h-[26rem] flex-col items-center justify-center text-center">
              <span className="bg-sunrise shadow-juice grid h-20 w-20 place-items-center rounded-full text-primary-foreground">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <h3 className="mt-6 font-display text-3xl">Recipe submitted!</h3>
              <p className="mt-3 max-w-sm text-muted-foreground">
                Thanks for mixing your magic. Our team reviews every entry — keep an eye on the
                community wall.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#home"
                  onClick={() => {
                    setDone(false);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}
                  className="bg-sunrise rounded-2xl px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105"
                >
                  Back to homepage
                </a>

                <button
                  onClick={() => setDone(false)}
                  className="rounded-2xl border border-border px-6 py-3 text-sm font-extrabold uppercase tracking-wide transition-transform hover:scale-105"
                >
                  Submit another
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  Name
                  <input name="name" maxLength={80} placeholder="Your name" className={field} />
                  {errors['name'] && <span className="text-xs text-destructive">{errors['name']}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Email address
                  <input
                    name="email"
                    type="email"
                    maxLength={255}
                    placeholder="you@example.com"
                    className={field}
                  />
                  {errors['email'] && (
                    <span className="text-xs text-destructive">{errors['email']}</span>
                  )}
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold">
                Recipe title
                <input
                  name="title"
                  maxLength={100}
                  placeholder="e.g. Sunset Melon Fizz"
                  className={field}
                />
                {errors['title'] && <span className="text-xs text-destructive">{errors['title']}</span>}
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Description
                <textarea
                  name="description"
                  rows={4}
                  maxLength={1000}
                  placeholder="Ingredients, steps, and what makes it magic..."
                  className={`${field} resize-none`}
                />
                {errors['description'] && (
                  <span className="text-xs text-destructive">{errors['description']}</span>
                )}
              </label>

              <div className="grid gap-2 text-sm font-bold">
                Video upload
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-8 text-center transition-colors hover:border-orange-fruit">
                  <UploadCloud className="h-7 w-7 text-orange-fruit" />
                  <span className="text-sm font-bold">
                    {fileName || "Drop your video or browse"}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    MP4, MOV or AVI • max 50 MB
                  </span>
                  <input
                    name="video"
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  />
                </label>
                {errors['video'] && <span className="text-xs text-destructive">{errors['video']}</span>}
              </div>

              <button
                type="submit"
                className="bg-sunrise shadow-juice mt-2 rounded-2xl px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Submit my recipe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
