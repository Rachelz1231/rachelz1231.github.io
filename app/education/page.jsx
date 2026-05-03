import Image from "next/image";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Education" };

const stories = [
  {
    image: "/volunteer-teaching/oakville.png",
    alt: "Oakville Galleries summer art camp",
    text: "The idea of volunteer teaching seemed far-fetched when I was young, but it gradually became central to my life. I started in grade 11, and have since dedicated five years to it. During high school I volunteered at Oakville Galleries' summer art camp, teaching children aged 6 to 12. Witnessing their creativity ignited my passion for teaching.",
  },
  {
    image: "/volunteer-teaching/classroom.png",
    alt: "Classroom in rural China",
    text: "Growing up in a developing country, I'm acutely aware of educational inequalities worldwide. From 2019 to 2022, I served on the Volunteer Teaching Team for Educating Chinese Children Hope Offered (ECCHO) — a student club and nonprofit supporting underserved children in rural China. We ran charity shops and auctions, promoted volunteer events on campus, and organized educational camps each summer.",
  },
  {
    image: "/volunteer-teaching/2022.PNG",
    alt: "Remote teaching event",
    text: "COVID-19 forced us to pause in-person events, so we pivoted to remote teaching. We organized mental-health initiatives for left-behind children through phone calls and ran pre-recorded teaching events in the Daliangshan Mountains, Sichuan. In 2022 we hosted a mental-health and teaching event for left-behind children in Linyi, Shandong.",
  },
];

export default function EducationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Education"
        title="Teaching has shaped me"
        description="Five years of volunteer teaching across Oakville and rural China."
      />
      <section className="container-narrow py-16 space-y-12">
        {stories.map((s, i) => (
          <article
            key={i}
            className="grid items-start gap-6 md:grid-cols-[280px_1fr]"
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <p className="leading-relaxed text-foreground/90">{s.text}</p>
          </article>
        ))}
        <p className="border-l-4 border-primary pl-5 italic text-foreground/90">
          Volunteer teaching isn't a phase — it's a lifelong commitment, and an
          enduring goal that pushes me to keep learning for the next
          generation.
        </p>
      </section>
    </>
  );
}
