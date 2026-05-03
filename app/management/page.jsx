import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "Leadership" };

const roles = [
  {
    title: "Research Lead",
    org: "UC Berkeley — Pederson Center for Electronic Systems Design",
    period: "Sept 2024 – May 2025",
    location: "Berkeley, CA",
    body:
      "Led a user-oriented system that helps clinicians create rehabilitation curriculums tailored to individual patients — letting doctors place virtual objects in living-area surroundings to define exercises without code, supervised by Edward Kim.",
  },
  {
    title: "Undergraduate Research Team Lead",
    org: "University of Toronto — Lee Language Lab",
    period: "Jan 2023 – May 2024",
    location: "Toronto, ON",
    body:
      "Coordinated weekly meetings, set agendas, kept notes, and built a documentation system that improved team productivity. Trained and mentored new students through onboarding and equipment setup.",
  },
  {
    title: "Unittest Lead",
    org: "Huawei Technologies Canada Ltd.",
    period: "May 2022 – Aug 2023",
    location: "Markham, ON",
    body:
      "Led a test group of interns implementing 50+ G-tests, mock tests, concurrency tests, and integration tests — strengthening product quality and meeting rigorous standards.",
  },
  {
    title: "Vice President",
    org: "Educating Chinese Children Hope Offered (ECCHO)",
    period: "Sept 2019 – May 2022",
    location: "Toronto, ON",
    body:
      "Managed outreach, event coordination, volunteer recruitment & training, and remote supervision of teaching activities. Launched online teaching and mental-health programs during the pandemic so children could keep learning.",
  },
];

export default function ManagementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Leading teams & projects"
        description="Roles where I've coordinated people, driven research direction, and built up programs."
      />
      <section className="container-narrow py-16 space-y-10">
        {roles.map((r) => (
          <article key={r.title + r.period}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {r.title}
              </h2>
              <span className="text-sm text-muted-foreground">
                {r.period} · {r.location}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-primary">{r.org}</p>
            <p className="mt-3 leading-relaxed text-foreground/90">{r.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
