import Image from "next/image";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata = { title: "More" };

const photos = [
  { src: "/more/hiking.jpg", alt: "Hiking" },
  { src: "/more/hiking2.jpg", alt: "Hiking" },
  { src: "/more/running.jpg", alt: "Running" },
  { src: "/more/bike.jpg", alt: "Biking" },
  { src: "/more/ice.jpg", alt: "Skating" },
  { src: "/more/travel.jpg", alt: "Travel" },
  { src: "/more/DSC00712.jpg", alt: "Adventure" },
  { src: "/more/DSC05015.jpg", alt: "Adventure" },
  { src: "/more/IMG_0917.JPG", alt: "Adventure" },
  { src: "/more/IMG_1170.jpg", alt: "Adventure" },
  { src: "/more/IMG_1624.PNG", alt: "Adventure" },
  { src: "/more/IMG_4923.JPG", alt: "Adventure" },
  { src: "/more/IMG_7846.JPG", alt: "Adventure" },
];

export default function MorePage() {
  return (
    <>
      <PageHeader
        eyebrow="More"
        title="Beyond the keyboard"
        description="The fun side — adventures and passions outside academia and the office."
      />
      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="leading-relaxed text-foreground/90">
            I got into sports a couple years ago and have been active ever since
            — snowboarding, running, and hiking are how I unwind. In May 2023 I
            finished my first 10k in Toronto, and a half marathon is on the
            horizon.
          </p>
          <p className="leading-relaxed text-foreground/90">
            I also love traveling and road trips. Each journey opens my eyes to
            different cultures and ways of life — and there's nothing like
            stumbling into nature you didn't know you needed.
          </p>
        </div>

        <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {photos.map((p) => (
            <div
              key={p.src}
              className="relative overflow-hidden rounded-lg border border-border bg-muted break-inside-avoid"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={600}
                height={800}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
