import { TourGuideShell } from "@/components/tour_guide/TourGuideShell";

export const metadata = {
  title: {
    default: "旅游规划",
    template: "%s — 旅游规划",
  },
  description: "按目的地整理的行程计划。",
  robots: { index: false, follow: false },
};

export default function TourGuideLayout({ children }) {
  return <TourGuideShell>{children}</TourGuideShell>;
}
