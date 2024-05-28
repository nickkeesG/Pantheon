import { PersistedState } from "redux-persist";
import migrations from "../migrations";
import { RootState } from "../../store";
import { initialTreeState } from "../../treeSlice";
import { initialSectionState } from "../../sectionSlice";
import { initialIdeaState } from "../../ideaSlice";
import { initialCommentState } from "../../commentSlice";
import { defaultDaemonState } from "../../../daemons/daemonInstructions";
import { initialConfigState } from "../../configSlice";
import { initialUiState } from "../../uiSlice";
import { initialErrorState } from "../../errorSlice";

describe('Migrations', () => {
  it('should migrate state correctly', () => {
    const initialState: PersistedState = {
      _persist: {
        version: -1,
        rehydrated: true
      }
    };

    // TODO (Sofi, probably) Fix the expected DaemonState once the migration is finished
    const expectedState: RootState = {
      tree: initialTreeState,
      section: initialSectionState,
      idea: initialIdeaState,
      comment: initialCommentState,
      daemon: defaultDaemonState,
      config: initialConfigState,
      ui: initialUiState,
      error: initialErrorState,
      _persist: {
        version: Object.keys(migrations).length - 1,
        rehydrated: true
      }
    };

    let migratedState: PersistedState = initialState;
    Object.keys(migrations).forEach(version => {
      const migration = migrations[version];
      migratedState = migration(migratedState);
      migratedState!._persist.version = migratedState!._persist.version + 1;
    });

    expect(migratedState).toEqual(expectedState);
  });
});

// TODO (Sofi) Write a more complex migration test