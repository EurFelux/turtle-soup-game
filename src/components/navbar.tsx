import { useTranslation } from "react-i18next";

import { LocaleSelect } from "./locale-select";
import { ThemeToggleButotn } from "./theme-toggle-button";

const NavBar = () => {
	const { t } = useTranslation();
	return (
		<header className="flex justify-between p-2">
			<span className="mr-2">{t("app.title")}</span>
			{/* Tool Buttons */}
			<div className="flex gap-1">
				<LocaleSelect></LocaleSelect>
				<ThemeToggleButotn></ThemeToggleButotn>
			</div>
		</header>
	);
};

export default NavBar;
