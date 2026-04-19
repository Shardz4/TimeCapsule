/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "outline-variant": "#474659", "outline": "#757388", "error-container": "#a70138", 
        "primary-fixed": "#bc87fe", "on-tertiary": "#480017", "secondary-container": "#006a60", 
        "secondary-dim": "#33e9d5", "on-secondary-container": "#dcfff8", "on-primary-fixed": "#000000", 
        "primary": "#c799ff", "primary-container": "#bc87fe", "on-surface-variant": "#aba9bf", 
        "on-secondary-fixed-variant": "#00655b", "error-dim": "#d73357", "inverse-surface": "#fcf8ff", 
        "on-secondary-fixed": "#00463f", "error": "#ff6e84", "secondary-fixed-dim": "#33e9d5", 
        "on-tertiary-container": "#000000", "tertiary-fixed-dim": "#ff7792", "surface-container-lowest": "#000000", 
        "primary-fixed-dim": "#af7aef", "on-tertiary-fixed": "#390010", "on-error": "#490013", 
        "surface-container-high": "#1d1d33", "inverse-on-surface": "#545366", "surface-bright": "#2a2a43", 
        "surface": "#0c0c1d", "surface-tint": "#c799ff", "surface-dim": "#0c0c1d", "tertiary": "#ff6d8b", 
        "tertiary-container": "#fe0065", "inverse-primary": "#7744b5", "secondary-fixed": "#4af8e3", 
        "surface-container": "#18182b", "primary-dim": "#ba85fb", "secondary": "#4af8e3", 
        "on-primary-container": "#340064", "on-secondary": "#005b51", "on-primary": "#440080", 
        "on-primary-fixed-variant": "#40007a", "surface-variant": "#24233b", "on-tertiary-fixed-variant": "#77002b", 
        "tertiary-dim": "#e6005b", "surface-container-low": "#121223", "on-error-container": "#ffb2b9", 
        "tertiary-fixed": "#ff8fa3", "on-background": "#e6e3fb", "background": "#0c0c1d", 
        "on-surface": "#e6e3fb", "surface-container-highest": "#24233b"
      },
      fontFamily: {
        headline: ["Space Grotesk"],
        body: ["Manrope"],
        label: ["Space Grotesk"]
      }
    },
  },
  plugins: [],
}
