import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Soup } from "@/types";

type MainGameProps = {
	soup: Soup;
};

const MainGame = ({ soup }: MainGameProps) => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-2">
			<section className="rounded-lg bg-secondary p-4">
				<h2 className="mb-4 text-2xl">
					{t("page.turtle.main_game.surface.title")}
				</h2>
				<ScrollArea className="max-h-48">{soup.surface}</ScrollArea>
			</section>
		</div>
	);
};

export default MainGame;
