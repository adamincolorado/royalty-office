import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Newsreader, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  adjustFontFallback: false,
});
const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Royalty Office — a family office for your minerals",
    template: "%s · Royalty Office",
  },
  description:
    "Texas mineral and royalty owners: see your wells, your cashflow, and " +
    "what's coming next — built from the public record, explained in plain " +
    "English.",
  metadataBase: new URL("https://royaltyoffice.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Clerk's own UI inherits the house palette so a sign-in screen does not
    // look like a bolted-on third party. Brand tokens live in tailwind.config.
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1f4b3f",
          colorText: "#14201c",
          colorBackground: "#ffffff",
          borderRadius: "0.35rem",
        },
      }}
    >
      <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <body className="bg-paper text-ink font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
