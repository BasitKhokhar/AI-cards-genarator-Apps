// Themes/fonts.js

// 🖋️ Font Theme 1 — Futuristic Sans (AI Tech Feel)
const futuristSans = {
  heading: "Montserrat-Bold",
  subheading: "Montserrat-SemiBold",
  body: "Inter-Regular",
  medium: "Inter-Medium",
  light: "Inter-Light",
  mono: "SpaceMono-Regular",
};

// 🌬️ Font Theme 2 — Minimal Modern
const minimalModern = {
  heading: "Poppins-Bold",
  subheading: "Poppins-SemiBold",
  body: "Nunito-Regular",
  medium: "Nunito-Medium",
  light: "Nunito-Light",
  mono: "JetBrainsMono-Regular",
};

// 🔵 Font Theme 3 — Tech Display
const techDisplay = {
  heading: "Orbitron-Bold",
  subheading: "Orbitron-Medium",
  body: "Roboto-Regular",
  medium: "Roboto-Medium",
  light: "Roboto-Light",
  mono: "JetBrainsMono-Regular",
};

// 🧠 Selector (switch font set globally)
const activeFontTheme = "futuristSans"; // 🔁 change to "minimalModern" or "techDisplay"

// 🎨 Export dynamically
const fontThemes = { futuristSans, minimalModern, techDisplay };
export const fonts = fontThemes[activeFontTheme];
