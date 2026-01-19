import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { createTryFromAI } from "@/ai/game";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { swrKeyMap } from "@/config/swr";
import { getTriesBySoupId } from "@/db";
import { useLocale } from "@/hooks/useLocale";
import type { AiSettings, Soup } from "@/types";
import TryList from "./try-list";

type MainGameProps = {
	soup: Soup;
	aiSettings: AiSettings;
};

const MainGame = ({ soup, aiSettings }: MainGameProps) => {
	const { t } = useTranslation();
	const [question, setQuestion] = useState<string>("");
	const [isAsking, setIsAsking] = useState<boolean>(false);
	const { locale } = useLocale();

	const triesFetcher = async () => {
		return getTriesBySoupId(soup.id);
	};

	const { data: tries, error } = useSWR(swrKeyMap.tries(soup.id), triesFetcher);

	const submitQuestion = async () => {
		setIsAsking(true);
		try {
			await createTryFromAI({
				soupId: soup.id,
				userPrompt: question,
				aiSettings,
				locale,
				truth: soup.truth,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setIsAsking(false);
		}
	};

	const submitQuestionButtonDisabled = !question || isAsking;

	return (
		<div className="flex flex-col gap-2 bg-secondary">
			<section className="rounded-lg bg-secondary p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.surface.title")}
				</h2>
				<ScrollArea className="max-h-48">{soup.surface}</ScrollArea>
			</section>
			<Separator className="m-2" />
			<section className="p-4">
				<TryList tries={tries} error={error} />
			</section>
			<Separator className="m-2" />
			<section className="p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.try.title")}
				</h2>
				<Field>
					<FieldContent>
						<Input
							value={question}
							onChange={(e) => {
								setQuestion(e.target.value);
							}}
							disabled={isAsking}
							onKeyDown={async (e) => {
								if (submitQuestionButtonDisabled) return;
								if (e.key === "Enter") {
									return submitQuestion();
								}
							}}
						/>
					</FieldContent>
					<FieldDescription>
						{t("page.turtle.main_game.try.description")}
					</FieldDescription>
				</Field>
				<div className="flex justify-end">
					<Button
						type="button"
						onClick={submitQuestion}
						disabled={submitQuestionButtonDisabled}
					>
						{isAsking && <Spinner />}
						{t("page.turtle.main_game.try.submit")}
					</Button>
				</div>
			</section>
		</div>
	);
};

export default MainGame;
