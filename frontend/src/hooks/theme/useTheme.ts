import type { ThemeContextProps } from "@/types";
import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);
export { ThemeContext, useTheme };
