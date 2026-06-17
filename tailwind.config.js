/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        graphite: "#101723",
        line: "rgba(148, 163, 184, 0.18)",
        platinum: "#e7ebf2",
        bone: "#f5f1e8",
        signal: "#9fd3ff",
        mint: "#a8f0d1",
        amber: "#d9b46c"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(2, 6, 23, 0.32)",
        terminal: "0 20px 60px rgba(0, 0, 0, 0.44)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        mono: [
          "IBM Plex Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace"
        ]
      }
    }
  },
  plugins: []
};
