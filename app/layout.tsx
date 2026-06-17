import type { Metadata } from "next";
import "./globals.css";

const description =
  "A clean TradingView dashboard for trend, support, resistance, range, location, and extension. No signals. No hype. Just chart clarity.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rangeclarity.com"),
  title: "RangeClarity - Clean chart context in seconds",
  description,
  applicationName: "RangeClarity",
  keywords: [
    "TradingView dashboard",
    "chart context",
    "support and resistance",
    "trend",
    "range",
    "ATR extension",
  ],
  openGraph: {
    title: "RangeClarity - Clean chart context in seconds",
    description,
    url: "/",
    siteName: "RangeClarity",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RangeClarity - Clean chart context in seconds",
    description,
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
