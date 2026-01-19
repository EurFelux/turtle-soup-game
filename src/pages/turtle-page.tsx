import { useCallback, useState } from "react";
import AiSettingsSection from "@/components/ai-settings-section";
import { defaultAiSettings } from "@/config/ai";
import { LocalStorageKeyMap } from "@/config/storage";
import { type AiSettings, AiSettingsSchema } from "@/types/ai";
import { safeParseJson } from "@/utils/json";

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

	return (
		<div className="p-8">
			<h1>Turtle Game</h1>
			<p>Welcome to the Turtle Game!</p>
			<AiSettingsSection settings={settings} setSettings={setSettings} />
		</div>
	);
};

export default TurtlePage;
