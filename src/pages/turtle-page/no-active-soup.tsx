import { TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { checkAiSettings } from "@/business/ai";
import { Alert } from "@/components/ui/alert";
import type { AiSettings } from "@/types";
import CreateSoupContent from "./create-soup-content";

type NoActiveSoupProps = {
	aiSettings: AiSettings;
};

const NoActiveSoup = ({ aiSettings }: NoActiveSoupProps) => {
	const { t } = useTranslation();
	const isValidAiSettings = checkAiSettings(aiSettings);
	return (
		<div className="flex h-full flex-col items-center justify-center rounded-lg bg-secondary">
			<div className="flex h-1/3 w-1/2 flex-col gap-4">
				<div>
					<h2 className="font-bold text-2xl">
						{t("page.turtle.create_soup.title")}
					</h2>
					<span>{t("page.turtle.create_soup.description")}</span>
				</div>

				{!isValidAiSettings && (
					<Alert className="my-2 text-warning">
						<TriangleAlertIcon className="size-4" />
						{t("page.turtle.error.invalid_ai_settings")}
					</Alert>
				)}

				<CreateSoupContent aiSettings={aiSettings} className="flex-1" />
			</div>
		</div>
	);
};

export default NoActiveSoup;
