import { WandSparklesIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { checkAiSettings, createSoupFromAI } from "@/business/ai";
import { createInspirationPrompt } from "@/business/inspiration";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { swrKeyMap } from "@/config/swr";
import { getAllSoups } from "@/db";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import type { AiSettings, CreatingSoup, Soup } from "@/types";
import { getErrorMessage } from "@/utils/error";
import { uuidv4 } from "@/utils/uuid";

type CreateSoupContentProps = {
	aiSettings: AiSettings;
	/* called when starting to submit */
	onSubmit?: () => void;
	/* of form element */
	className?: string;
};

const CreateSoupContent = ({
	aiSettings,
	onSubmit,
	className,
}: CreateSoupContentProps) => {
	const { t } = useTranslation();
	const { locale } = useLocale();

	const [userPrompt, setUserPrompt] = useState<string>("");
	const { mutate } = useSWRConfig();

	const handleCreatePrompt = useCallback(() => {
		const prompt = createInspirationPrompt({ locale });
		setUserPrompt(prompt);
	}, [locale]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!checkAiSettings(aiSettings)) {
				toast.error(t("page.turtle.error.invalid_ai_settings"));
				return;
			}
			try {
				const creating: CreatingSoup = {
					id: uuidv4(),
					status: "creating",
					createAt: new Date().toISOString(),
				};
				setUserPrompt("");
				onSubmit?.();
				await mutate<Soup[]>(
					swrKeyMap.soups,
					async () => {
						const created = await createSoupFromAI({
							userPrompt,
							locale,
							aiSettings,
						});
						toast.success(
							t("page.turtle.success.created", { title: created.title }),
						);
						return getAllSoups();
					},
					{
						optimisticData: (current) =>
							current ? [...current, creating] : [creating],
						rollbackOnError: true,
					},
				);
			} catch (e) {
				toast.error(getErrorMessage(e));
				console.error(e);
			}
		},
		[aiSettings, t, onSubmit, mutate, userPrompt, locale],
	);

	const promptId = useId();
	return (
		<form onSubmit={handleSubmit} className={cn("flex flex-col", className)}>
			<Field className="flex-1">
				<FieldLabel htmlFor={promptId}>
					{t("page.turtle.create_soup.prompt.label")}
				</FieldLabel>
				<Textarea
					id={promptId}
					value={userPrompt}
					onChange={(e) => setUserPrompt(e.target.value)}
					placeholder={t("page.turtle.create_soup.prompt.placeholder")}
					className="mb-2 flex-1"
				/>
			</Field>
			<div className="mt-1 flex justify-between">
				<Button type="button" onClick={handleCreatePrompt}>
					<WandSparklesIcon className="size-4" />
					{t("page.turtle.create_soup.prompt.generate")}
				</Button>
				<Button type="submit">{t("page.turtle.create_soup.create")}</Button>
			</div>
		</form>
	);
};

export default CreateSoupContent;
