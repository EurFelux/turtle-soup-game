import { useState } from "react";
import { TurtlePageProviderContext } from "./context";

const TurtleContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [activeSoupId, setActiveSoupId] = useState<string | null>(null);

	return (
		<TurtlePageProviderContext.Provider
			value={{ activeSoupId, setActiveSoupId }}
		>
			{children}
		</TurtlePageProviderContext.Provider>
	);
};

export default TurtleContextProvider;
