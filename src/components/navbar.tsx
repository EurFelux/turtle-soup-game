import { GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import turtle from "@/assets/turtle.svg";
import { useTemporaryState } from "@/hooks/useTemporaryValue";
import { cn } from "@/lib/utils";
import { LocaleSelect } from "./locale-select";
import { ThemeToggleButotn } from "./theme-toggle-button";
import { Button } from "./ui/button";

const NavBar = () => {
	const { t } = useTranslation();
	const [animating, setAnimating] = useTemporaryState(false, 1000);
	const handleClickTitle = () => {
		setAnimating(true);
	};

	return (
		<header className="flex justify-between bg-secondary p-2">
			<div
				className="flex min-w-0 cursor-pointer items-center gap-1"
				onClick={handleClickTitle}
			>
				<img
					src={turtle}
					className={cn(
						"size-10 sm:size-12 md:size-16",
						animating && "animate-spin",
					)}
				/>
				<h1 className="mr-2 select-none truncate text-xl sm:text-2xl md:text-4xl">
					{t("app.title")}
				</h1>
			</div>

			{/* Tool Buttons */}
			<div className="flex shrink-0 items-center gap-1">
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
