/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // IPLC custom colors
        "iplc-primary": "hsl(var(--iplc-primary))",
        "iplc-primary-dark": "hsl(var(--iplc-primary-dark))",
        "iplc-accent-sky": "hsl(var(--iplc-accent-sky))",
        "iplc-accent-gold": "hsl(var(--iplc-accent-gold))",
        "iplc-accent-green": "hsl(var(--iplc-accent-green))",
        "iplc-neutral-700": "hsl(var(--iplc-neutral-700))",
        "iplc-neutral-200": "hsl(var(--iplc-neutral-200))",
        "iplc-background": "hsl(var(--iplc-background))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        // IPLC Shadow System
        'iplc-sm': '0 1px 3px rgba(21, 63, 129, 0.12), 0 1px 2px rgba(21, 63, 129, 0.24)',
        'iplc-md': '0 4px 6px rgba(21, 63, 129, 0.1), 0 1px 3px rgba(21, 63, 129, 0.08)',
        'iplc-lg': '0 10px 15px rgba(21, 63, 129, 0.15), 0 4px 6px rgba(21, 63, 129, 0.1)',
        'iplc-xl': '0 20px 25px rgba(21, 63, 129, 0.15), 0 10px 10px rgba(21, 63, 129, 0.04)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
