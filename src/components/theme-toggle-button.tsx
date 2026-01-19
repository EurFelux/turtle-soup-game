import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/types";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ThemeItem = {
	value: Theme;
	label: ReactNode;
};

export const ThemeToggleButotn = () => {
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation();

	const items: ThemeItem[] = [
		{
			value: "light",
			label: t("theme.light"),
		},
		{
			value: "dark",
			label: t("theme.dark"),
		},
		{
			value: "system",
			label: t("theme.system"),
		},
	];

	const Icon =
		theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : MonitorIcon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button>
					<Icon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={theme}
					onValueChange={(value: string) => setTheme(value as Theme)}
				>
					{items.map((item) => (
						<DropdownMenuRadioItem key={item.value} value={item.value}>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
