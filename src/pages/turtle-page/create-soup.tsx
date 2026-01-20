import { WandSparklesIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { checkAiSettings, createSoupFromAI } from "@/business/ai";
import { createInspirationPrompt } from "@/business/inspiration";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/hooks/useLocale";
import type { AiSettings } from "@/types";
import { getErrorMessage } from "@/utils/error";

type CreateSoupFormProps = {
	aiSettings: AiSettings;
};

const CreateSoupForm = ({ aiSettings }: CreateSoupFormProps) => {
	const { t } = useTranslation();
	const { locale } = useLocale();
	const [userPrompt, setUserPrompt] = useState<string>("");
	const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

	const handleCreatePrompt = useCallback(() => {
		const prompt = createInspirationPrompt({ locale });
		setUserPrompt(prompt);
	}, [locale]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!checkAiSettings(aiSettings)) {
				toast.error(t("page.turtle.create_soup.ai_settings_error"));
				return;
			}
			setIsSubmiting(true);
			try {
				await createSoupFromAI({ userPrompt, locale, aiSettings });
			} catch (e) {
				toast.error(getErrorMessage(e));
				console.error(e);
			} finally {
				setIsSubmiting(false);
			}
		},
		[aiSettings, t, userPrompt, locale],
	);

	return (
		<div className="rounded-lg bg-secondary p-4">
			<h2 className="mb-4 text-2xl">{t("page.turtle.create_soup.title")}</h2>
			<form onSubmit={handleSubmit}>
				<Field>
					<FieldLabel>{t("page.turtle.create_soup.prompt.label")}</FieldLabel>
					<Textarea
						value={userPrompt}
						onChange={(e) => setUserPrompt(e.target.value)}
						placeholder={t("page.turtle.create_soup.prompt.placeholder")}
						disabled={isSubmiting}
						className="mb-2"
					/>
				</Field>
				<div className="flex justify-between">
					<Button
						type="button"
						disabled={isSubmiting}
						onClick={handleCreatePrompt}
					>
						<WandSparklesIcon className="size-4" />
						{t("page.turtle.create_soup.prompt.generate")}
					</Button>
					<Button type="submit" disabled={isSubmiting}>
						{isSubmiting ? <Spinner /> : t("page.turtle.create_soup.create")}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreateSoupForm;
