import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileText,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RESUME_URL, CV_URL } from "@/lib/links";

const highlights = [
  {
    title: "TikTok",
    detail: "Software Engineer — Search Engine ML/AI Infrastructure",
  },
  {
    title: "UC Berkeley",
    detail: "M.Eng., Electrical Engineering & Computer Science (2024–2025)",
  },
  {
    title: "University of Toronto",
    detail: "B.Sc., Computer Science & Statistics (2019–2024)",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* soft background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-cream via-sage-50 to-transparent"
      />

      <section className="container-narrow pt-20 pb-24 sm:pt-28">
        <div className="grid items-center gap-12 md:grid-cols-[auto_1fr]">
          <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full ring-4 ring-sage-100 sm:h-56 sm:w-56">
            <Image
              src="/home/profile-photo.jpg"
              alt="Rachel Zeng"
              fill
              sizes="(max-width: 640px) 176px, 224px"
              className="object-cover"
              priority
            />
          </div>

          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              Software engineer & researcher
            </Badge>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Hi, I'm Rachel.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              I build systems and study how people use them. Currently a
              software engineer at TikTok working on search infrastructure,
              after completing my M.Eng. at UC Berkeley and a B.Sc. in Computer
              Science & Statistics at the University of Toronto.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/experiences">
                  See my work
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  Resume
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href={CV_URL} target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="h-4 w-4" />
                  Academic CV
                </a>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-muted-foreground">
              <a
                href="https://github.com/Rachelz1231"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/rachel-yuchen-zeng/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:rachel.yuchen.zeng@gmail.com"
                className="transition-colors hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="container-narrow py-16">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Currently
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {highlights.map((h) => (
              <li
                key={h.title}
                className="rounded-lg border border-border/60 bg-card p-5"
              >
                <p className="text-sm font-medium text-primary">{h.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{h.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
