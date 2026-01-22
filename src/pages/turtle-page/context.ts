import { createContext } from "react";

type TurtlePageProviderState = {
	activeSoupId: string | null;
	setActiveSoupId: (value: string | null) => void;
};

const initialState: TurtlePageProviderState = {
	activeSoupId: null,
	setActiveSoupId: () => null,
};

export const TurtlePageProviderContext =
	createContext<TurtlePageProviderState>(initialState);
