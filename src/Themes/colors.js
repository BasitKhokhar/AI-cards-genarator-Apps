
const darkOcean = {
  bodybackground: "#0d0d0d",
  cardsbackground: "#1a1a1a",
  primary: "#26d0ce",
  accent: "#1a2980",
  secondary: "#3D3D3D",
  text: "#ffffff",
  mutedText: "#B3B3B3",
  border: "#4d4d4d",
  error: "#FF0033",
  gradients: {
    ocean: ["#1a2980", "#26d0ce"],
    mintGlow: ["#00ffa3", "#00b3ff"],
    aquaPulse: ["#00F5A0", "#00D9F5"],
    deepTech: ["#0d0d1a", "#141427"],
  },
};

const lightBreeze = {
  bodybackground: "#f7f7f7",
  cardsbackground: "#ffffff",
  primary: "#00bcd4",
  accent: "#0097a7",
  secondary: "#e0e0e0",
  text: "#0d0d0d",
  mutedText: "#4d4d4d",
  border: "#cccccc",
  error: "#e53935",
  gradients: {
    ocean: ["#56ccf2", "#2f80ed"],
    mintGlow: ["#00b09b", "#96c93d"],
    aquaPulse: ["#00D9F5", "#00F5A0"],
    deepTech: ["#ffffff", "#e0e0e0"],
  },
};


const blueNeon = {
  bodybackground: "#01010a",
  cardsbackground: "#0a0a1f",
  primary: "#00f0ff",
  accent: "#0077ff",
  secondary: "#141452",
  text: "#e6f7ff",
  mutedText: "#b3d9ff",
  border: "#0077ff",
  error: "#ff3366",
  gradients: {
    ocean: ["#00c6ff", "#0072ff"],
    mintGlow: ["#00bfff", "#1e90ff"],
    aquaPulse: ["#00f0ff", "#0077ff"],
    deepTech: ["#000428", "#004e92"],
  },
};


const activeTheme = "darkOcean"; 

const themes = { darkOcean, lightBreeze, blueNeon };
export const colors = themes[activeTheme];
