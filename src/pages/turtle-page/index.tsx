import TurtleContextProvider from "./context-provider";
import TurtlePage from "./turtle-page";

const page = () => (
	<TurtleContextProvider>
		<TurtlePage />
	</TurtleContextProvider>
);

export default page;
