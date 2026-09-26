/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: "#050505",
          surface: "#0A0A0A",
          elevated: "#111111",
          border: "#1F1F1F",
          borderLight: "#2E2E2E",
          primary: "#EAE6DF",
          secondary: "#8A8780",
          muted: "#5A5750",
          accent: "#D4AF37",
          cyan: "#4ECDC4",
          violet: "#9D4EDD",
          glow: "rgba(234, 230, 223, 0.08)",
          error: "#E63946",
          success: "#2A9D8F",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'super-wide': '0.25em',
        'ultra-wide': '0.4em',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(234,230,223,0.15))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(234,230,223,0.35))' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
