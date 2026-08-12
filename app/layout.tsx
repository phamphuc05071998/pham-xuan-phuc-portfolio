import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://pham-xuan-phuc-portfolio.phamphuc05071998.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
        url: `${basePath}/og-card.png`,
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
    images: [`${basePath}/og-card.png`],
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
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
