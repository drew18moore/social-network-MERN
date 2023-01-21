import React, { useEffect, useState, useContext } from "react";

const Themes = Object.freeze({
  Light: "light",
  Dark: "dark"
})

const ThemeContext = React.createContext();
export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Themes.Light);

  useEffect(() => {
    console.log(theme);
    document.querySelector(":root").className = "";
    document.querySelector(":root").classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
