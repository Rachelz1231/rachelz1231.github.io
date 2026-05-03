import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Badge } from "@/components/ui/badge";
import { fetchPublications } from "@/lib/publications";

export const metadata = { title: "Publications" };
export const revalidate = 86400; // refresh data once per day

export default async function PublicationsPage() {
  const publications = await fetchPublications();

  // Group by year (most recent first)
  const byYear = publications.reduce((acc, p) => {
    const y = p.year || "Other";
    (acc[y] = acc[y] || []).push(p);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Selected publications"
        description="Refreshed daily from Semantic Scholar — peer-reviewed papers and preprints."
      />
      <section className="container-narrow py-16">
        <div className="space-y-12">
          {years.map((year) => (
            <div key={year}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  {year}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {byYear[year].length}{" "}
                  {byYear[year].length === 1 ? "paper" : "papers"}
                </span>
              </div>
              <ul className="space-y-6">
                {byYear[year].map((p, i) => (
                  <li
                    key={`${year}-${i}`}
                    className="border-l-2 border-border pl-5 transition-colors hover:border-primary"
                  >
                    <h3 className="font-medium leading-snug text-foreground">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-baseline gap-1.5 hover:text-primary hover:underline"
                        >
                          {p.title}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 translate-y-0.5" />
                        </a>
                      ) : (
                        p.title
                      )}
                    </h3>
                    <p
                      className="mt-1.5 text-sm text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: p.authors }}
                    />
                    {p.venue && (
                      <p className="mt-1 text-sm italic text-muted-foreground">
                        {p.venue}
                      </p>
                    )}
                    {p.note && (
                      <Badge variant="secondary" className="mt-2">
                        {p.note}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-muted-foreground">
          Source: Semantic Scholar (with editorial fallback). Set{" "}
          <code className="font-mono">SEMANTIC_SCHOLAR_AUTHOR_ID</code> in
          environment to enable live fetching — see{" "}
          <a
            href="https://api.semanticscholar.org/graph/v1#tag/Author-Data"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            API docs
          </a>
          .
        </p>
      </section>
    </>
  );
}
