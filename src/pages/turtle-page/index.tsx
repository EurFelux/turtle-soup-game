import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import AiSettingsSection from "@/components/ai-settings-section";
import { Separator } from "@/components/ui/separator";
import { defaultAiSettings } from "@/config/ai";
import { LocalStorageKeyMap } from "@/config/storage";
import { swrKeyMap } from "@/config/swr";
import { getAllSoups } from "@/db";
import type { Soup } from "@/types";
import { type AiSettings, AiSettingsSchema } from "@/types/ai";
import { safeParseJson } from "@/utils/json";
import CreateSoupDialog from "./create-soup-dialog";
import MainGame from "./main-game";
import NoActiveSoup from "./no-active-soup";
import SoupList from "./soup-list";

const TurtlePage = () => {
	const [settings, _setSettings] = useState<AiSettings>(() => {
		const settings = localStorage.getItem(LocalStorageKeyMap.aiSettings);
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
				LocalStorageKeyMap.aiSettings,
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

	const [activeSoupId, setActiveSoupId] = useState<string | null>(null);

	const activeSoup = soups?.find((soup) => soup.id === activeSoupId);

	const sortedSoups = useMemo(() => {
		if (!soups) return [];
		return soups.sort((a, b) => a.createAt.localeCompare(b.createAt));
	}, [soups]);

	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-4 xl:flex-row xl:gap-0 xl:p-8">
			<div className="flex max-h-72 w-full flex-col overflow-y-auto rounded-lg bg-secondary p-4 xl:max-h-full xl:w-60">
				<CreateSoupDialog aiSettings={settings} />
				<Separator className="my-3" />
				<SoupList
					soups={sortedSoups}
					error={error}
					activeSoupId={activeSoupId}
					setActiveSoupId={setActiveSoupId}
				></SoupList>
			</div>
			<Separator
				orientation="vertical"
				className="mx-2 hidden xl:block"
			></Separator>
			<div className="min-w-0 flex-1 overflow-auto">
				{activeSoup && <MainGame soup={activeSoup} aiSettings={settings} />}
				{!activeSoup && <NoActiveSoup aiSettings={settings} />}
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
