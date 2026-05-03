import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Experience" };

const experiences = [
  {
    role: "Software Engineer",
    org: "TikTok — Search Engine, ML and AI Infrastructure",
    period: "June 2025 – Present",
    location: "San Jose, CA",
    body:
      "Re-architected the e-commerce search pipeline to integrate a generative retrieval module with LLM-based Semantic ID retrieval into the existing multi-stage cascading system, supporting real-time inverted index serving over 800M documents. Designed and owned a distributed aggregation service that decomposed retrieval and merge logic from a monolithic engine for independent scaling — enabling 2× retrieval candidate volume with 5.4% lower ranking latency and +1.4% click-through rate, serving 141M+ daily page views across 5+ regions during 60× traffic growth. Built autonomous AI agents for performance optimization (analyzing flamegraphs, writing merge requests, self-validating via metric regression detection) and cross-region latency diagnosis. Reduced search end-to-end latency by up to 40 ms P80 (5%) via an asynchronous result prepack pipeline, lifting search engagement +0.28% across the full US user base.",
  },
  {
    role: "Graduate Researcher",
    org: "UC Berkeley — Cognition and Computation in Design Lab + Pederson Center",
    period: "Sept 2024 – May 2025",
    location: "Berkeley, CA",
    body:
      "Led development of a Chrome extension with TypeScript, React, and Flask integrating generative AI for visual stimuli research. Built a personalized AR rehabilitation task authoring tool using Unity on Meta Quest 3. Created a compliant EMR web system using React, Next.js, Node.js, and Firebase. Hosted cloud infrastructure on AWS, integrating CI/CD with Jenkins and Docker.",
  },
  {
    role: "Software Developer & Lead Researcher",
    org: "University of Toronto — Intelligent Adaptive Interventions Lab",
    period: "Aug 2023 – May 2024",
    location: "Toronto, ON",
    body:
      "Deployed full-stack SaaS tools using GPT-4 and LLMs to support youth in mental health and creative writing. Developed apps with React.js, NestJS, Flask, and MongoDB for iOS, Android, and Web. Led user studies and co-authored 3 peer-reviewed papers, including CHI submissions.",
  },
  {
    role: "Assistant Engineer",
    org: "Huawei Technologies Canada — Distributed Data and Storage Management Lab",
    period: "May 2022 – Aug 2023",
    location: "Markham, ON",
    body:
      "Implemented buffer pool with LRU eviction and page directory modules for GaussDB, Huawei's enterprise-grade distributed PostgreSQL-based database. Used consistent hashing with virtual nodes to partition pages across nodes, enabling hash-directed failover for fast replica lookup on node failure. Developed replica-assisted crash recovery so restarting nodes rebuild state from peers' in-memory buffer pools rather than disk — contributing to a 150% throughput increase on industry-standard OLTP benchmarks. Led a test group that built concurrency and failover suites validating correctness under concurrent buffer pool access, page directory updates, and multi-node crash recovery.",
  },
  {
    role: "ML Engineer & Lead Researcher",
    org: "University of Toronto — Lee Language Lab",
    period: "Jan 2023 – May 2024",
    location: "Toronto, ON",
    body:
      "Conducted 100+ ML experiments optimizing translation models like mBART, mT5, and XLM-R. Boosted BLEU scores by 20% for low-resource languages through task transfer learning. Led project management across the full research lifecycle.",
  },
  {
    role: "Researcher",
    org: "University of Toronto — Social Networks (Prof. Peter Marbach)",
    period: "Sept 2021 – Dec 2022",
    location: "Toronto, ON",
    body:
      "Designed and assessed six utility functions for defining social-network hierarchies, applied to over 80,000 users and 12.7M tweets. Presented findings to 100+ students and faculty at the 2022 ROP Fair.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Where I've worked"
        description="A timeline of roles in research, distributed systems, and applied ML."
      />
      <section className="container-narrow py-16">
        <ol className="relative space-y-10 border-l border-border pl-6">
          {experiences.map((e) => (
            <li key={e.role + e.period} className="relative">
              <span className="absolute -left-[33px] top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {e.role}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {e.period} · {e.location}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">{e.org}</p>
              <p className="mt-3 leading-relaxed text-foreground/90">{e.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
