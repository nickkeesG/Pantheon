import "./app.css";
import { useCallback, useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import DaemonManager from "./components/DaemonManager";
import Footer from "./components/Footer";
import { ModalProvider } from "./components/ModalContext";
import CollectionView from "./components/views/Collection/CollectionView";
import LandingView from "./components/views/Landing/LandingView";
import TreeView from "./components/views/Tree/TreeView";
import { useAppSelector } from "./hooks";
import { Filler } from "./styles/sharedStyles";

function Layout() {
	return (
		<>
			<Navbar />
			<Outlet />
			<DaemonManager />
			<Filler />
			<Footer />
		</>
	);
}

function App() {
	const configTheme = useAppSelector((state) => state.config.theme);

	const setTheme = useCallback((dark: boolean) => {
		const html = document.documentElement;
		if (dark) {
			html.classList.add("dark");
		} else {
			html.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		if (configTheme === "system" || configTheme === undefined) {
			const darkModeMediaQuery = window.matchMedia(
				"(prefers-color-scheme: dark)",
			);
			setTheme(darkModeMediaQuery.matches);
			darkModeMediaQuery.addEventListener("change", (e) => setTheme(e.matches));
			return () => {
				darkModeMediaQuery.removeEventListener("change", (e) =>
					setTheme(e.matches),
				);
			};
		} else {
			setTheme(configTheme === "dark");
		}
	}, [configTheme, setTheme]);

	return (
		<BrowserRouter>
			<div className={`App`}>
				<ModalProvider>
					<Routes>
						<Route element={<Layout />}>
							<Route path="/" element={<LandingView />} />
							<Route path="/tree/:treeId" element={<TreeView />} />
							<Route path="/collection" element={<CollectionView />} />
						</Route>
					</Routes>
				</ModalProvider>
			</div>
		</BrowserRouter>
	);
}

export default App;
