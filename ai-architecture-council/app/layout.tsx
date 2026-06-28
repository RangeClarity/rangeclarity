import type { ReactNode } from "react";

export const metadata = { title: "AI Architecture Council", description: "Multi-agent consultation + debate → one decision → Hermes plan → Linear preview." };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0e17", color: "#e6edf3", fontFamily: "ui-sans-serif, system-ui" }}>
        {/* TODO(impl): wrap with <QueryClientProvider> (React Query) + shadcn ThemeProvider. */}
        {children}
      </body>
    </html>
  );
}
