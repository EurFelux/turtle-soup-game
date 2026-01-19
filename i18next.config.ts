import { defineConfig } from "i18next-cli";

export default defineConfig({
	locales: ["zh-CN", "en-US"],
	extract: {
		input: "src/**/*.{js,jsx,ts,tsx}",
		output: "src/assets/locales/{{language}}/{{namespace}}.json",
	},
});
