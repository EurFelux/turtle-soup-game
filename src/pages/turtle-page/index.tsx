import { useCallback, useState } from "react";
import useSWR from "swr";
import AiSettingsSection from "@/components/ai-settings-section";
import { Separator } from "@/components/ui/separator";
import { defaultAiSettings } from "@/config/ai";
import { LocalStorageKeyMap } from "@/config/storage";
import { swrKeyMap } from "@/config/swr";
import { getAllSoups } from "@/db";
import { type AiSettings, AiSettingsSchema } from "@/types/ai";
import { safeParseJson } from "@/utils/json";
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

	const { data: soups, error } = useSWR(swrKeyMap.soups, getAllSoups);

	const [activeSoupId, setActiveSoupId] = useState<string | null>(null);

	return (
		<div className="flex flex-1 p-8">
			<div className="w-60">
				<SoupList
					soups={soups}
					error={error}
					activeSoupId={activeSoupId}
					setActiveSoupId={setActiveSoupId}
				></SoupList>
			</div>
			<Separator orientation="vertical"></Separator>
			<div className="flex-1"></div>
			<Separator orientation="vertical"></Separator>
			<div className="w-80">
				<AiSettingsSection settings={settings} setSettings={setSettings} />
			</div>
		</div>
	);
};

export default TurtlePage;
