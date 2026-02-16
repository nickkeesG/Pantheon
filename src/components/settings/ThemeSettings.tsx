import { useAppDispatch, useAppSelector } from "../../hooks";
import { setTheme } from "../../redux/configSlice";
import { Theme } from "../../styles/types/theme";

const ThemeSettings = () => {
	const dispatch = useAppDispatch();
	const theme = useAppSelector((state) => state.config.theme);

	return (
		<div className="flex flex-col w-full box-border">
			<h4>Theme</h4>
			<label className="inline-flex items-center gap-1">
				<input
					type="radio"
					name="theme"
					value="system"
					checked={theme === Theme.System || theme === undefined}
					onChange={() => dispatch(setTheme(Theme.System))}
				/>
				Use system theme
			</label>
			<label className="inline-flex items-center gap-1">
				<input
					type="radio"
					name="theme"
					value="light"
					checked={theme === Theme.Light}
					onChange={() => dispatch(setTheme(Theme.Light))}
				/>
				Light
			</label>
			<label className="inline-flex items-center gap-1">
				<input
					type="radio"
					name="theme"
					value="dark"
					checked={theme === Theme.Dark}
					onChange={() => dispatch(setTheme(Theme.Dark))}
				/>
				Dark
			</label>
		</div>
	);
};

export default ThemeSettings;
