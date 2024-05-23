import { useAppDispatch, useAppSelector } from "../../hooks";
import { Theme, setTheme } from "../../redux/configSlice";

const ThemeSettings = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.config.theme)

  return (
    <div>
      <label>
        <input
          type="radio"
          name="theme"
          value="system"
          checked={theme === Theme.System}
          onChange={() => dispatch(setTheme(Theme.System))}
        />
        Use system theme
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === Theme.Light || theme === undefined}
          onChange={() => dispatch(setTheme(Theme.Light))}
        />
        Light
      </label>
      <label>
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
  )
}

export default ThemeSettings;