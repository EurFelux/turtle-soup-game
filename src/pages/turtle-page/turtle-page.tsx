import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import AiSettingsSection from "@/components/ai-settings-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultAiSettings } from "@/config/ai";
import { localStorageKeyMap } from "@/config/storage";
import { swrKeyMap } from "@/config/swr";
import { getAllSoups } from "@/db";
import type { Soup } from "@/types";
import { type AiSettings, AiSettingsSchema } from "@/types/ai";
import { safeParseJson } from "@/utils/json";
import CreateSoupDialog from "./create-soup-dialog";
import MainGame from "./main-game";
import NoActiveSoup from "./no-active-soup";
import SoupList from "./soup-list";
import { useTurtleContext } from "./useTurtleContext";

const TurtlePage = () => {
	const { t } = useTranslation();
	const [settings, _setSettings] = useState<AiSettings>(() => {
		const settings = localStorage.getItem(localStorageKeyMap.aiSettings);
		if (settings === null) {
			return defaultAiSettings;
		}
		const parsedSettings = safeParseJson(settings);
		if (!parsedSettings.success) {
			console.warn(
				"Failed to parse ai settings, fallback to default value.",
				settings,
				parsedSettings.error,
			);
			return defaultAiSettings;
		}

		const result = AiSettingsSchema.safeParse(parsedSettings.data);
		if (result.success) {
			return result.data;
		} else {
			console.warn(
				"Existing invalid ai settings, fallback to default value.",
				settings,
				result.error,
			);
			return defaultAiSettings;
		}
	});

	const setSettings = useCallback(
		(settings: AiSettings) => {
			localStorage.setItem(
				localStorageKeyMap.aiSettings,
				JSON.stringify(settings),
			);
			_setSettings(settings);
		},
		[_setSettings],
	);

	const { data: soups, error } = useSWR(
		swrKeyMap.soups,
		getAllSoups as () => Promise<Soup[]>,
	);

	const { activeSoupId } = useTurtleContext();

	const activeSoup = soups?.find((soup) => soup.id === activeSoupId);

	const sortedSoups = useMemo(() => {
		if (!soups) return [];
		return soups.sort((a, b) => -a.createAt.localeCompare(b.createAt));
	}, [soups]);

	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-4 xl:flex-row xl:gap-0 xl:p-8">
			<div className="flex max-h-72 w-full flex-col overflow-hidden rounded-lg bg-secondary p-4 xl:max-h-full xl:w-60">
				<CreateSoupDialog aiSettings={settings} />
				<Separator className="my-3" />
				<ScrollArea className="overflow-auto">
					<SoupList soups={sortedSoups} error={error} />
				</ScrollArea>
			</div>
			<Separator
				orientation="vertical"
				className="mx-2 hidden xl:block"
			></Separator>
			<div className="flex min-w-0 flex-1 flex-col">
				{activeSoup && activeSoup.status === "creating" && (
					<Skeleton className="flex flex-1 items-center justify-center rounded-lg bg-secondary">
						{t("page.turtle.loading.create")}
					</Skeleton>
				)}
				{!activeSoup && <NoActiveSoup aiSettings={settings} />}
				{activeSoup && activeSoup.status !== "creating" && (
					<ScrollArea className="flex-1 overflow-auto rounded-lg bg-secondary p-4">
						<MainGame soup={activeSoup} aiSettings={settings} />
					</ScrollArea>
				)}
			</div>
			<Separator
				orientation="vertical"
				className="mx-2 hidden xl:block"
			></Separator>
			<div className="w-full xl:w-80">
				<AiSettingsSection settings={settings} setSettings={setSettings} />
			</div>
		</div>
	);
};

export default TurtlePage;
