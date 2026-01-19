import NavBar from "./components/navbar";
import { LocaleProvider } from "./components/provider/locale-provider";
import { ThemeProvider } from "./components/provider/theme-provider";
import TurtlePage from "./pages/turtle-page";

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
