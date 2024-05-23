import { useEffect, useState } from "react";

function useColorScheme() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("colorScheme") === "dark" // Load from localStorage or use system preference
  );

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("colorScheme", isDarkMode ? "dark" : "light"); // Save to localStorage
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
}

export default useColorScheme;
