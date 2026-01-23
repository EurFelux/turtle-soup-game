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
		<div className="flex h-full flex-col justify-center rounded-lg bg-secondary xl:items-center">
			<div className="flex flex-col gap-4 p-4 xl:max-h-80 xl:min-w-120">
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
