import { CheckCircleIcon } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AiSettings, ProviderType } from "@/types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { Alert } from "./ui/alert";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { InputGroup, InputGroupInput } from "./ui/input-group";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type AiSettingsSectionProps = {
	settings: AiSettings;
	setSettings: (settings: AiSettings) => void;
};

type ProviderTypeItem = {
	value: ProviderType;
	label: ReactNode;
};

const AiSettingsSection = ({
	settings,
	setSettings,
}: AiSettingsSectionProps) => {
	const { t } = useTranslation();
	const updateSettings = useCallback(
		(newSettings: Partial<AiSettings>) => {
			setSettings({ ...settings, ...newSettings });
		},
		[setSettings, settings],
	);

	const [provider, setProvider] = useState<string>(settings.provider);
	const updateProvider = useCallback(
		(value: string) => {
			setProvider(value);
			updateSettings({ provider: value });
		},
		[updateSettings],
	);

	const [apiKey, setApiKey] = useState<string>(settings.apiKey);
	const updateApiKey = useCallback(
		(value: string) => {
			setApiKey(value);
			updateSettings({ apiKey: value });
		},
		[updateSettings],
	);

	const [model, setModel] = useState<string>(settings.model);
	const updateModel = useCallback(
		(value: string) => {
			setModel(value);
			updateSettings({ model: value });
		},
		[updateSettings],
	);

	const [baseUrl, setBaseUrl] = useState<string>(settings.baseUrl);
	const updateBaseUrl = useCallback(
		(value: string) => {
			setBaseUrl(value);
			updateSettings({ baseUrl: value });
		},
		[updateSettings],
	);

	const providerTypeItems = [
		{
			value: "openai-chat",
			label: "OpenAI (Chat Completions API)",
		},
		{
			value: "openai-responses",
			label: "OpenAI (Responses API)",
		},
		{ value: "anthropic", label: "Anthropic" },
		{ value: "gemini", label: "Gemini" },
	] satisfies ProviderTypeItem[];

	return (
		<div className="rounded-lg bg-secondary p-4">
			<Accordion
				type="single"
				collapsible
				className="w-full"
				defaultValue="settings"
			>
				<AccordionItem value="settings">
					<AccordionTrigger className="w-full p-0 text-2xl">
						{t("ai.settings.title")}
					</AccordionTrigger>
					<AccordionContent>
						<Alert className="my-2">
							<CheckCircleIcon className="size-4" />
							{t("ai.settings.alert.local_storage")}
						</Alert>
						<FieldSet>
							<FieldGroup>
								{/* Provider */}
								<Field>
									<FieldLabel>{t("ai.settings.provider.label")}</FieldLabel>
									<InputGroup>
										<InputGroupInput
											placeholder={"OpenAI"}
											value={provider}
											onChange={(e) => {
												setProvider(e.target.value);
											}}
											onBlur={(e) => {
												updateProvider(e.target.value);
											}}
										/>
									</InputGroup>
								</Field>
								{/* Provider Type */}
								<Field>
									<FieldLabel>{t("ai.settings.providerType.label")}</FieldLabel>
									<RadioGroup
										value={settings.providerType}
										onValueChange={(value) =>
											updateSettings({ providerType: value as ProviderType })
										}
									>
										{providerTypeItems.map((item) => (
											<div key={item.value} className="flex gap-2">
												<RadioGroupItem
													key={item.value}
													value={item.value}
													id={item.value}
												></RadioGroupItem>
												<Label htmlFor={item.value}>{item.label}</Label>
											</div>
										))}
									</RadioGroup>
								</Field>
								{/* Model */}
								<Field>
									<FieldLabel>{t("ai.settings.model.label")}</FieldLabel>
									<InputGroup>
										<InputGroupInput
											placeholder={"gpt-5.2"}
											value={model}
											onChange={(e) => {
												setModel(e.target.value);
											}}
											onBlur={(e) => {
												updateModel(e.target.value);
											}}
										/>
									</InputGroup>
								</Field>
								{/* Api Key */}
								<Field>
									<FieldLabel>{t("ai.settings.apiKey.label")}</FieldLabel>
									<InputGroup>
										<InputGroupInput
											type="password"
											placeholder={"sk-xxx"}
											value={apiKey}
											onChange={(e) => {
												setApiKey(e.target.value);
											}}
											onBlur={(e) => {
												updateApiKey(e.target.value);
											}}
										/>
									</InputGroup>
								</Field>
							</FieldGroup>
							{/* Base URL */}
							<Field>
								<FieldLabel>{t("ai.settings.baseUrl.label")}</FieldLabel>
								<InputGroup>
									<InputGroupInput
										value={baseUrl}
										onChange={(e) => {
											setBaseUrl(e.target.value);
										}}
										onBlur={(e) => {
											updateBaseUrl(e.target.value);
										}}
										placeholder={"https://api.openai.com/v1"}
									/>
								</InputGroup>
							</Field>
						</FieldSet>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default AiSettingsSection;
