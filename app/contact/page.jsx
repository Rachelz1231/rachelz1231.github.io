import Link from "next/link";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Contact" };

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "rachel.yuchen.zeng@gmail.com",
    href: "mailto:rachel.yuchen.zeng@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "rachel-yuchen-zeng",
    href: "https://www.linkedin.com/in/rachel-yuchen-zeng/",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "Rachelz1231",
    href: "https://github.com/Rachelz1231",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+1 510 833 8855",
    href: "https://wa.me/15108338855",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Software engineer at TikTok in San Jose. Outside of work, I'm pursuing research on AI-powered accessible healthcare — actively looking for academic collaborators in that space. Always happy to hear from people working on systems, ML, or research more broadly."
      />
      <section className="container-narrow py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="block"
              >
                <Card className="h-full p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{c.label}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {c.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
