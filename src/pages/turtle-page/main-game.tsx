import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import {
	createSolutionFromAI,
	createTryFromAI,
	giveUpSoupFromAI,
} from "@/business/ai";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { getErrorMessage } from "@/utils/error";
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
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
			toast.error(getErrorMessage(error));
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
			toast.error(getErrorMessage(error));
			console.error(error);
		} finally {
			setIsRequesting(false);
		}
	};

	const handleGiveUp = async () => {
		setIsRequesting(true);
		setIsDialogOpen(false);
		try {
			await giveUpSoupFromAI({
				soup,
				aiSettings,
				locale,
			});
		} catch (error) {
			toast.error(getErrorMessage(error));
			console.error(error);
		} finally {
			setIsRequesting(false);
		}
	};

	const submitQuestionButtonDisabled = !question || isRequesting;
	const submitSulutionButtonDisabled = !solution || isRequesting;

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

			{/* Explanation */}
			{(soup.status === "resolved" || soup.status === "given_up") && (
				<>
					<section className="p-4">
						<h2 className="mb-4 text-2xl">
							{t("page.turtle.main_game.give_up.title")}
						</h2>
						<ScrollArea className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border p-4">
							{soup.explanation}
						</ScrollArea>
					</section>
					<Separator className="m-2" />
				</>
			)}
			{/* Solution */}
			{soup.status === "resolved" && (
				<>
					<section className="p-4">
						<h2 className="mb-4 text-2xl">
							{t("page.turtle.main_game.solve.title")} - {soup.score} 分
						</h2>
						<ScrollArea className="h-96 overflow-auto whitespace-pre-wrap">
							<p>{soup.explanation}</p>
						</ScrollArea>
					</section>
					<Separator className="m-2" />
				</>
			)}

			{/* Tries */}
			<section className="p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.tries.title")}
				</h2>
				<ScrollArea className="max-h-96 overflow-y-auto rounded-lg border p-4">
					<TryList tries={tries} error={error} />
				</ScrollArea>
			</section>
			{soup.status === "unresolved" && (
				<>
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
										if (submitQuestionButtonDisabled) return;
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
						<div className="flex justify-end gap-2">
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button
										type="button"
										variant="outline"
										disabled={isRequesting}
									>
										{t("page.turtle.main_game.give_up.button")}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											{t("page.turtle.main_game.give_up.button")}
										</DialogTitle>
										<DialogDescription>
											{t("page.turtle.main_game.give_up.confirm")}
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button type="button" variant="outline">
												{t("page.turtle.main_game.give_up.cancel")}
											</Button>
										</DialogClose>
										<Button type="button" onClick={handleGiveUp}>
											{t("page.turtle.main_game.give_up.button")}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<Button
								type="button"
								onClick={submitSolution}
								disabled={submitSulutionButtonDisabled}
							>
								{isRequesting && <Spinner />}
								{t("page.turtle.main_game.solve.submit")}
							</Button>
						</div>
					</section>
				</>
			)}
		</div>
	);
};

export default MainGame;
