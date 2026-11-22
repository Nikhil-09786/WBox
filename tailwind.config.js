/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        wb: {
          dark: "#0b0f17",
          card: "#121824",
          border: "#1f293d",
          muted: "#94a3b8",
          charity: "#10b981",    // Green for 30% Charity
          grant: "#3b82f6",      // Blue for 60% Beneficiaries
          platform: "#8b5cf6",   // Purple for 10% Platform
          gold: "#f59e0b",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
