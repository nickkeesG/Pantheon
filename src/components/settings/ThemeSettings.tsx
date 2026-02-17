import { useAppDispatch, useAppSelector } from "../../hooks";
import { setTheme } from "../../redux/configSlice";
import { Theme } from "../../styles/types/theme";
import ResetButton from "../common/ResetButton";

const ThemeSettings = () => {
	const dispatch = useAppDispatch();
	const theme = useAppSelector((state) => state.config.theme);

	return (
		<div className="flex flex-col w-full box-border">
			<h4>Theme</h4>
			<div className="flex items-center">
				<div className="flex-1 flex flex-col">
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
				<div className="w-6 flex justify-center">
					{theme !== Theme.System && theme !== undefined && (
						<ResetButton onClick={() => dispatch(setTheme(Theme.System))} />
					)}
				</div>
			</div>
		</div>
	);
};

export default ThemeSettings;
