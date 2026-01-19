import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "@/assets/locales/en-US/translation.json";
import zhCN from "@/assets/locales/zh-CN/translation.json";
import NavBar from "./components/navbar";
import { LocaleProvider } from "./components/provider/locale-provider";
import { ThemeProvider } from "./components/provider/theme-provider";
import { defaultLocale } from "./config/locale";
import TurtlePage from "./pages/turtle-page";

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		// the translations
		// (tip move them in a JSON file and import them,
		// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
		resources: {
			"en-US": { translation: enUS },
			"zh-CN": { translation: zhCN },
		},
		lng: defaultLocale, // if you're using a language detector, do not define the lng option
		fallbackLng: defaultLocale,

		interpolation: {
			escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
		},
	});

function App() {
	return (
		<ThemeProvider>
			<LocaleProvider>
				<NavBar></NavBar>
				<main>
					<TurtlePage />;
				</main>
			</LocaleProvider>
		</ThemeProvider>
	);
}

export default App;
