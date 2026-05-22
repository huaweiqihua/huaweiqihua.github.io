import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "ModelVault | Model Kits And Designer Toy Drops",
    template: "%s | ModelVault"
  },
  description: "Daily-synced model kit and designer toy drops with TikTok Shop and Temu price comparison.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
