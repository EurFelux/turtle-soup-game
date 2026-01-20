import { GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import turtle from "@/assets/turtle.svg";
import { LocaleSelect } from "./locale-select";
import { ThemeToggleButotn } from "./theme-toggle-button";
import { Button } from "./ui/button";

const NavBar = () => {
	const { t } = useTranslation();
	return (
		<header className="flex justify-between bg-secondary p-2">
			<div className="flex items-center gap-1">
				<img src={turtle} className="size-16" />
				<h1 className="mr-2 text-4xl">{t("app.title")}</h1>
			</div>

			{/* Tool Buttons */}
			<div className="flex items-center gap-1">
				<a
					href="https://github.com/EurFelux/turtle-soup-game"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
				>
					<Button>
						<GithubIcon className="size-4" />
					</Button>
				</a>
				<LocaleSelect></LocaleSelect>
				<ThemeToggleButotn></ThemeToggleButotn>
			</div>
		</header>
	);
};

export default NavBar;
