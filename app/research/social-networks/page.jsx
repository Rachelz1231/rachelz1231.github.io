import Image from "next/image";
import { FileText, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Social Networks" };

export default function SocialNetworksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Models & Algorithms for Social Networks"
        description="Twitter data, community detection, and understanding how people exchange information online."
      />
      <section className="container-narrow py-16 space-y-10 leading-relaxed text-foreground/90">
        <p>
          Social networking applications generate terabytes of data daily,
          offering a unique window into how people interact and exchange
          information. As an ROP student, I had the privilege of researching
          social networks alongside Professor Peter Marbach. Together we
          discovered fascinating characteristics within communities formed on
          Twitter — and I continued the work into a research project course in
          summer 2022.
        </p>

        <div>
          <h2 className="font-serif text-2xl font-semibold">
            Findings during 2021–2022 (ROP)
          </h2>
          <p className="mt-3">
            In social networks, communities form around shared interests. Some
            users — "core users" — exhibit higher connectivity than others. To
            identify them on Twitter, we built the Network Algorithm Contained
            Experiment System (SNACES). Given a random user, SNACES finds their
            local neighborhoods, clusters users, and ranks them to identify the
            most connected individual. The process repeats until SNACES
            converges on a single user.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold">Goals & metrics</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Community core:</strong> starting from a random user, find
              the core members of their community.
            </li>
            <li>
              <strong>Community expansion:</strong> from core users, expand to
              map the broader community structure.
            </li>
            <li>
              <strong>Production:</strong> retweets a user's original tweets
              receive from others in the community.
            </li>
            <li>
              <strong>Consumption:</strong> retweets the user makes of others'
              original tweets in the community.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src="/social-networks/poster.PNG"
              alt="Research poster"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="/social-networks/poster.PNG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Open poster
            </a>
            <a
              href="/social-networks/report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <FileText className="h-4 w-4" /> Report — Twitter Community
              Expansion Algorithm (May 2022)
            </a>
            <a
              href="/social-networks/report2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <FileText className="h-4 w-4" /> Report — Community Expansion
              Algorithms (Dec 2022)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
