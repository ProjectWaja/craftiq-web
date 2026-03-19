import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthSync from "@/components/AuthSync";

export const metadata: Metadata = {
  title: "CraftIQ — Master Trade Codes Through Puzzles",
  description:
    "825+ puzzles across 10 trades. Master NEC, IMC, ASHRAE & SMACNA codes the fun way. Built for UA, IBEW & SMACNA apprentices.",
  keywords: [
    "trade apprentice",
    "union training",
    "IBEW",
    "UA",
    "SMACNA",
    "plumbing code",
    "electrical code",
    "HVAC training",
    "NEC",
    "apprenticeship",
    "trade puzzles",
    "code education",
  ],
  openGraph: {
    title: "CraftIQ — Master Trade Codes Through Puzzles",
    description:
      "Stop memorizing code books. Start solving real trade puzzles. 825+ puzzles rooted in real construction projects.",
    url: "https://craftiq.org",
    siteName: "CraftIQ",
    type: "website",
    images: [
      {
        url: "/images/banners/social-share.png",
        width: 1200,
        height: 630,
        alt: "CraftIQ — Union trade education through puzzles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CraftIQ — Master Trade Codes Through Puzzles",
    description:
      "825+ puzzles across 10 trades. Built for UA, IBEW & SMACNA apprentices.",
    images: ["/images/banners/social-share.png"],
  },
  metadataBase: new URL("https://craftiq.org"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <AuthProvider>
          <AuthSync />
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
