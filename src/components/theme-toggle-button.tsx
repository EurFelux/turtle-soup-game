import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";

export const ThemeToggleButotn = () => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<Button onClick={toggleTheme}>
			{theme === "dark" ? "Light Mode" : "Dark Mode"}
		</Button>
	);
};
