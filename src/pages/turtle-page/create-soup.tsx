import { WandSparklesIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { checkAiSettings, createSoupFromAI } from "@/business/ai";
import { createInspirationPrompt } from "@/business/inspiration";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { swrKeyMap } from "@/config/swr";
import { getAllSoups } from "@/db";
import { useLocale } from "@/hooks/useLocale";
import { type AiSettings, type CreatingSoup, type Soup } from "@/types";
import { getErrorMessage } from "@/utils/error";
import { uuidv4 } from "@/utils/uuid";

type CreateSoupFormProps = {
	aiSettings: AiSettings;
	setActiveSoupId: (id: string) => void;
};

const CreateSoupForm = ({
	aiSettings,
	setActiveSoupId: setActiveSoup,
}: CreateSoupFormProps) => {
	const { t } = useTranslation();
	const { locale } = useLocale();
	const [isOpen, setIsOpen] = useState<boolean>(false);
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
				setIsOpen(false);
				setUserPrompt("");
				await mutate<Soup[]>(
					swrKeyMap.soups,
					async () => {
						const created = await createSoupFromAI({
							userPrompt,
							locale,
							aiSettings,
						});
						setActiveSoup(created.id);
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
		[aiSettings, mutate, t, userPrompt, locale, setActiveSoup],
	);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						setIsOpen(true);
					}}
				>
					{t("page.turtle.create_soup.title")}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="rounded-lg bg-secondary p-4"
				onClose={handleClose}
			>
				<div>
					<h2 className="mb-4 text-2xl">
						{t("page.turtle.create_soup.title")}
					</h2>
					<form onSubmit={handleSubmit}>
						<Field>
							<FieldLabel>
								{t("page.turtle.create_soup.prompt.label")}
							</FieldLabel>
							<Textarea
								value={userPrompt}
								onChange={(e) => setUserPrompt(e.target.value)}
								placeholder={t("page.turtle.create_soup.prompt.placeholder")}
								className="mb-2"
							/>
						</Field>
						<div className="mt-1 flex justify-between">
							<Button type="button" onClick={handleCreatePrompt}>
								<WandSparklesIcon className="size-4" />
								{t("page.turtle.create_soup.prompt.generate")}
							</Button>
							<Button type="submit">
								{t("page.turtle.create_soup.create")}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateSoupForm;
