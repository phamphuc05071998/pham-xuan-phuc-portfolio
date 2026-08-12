import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phạm Xuân Phúc | Frontend Developer",
  description:
    "Frontend Developer in Hanoi building thoughtful, responsive and production-ready web experiences with React, Next.js and TypeScript.",
  openGraph: {
    title: "Phạm Xuân Phúc | Frontend Developer",
    description:
      "Production web experiences built with React, Next.js and TypeScript — from first decision to deployment.",
    type: "website",
    images: [
      {
        url: "/og-card.png",
        width: 1743,
        height: 909,
        alt: "Phạm Xuân Phúc — Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phạm Xuân Phúc | Frontend Developer",
    description:
      "Production web experiences built with React, Next.js and TypeScript.",
    images: ["/og-card.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
