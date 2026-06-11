import type { Metadata } from "next";
import "@/styles/globals.css";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "ModelVault | Model Kits And Designer Toy Drops",
    template: "%s | ModelVault"
  },
  description: "Daily-synced model kit and designer toy drops with TikTok Shop and Temu price comparison.",
  metadataBase: getSiteUrl(),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ModelVault | Model Kits And Designer Toy Drops",
    description: "Daily-synced model kit and designer toy drops with TikTok Shop and Temu price comparison.",
    url: "/",
    siteName: "ModelVault",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ModelVault | Model Kits And Designer Toy Drops",
    description: "Daily-synced model kit and designer toy drops with TikTok Shop and Temu price comparison."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
