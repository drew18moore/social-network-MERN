import React, { useEffect, useState, useContext } from "react";

const Themes = Object.freeze({
  Light: "light",
  Dark: "dark"
})

const ThemeContext = React.createContext<any>(undefined);
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<string>(Themes.Light);

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
  }, [])

  useEffect(() => {
    document.querySelector(":root")!.className = "";
    document.querySelector(":root")!.classList.add(theme);
    localStorage.setItem("theme", theme)
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
