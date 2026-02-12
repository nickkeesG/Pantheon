import { createContext, type ReactNode, useContext, useState } from "react";

interface ActionBarContextType {
	actionBar: ReactNode | null;
	setActionBar: (content: ReactNode | null) => void;
}

const ActionBarContext = createContext<ActionBarContextType | null>(null);

export function ActionBarProvider({ children }: { children: ReactNode }) {
	const [actionBar, setActionBar] = useState<ReactNode | null>(null);

	return (
		<ActionBarContext.Provider value={{ actionBar, setActionBar }}>
			{children}
		</ActionBarContext.Provider>
	);
}

export function useActionBar() {
	const context = useContext(ActionBarContext);
	if (!context)
		throw new Error("useActionBar must be used within ActionBarProvider");
	return context;
}
