import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F8E40B",
          black: "#121317",
          blue: "#5C80BC",
          olive: "#7A9263",
          gold: "#F5A623",
        },
      },
      fontFamily: {
        display: ["Satoshi", "sans-serif"],
        body: ["General Sans", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
