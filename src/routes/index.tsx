import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Community } from "@/components/site/Community";
import { AboutContact } from "@/components/site/AboutContact";

const title = "Rasna: MixYourMagic — Mix Your Mood. Make It Yours.";
const description =
  "Discover Rasna's summer and winter fruit flavours, create your own drink in the MixLab, upload your recipe video and join a nation of mixers.";

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
          slogan: "Mix Your Mood. Make It Yours.",
          url: "/",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Community />
      <AboutContact />
      <div className="text-center py-8">
        <Link to="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Admin Access
        </Link>
      </div>
    </div>
  );
}
