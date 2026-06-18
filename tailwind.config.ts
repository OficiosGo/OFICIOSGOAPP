import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens de marca — fuente única de verdad.
        // Deben coincidir con las variables CSS en app/globals.css y el manifest.
        brand: {
          yellow: "#F8C927",
          black: "#1A1D2E",
          dark: "#1A1D2E",
          blue: "#5C80BC",
          olive: "#7A9263",
          gold: "#F5A623",
        },
      },
      fontFamily: {
        // La app carga Poppins (app/layout.tsx). Mantener alineado.
        display: ["Poppins", "sans-serif"],
        body: ["Poppins", "sans-serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
