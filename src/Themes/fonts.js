
const systemDefault = {
  heading: "System", 
  subheading: "System",
  body: "System",
  medium: "System",
  light: "System",
};

const futuristSans = {
  heading: "Orbitron_700Bold",
  subheading: "Orbitron_500Medium",
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  light: "Inter_300Light",
};


const minimalModern = {
  heading: "Poppins_700Bold",
  subheading: "Poppins_600SemiBold",
  body: "Nunito_400Regular",
  medium: "Nunito_500Medium",
  light: "Nunito_300Light",
};

const cleanPro = {
  heading: "Inter_700Bold",
  subheading: "Inter_500Medium",
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  light: "Inter_300Light",
};

const activeFontTheme = "minimalModern";


const fontThemes = { systemDefault, futuristSans, minimalModern, cleanPro };
export const fonts = fontThemes[activeFontTheme];
