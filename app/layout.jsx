import { Inter, Playfair_Display } from "next/font/google";
import { SiteChrome } from "@/components/sections/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://rachelz.ca"),
  title: {
    default: "Rachel Zeng",
    template: "%s — Rachel Zeng",
  },
  description:
    "Rachel Zeng — software engineer and researcher. UC Berkeley M.Eng., University of Toronto B.Sc.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fefae0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
