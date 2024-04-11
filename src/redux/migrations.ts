import { MigrationManifest, PersistedState } from "redux-persist";
import { RootState } from "./store";
import { initialCommentState } from "./commentSlice";
import { initialTreeState } from "./treeSlice";
import { initialSectionState } from "./sectionSlice";
import { initialIdeaState } from "./ideaSlice";
import { defaultDaemonState } from "../daemons/daemonInstructions";
import { initialConfigState } from "./configSlice";
import { initialUiState } from "./uiSlice";
import { initialErrorState } from "./errorSlice";


const migrations: MigrationManifest = {
  0: (state: PersistedState | undefined): RootState => {
    const persistState = state?._persist || { version: 0, rehydrated: true };

    return {
      ...state,
      tree: initialTreeState,
      section: initialSectionState,
      idea: initialIdeaState,
      comment: initialCommentState,
      daemon: defaultDaemonState,
      config: initialConfigState,
      ui: initialUiState,
      error: initialErrorState,
      _persist: persistState
    }
  }
}

export default migrations;