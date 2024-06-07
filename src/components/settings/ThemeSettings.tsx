import { useAppDispatch, useAppSelector } from "../../hooks";
import { Theme, setTheme } from "../../redux/configSlice";
import { ContainerVertical } from "../../styles/sharedStyles";

const ThemeSettings = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.config.theme)

  return (
    <ContainerVertical>
      <h4>Theme</h4>
      <label>
        <input
          type="radio"
          name="theme"
          value="system"
          checked={theme === Theme.System || theme === undefined}
          onChange={() => dispatch(setTheme(Theme.System))}
        />
        Use system theme
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === Theme.Light}
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
    </ContainerVertical>
  )
}

export default ThemeSettings;