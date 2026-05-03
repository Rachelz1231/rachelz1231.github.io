import { FileText } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Lee Lab" };

export default function LeeLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Lee Language Lab"
        description="ML experiments on multilingual translation models and low-resource languages."
      />
      <section className="container-narrow py-16">
        <a
          href="/lee-lab/slides.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base font-medium text-primary hover:underline"
        >
          <FileText className="h-5 w-5" /> Open slides
        </a>
      </section>
    </>
  );
}
