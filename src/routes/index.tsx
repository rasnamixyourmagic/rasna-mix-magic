import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Flavours } from "@/components/site/Flavours";
import { UploadSection } from "@/components/site/UploadSection";
import { Community } from "@/components/site/Community";
import { AboutContact } from "@/components/site/AboutContact";
import { Footer } from "@/components/site/Footer";

const title = "Rasna: MixYourMagic — Create, Mix & Share Fruit Recipes";
const description =
  "Explore Rasna's fruit flavours, mix your own signature drink, upload your recipe video and join a national community of mixers.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Rasna: MixYourMagic",
          slogan: "Create • Mix • Share",
          url: "/",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Flavours />
        <UploadSection />
        <Community />
        <AboutContact />
      </main>
      <Footer />
    </div>
  );
}
