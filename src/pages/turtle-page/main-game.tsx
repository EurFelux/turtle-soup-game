import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { createSolutionFromAI, createTryFromAI } from "@/business/ai";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
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
	const [isRequesting, setIsRequesting] = useState<boolean>(false);
	const [solution, setSolution] = useState<string>("");
	const { locale } = useLocale();

	const triesFetcher = async () => {
		return getTriesBySoupId(soup.id);
	};

	const { data: tries, error } = useSWR(swrKeyMap.tries(soup.id), triesFetcher);

	const submitQuestion = async () => {
		setIsRequesting(true);
		try {
			await createTryFromAI({
				soupId: soup.id,
				userPrompt: question,
				aiSettings,
				locale,
				truth: soup.truth,
			});
			setQuestion("");
		} catch (error) {
			console.error(error);
		} finally {
			setIsRequesting(false);
		}
	};

	const submitSolution = async () => {
		setIsRequesting(true);
		try {
			await createSolutionFromAI({
				soup: soup,
				userSolution: solution,
				aiSettings,
				locale,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setIsRequesting(false);
		}
	};

	const submitButtonDisabled = !question || isRequesting;

	return (
		<div className="flex flex-col gap-2 rounded-lg bg-secondary">
			{/* Surface */}
			<section className="rounded-lg bg-secondary p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.surface.title")}
				</h2>
				<ScrollArea className="max-h-48">{soup.surface}</ScrollArea>
			</section>
			<Separator className="m-2" />
			{/* Tries */}
			<section className="p-4">
				<TryList tries={tries} error={error} />
			</section>
			<Separator className="m-2" />
			{/* Ask */}
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
							disabled={isRequesting}
							onKeyDown={async (e) => {
								if (submitButtonDisabled) return;
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
						disabled={submitButtonDisabled}
					>
						{isRequesting && <Spinner />}
						{t("page.turtle.main_game.try.submit")}
					</Button>
				</div>
			</section>
			{/* Solve */}
			<section className="p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.solve.title")}
				</h2>
				<Field>
					<FieldContent>
						<Textarea
							value={solution}
							onChange={(e) => {
								setSolution(e.target.value);
							}}
							disabled={isRequesting}
							onKeyDown={async (e) => {
								if (submitButtonDisabled) return;
								if (e.key === "Enter") {
									return submitSolution();
								}
							}}
						/>
					</FieldContent>
					<FieldDescription>
						{t("page.turtle.main_game.solve.description")}
					</FieldDescription>
				</Field>
				<div className="flex justify-end">
					<Button
						type="button"
						onClick={submitSolution}
						disabled={submitButtonDisabled}
					>
						{isRequesting && <Spinner />}
						{t("page.turtle.main_game.solve.submit")}
					</Button>
				</div>
			</section>
		</div>
	);
};

export default MainGame;
