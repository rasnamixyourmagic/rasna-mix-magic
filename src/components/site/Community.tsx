import { Heart, Play } from "lucide-react";
import watermelon from "@/assets/watermelon.jpg";
import orange from "@/assets/orange.jpg";
import lemon from "@/assets/lemon.jpg";
import mango from "@/assets/mango.jpg";
import mixlab from "@/assets/mixlab.jpg";

const featured = [
  { title: "Sunset Melon Fizz", author: "Aarav, Pune", likes: 2140, image: watermelon },
  { title: "Mango Chilli Cooler", author: "Diya, Chennai", likes: 1875, image: mango },
  { title: "Minted Lemon Storm", author: "Kabir, Jaipur", likes: 1642, image: lemon },
  { title: "Orange Sunrise Swirl", author: "Meera, Kochi", likes: 1508, image: orange },
  { title: "Triple Fruit MixLab", author: "Rhea, Delhi", likes: 3320, image: mixlab },
  { title: "Green Leaf Splash", author: "Ishaan, Goa", likes: 1121, image: watermelon },
];

export function Community() {
  return (
    <section id="community" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-fruit">
              Community Wall
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">
              Featured <span className="text-juice">recipes</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Real mixes from real people. Fresh drops every week, voted up by the MixYourMagic
              community.
            </p>
          </div>
          <a
            href="#upload"
            className="bg-sunrise shadow-juice w-fit rounded-2xl px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105"
          >
            Join them
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <article
              key={item.title}
              className="card-hover group relative overflow-hidden rounded-[2rem] border border-border bg-card"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.title} by ${item.author}`}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="glass-panel absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold">
                    <Play className="h-3.5 w-3.5 text-orange-fruit" /> Watch mix
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                    <Heart className="h-3.5 w-3.5 text-melon" />
                    {item.likes.toLocaleString()}
                  </span>
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.author}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
