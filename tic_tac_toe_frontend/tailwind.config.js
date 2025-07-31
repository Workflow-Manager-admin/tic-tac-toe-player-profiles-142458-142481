module.exports = {
  darkMode: "media",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E90FF",
        secondary: "#FFD700",
        accent: "#FF6347",
        background: "#0a0a0a",
        foreground: "#ededed",
        boardbg: "#171717",
        cellbg: "#232323",
        win: "#17c37b",
        lose: "#ff2222",
        draw: "#ffa500",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
