import { useContext } from "react";
import { TurtlePageProviderContext } from "./context";

export const useTurtleContext = () => {
	const context = useContext(TurtlePageProviderContext);
	if (!context) {
		throw new Error(
			"useTurtleContext must be used within a TurtlePageProvider",
		);
	}
	return context;
};
