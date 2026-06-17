import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RangeClarity | TradingView indicators that show the range",
  description:
    "Premium TradingView indicators for reading support, resistance, momentum, entry quality, and risk zones before making the move."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
