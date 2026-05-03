import { Github, FileText, Video, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Projects" };

const groups = [
  {
    title: "Systems",
    projects: [
      {
        name: "Fault-tolerant Key-value Service",
        period: "Jan 2023 – May 2024",
        tags: ["C++", "Distributed"],
        body:
          "Distributed key-value store with replication across multiple servers, crash recovery, and concurrent client handling. Detailed design decisions and optimizations in documentation.",
        links: [
          {
            href: "https://github.com/Rachelz1231/Fault-tolerant-key-value-service",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
      {
        name: "Key-value Database System",
        period: "Sept – Dec 2023",
        tags: ["C++", "Storage"],
        body:
          "Multi-stage database with in-memory structures and persistent storage. Buffer pools with LRU eviction, static B-Trees, and an LSM-tree with Bloom filters to reduce disk I/O.",
        links: [
          {
            href: "https://github.com/Rachelz1231/Key-Value-Database",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
      {
        name: "Parallel Memory Allocator",
        tags: ["C", "Concurrency"],
        body:
          "A parallel memory allocator focused on speed, scalability, false-sharing avoidance, and minimal fragmentation. Includes design and performance evaluations.",
        links: [
          {
            href: "https://github.com/Rachelz1231/Parallel-Memory-Allocator",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
    ],
  },
  {
    title: "Software Engineering",
    projects: [
      {
        name: "Telemedicine for Stroke Rehabilitation",
        period: "Sept 2024 – Present",
        tags: ["AR", "React", "Unity"],
        body:
          "User-oriented system that helps clinicians design rehabilitation curriculums tailored to individual patients — placing virtual objects in the patient's living areas to define tasks without code.",
      },
      {
        name: "Personal Writing Assistant (Rightee)",
        tags: ["AI", "TypeScript"],
        body:
          "A writing assistant that suggests improvements while preserving the writer's voice — instead of fully rewriting content with overly fancy AI-generated prose.",
        links: [
          {
            href: "https://github.com/Rachelz1231/Rightee-AI-Writing-Assistant",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
      {
        name: "Moba Tracker Web App",
        tags: ["React", "Node.js", "MongoDB"],
        body:
          "Web app with user registration, admin governance, profile management, interactive forums, and game performance tracking with stats on win rates and champion usage.",
        links: [
          {
            href: "https://github.com/Rachelz1231/Moba-Tracker-Web-App",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
    ],
  },
  {
    title: "Data Analysis",
    projects: [
      {
        name: "Product Performance Analysis",
        tags: ["R", "Statistics"],
        body:
          "Investigated MINGAR's Fitness Tracker product line and potential wearable device deficiencies.",
        links: [
          { href: "/mingar.pdf", label: "PDF", icon: FileText },
          {
            href: "https://github.com/Rachelz1231/Methods-of-Data-Analysis",
            label: "GitHub",
            icon: Github,
          },
        ],
      },
      {
        name: "College Admissions Analysis",
        tags: ["R", "Statistics"],
        body:
          "Examined factors influencing variation in admission rates across U.S. colleges and universities.",
        links: [
          { href: "/collegeAdmission.pdf", label: "PDF", icon: FileText },
          { href: "https://youtu.be/nluSvbEiRao", label: "Video", icon: Video },
        ],
      },
      {
        name: "MLS Player Annual Earnings",
        tags: ["R", "Regression"],
        body:
          "Linear regression model relating MLS player earnings to performance — useful for clubs estimating value and players targeting earnings growth.",
        links: [{ href: "/mlsReport.pdf", label: "PDF", icon: FileText }],
      },
      {
        name: "Factorial Experiment of CPU Usage",
        tags: ["R", "Experimental design"],
        body:
          "Identified specific tasks that drive high CPU usage to help prevent slowdowns and crashes.",
        links: [{ href: "/facReport.pdf", label: "PDF", icon: FileText }],
      },
      {
        name: "Models & Algorithms for Social Networks",
        period: "Sept 2021 – Dec 2022",
        tags: ["Python", "Twitter", "ROP"],
        body:
          "Designed six utility functions and applied them to 80,000+ users and 12.7M tweets, expanding online communities through new algorithms. Presented at the 2022 ROP Fair.",
        links: [
          {
            href: "/research/social-networks",
            label: "Details",
            icon: ExternalLink,
          },
        ],
      },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I've built"
        description="Selected work across systems, software engineering, and data analysis."
      />
      <section className="container-wide py-16 space-y-16">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              {g.title}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {g.projects.map((p) => (
                <Card
                  key={p.name}
                  className="flex flex-col transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="font-serif">{p.name}</CardTitle>
                    {p.period && (
                      <CardDescription>{p.period}</CardDescription>
                    )}
                    {p.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tags.map((t) => (
                          <Badge key={t} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="leading-relaxed text-foreground/90">
                      {p.body}
                    </p>
                    {p.links && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        {p.links.map((link) => {
                          const Icon = link.icon;
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
