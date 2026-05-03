import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Experience" };

const experiences = [
  {
    role: "Software Developer & Lead Researcher",
    org: "UC Berkeley — Cognition and Computation in Design Lab + Pederson Center",
    period: "Sept 2024 – Present",
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
    role: "Distributed Systems Engineer",
    org: "Huawei Technologies Canada — Distributed Data and Storage Lab",
    period: "May 2022 – Aug 2023",
    location: "Markham, ON",
    body:
      "Developed core database features in C/C++ for GaussDB (PostgreSQL-based), including LRU cache, consistent hashing, and B-/LSM-trees. Achieved a 150% tpmC performance boost via TPC-C benchmarking. Designed 50+ tests simulating distributed system edge cases. Presented architecture insights to 40+ engineers using KVM-based environments.",
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
