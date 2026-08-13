import { createFileRoute } from "@tanstack/react-router";
import { UploadSection } from "@/components/site/UploadSection";

const title = "Upload Your Recipe — Rasna: MixYourMagic";
const description =
  "Film your Rasna mix and upload it: name, email, recipe title, description and a video (MP4, MOV or AVI up to 50 MB).";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function UploadPage() {
  return (
    <div className="overflow-x-hidden pt-16 sm:pt-24">
      <UploadSection />
    </div>
  );
}
