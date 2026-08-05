import mixlab from "@/assets/mixlab.jpg";
import watermelon from "@/assets/watermelon.jpg";
import orange from "@/assets/orange.jpg";
import lemon from "@/assets/lemon.jpg";
import mango from "@/assets/mango.jpg";

type Product = {
  name: string;
  description: string;
  ingredients: string;
  image: string;
  accent: string;
  featured?: boolean;
};

const products: Product[] = [
  {
    name: "MixLab Original",
    description:
      "Our signature house blend — a colourful mixed fruit drink layered with orange, mango and watermelon for the ultimate refresher.",
    ingredients: "Orange, Mango, Watermelon, Lemon zest, Cane sugar, Sparkling water",
    image: mixlab,
    accent: "from-melon/25 to-lemon/25",
    featured: true,
  },
  {
    name: "Watermelon",
    description: "A fresh watermelon drink with ice — light, juicy and impossibly cooling.",
    ingredients: "Watermelon pulp, Lime, Ice, Rock salt, Mint",
    image: watermelon,
    accent: "from-melon/25 to-leaf/20",
  },
  {
    name: "Orange",
    description: "A refreshing orange drink packed with sun-ripened citrus and pulp.",
    ingredients: "Valencia orange, Orange pulp, Honey, Ice",
    image: orange,
    accent: "from-orange-fruit/25 to-mango/25",
  },
  {
    name: "Lemon",
    description: "A sparkling lemon drink with mint — crisp, fizzy and bright.",
    ingredients: "Lemon juice, Fresh mint, Sparkling water, Cane sugar, Ice",
    image: lemon,
    accent: "from-lemon/30 to-leaf/20",
  },
  {
    name: "Mango",
    description: "A rich mango drink, thick and golden, made from Alphonso pulp.",
    ingredients: "Alphonso mango pulp, Cardamom, Milk or water, Ice",
    image: mango,
    accent: "from-mango/30 to-lemon/25",
  },
];

function Card({ product }: { product: Product }) {
  const featured = product.featured;
  return (
    <article
      className={`card-hover group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 ${
        featured ? "sm:col-span-2 sm:row-span-2 sm:p-8" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${product.accent} opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="relative flex h-full flex-col">
        <div className="overflow-hidden rounded-[1.5rem] bg-background/40">
          <img
            src={product.image}
            alt={`Rasna ${product.name} drink`}
            loading="lazy"
            width={768}
            height={768}
            className={`mx-auto w-full object-contain transition-transform duration-700 group-hover:scale-110 ${
              featured ? "max-h-[26rem]" : "max-h-56"
            }`}
          />
        </div>

        {featured && (
          <span className="bg-sunrise mt-5 w-fit rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-primary-foreground">
            Signature
          </span>
        )}

        <h3
          className={`mt-4 font-display ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}
        >
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>

        <p className="mt-4 text-xs leading-relaxed">
          <span className="font-extrabold uppercase tracking-[0.15em] text-orange-fruit">
            Ingredients
          </span>
          <br />
          <span className="text-muted-foreground">{product.ingredients}</span>
        </p>

        <div className="mt-auto pt-6">
          <a
            href="#upload"
            className="glass-panel inline-flex rounded-2xl px-5 py-3 text-xs font-extrabold uppercase tracking-wide transition-transform group-hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </div>
    </article>
  );
}

export function Flavours() {
  return (
    <section id="flavours" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-fruit">
            Our Flavours
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">
            Pick a base. <span className="text-juice">Make it yours.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five ready-to-mix bases, endless combinations. Every bottle is a starting point for
            your own signature recipe.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
