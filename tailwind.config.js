// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Existing color definitions
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          /* ... */
        },
        popover: {
          /* ... */
        },
        primary: {
          /* ... */
        },
        secondary: {
          /* ... */
        },
        muted: {
          /* ... */
        },
        accent: {
          /* ... */
        },
        destructive: {
          /* ... */
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          /* ... */
        },

        // Add these new color definitions
        emerald: "hsl(var(--primary))",
        wasabi: "hsl(var(--secondary))",
        khaki: "hsl(var(--accent))",
        egyptian: "#6C5B4D", // Add actual hex value from your design
        noir: "#1A1A1A", // Add actual hex value from your design
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
