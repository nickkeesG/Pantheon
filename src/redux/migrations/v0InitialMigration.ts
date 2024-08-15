import { PersistedState } from "redux-persist";
import { V0StoreState } from "./v0to1migration";
import { initialTreeState } from "../treeSlice";
import { initialSectionState } from "../sectionSlice";
import { initialCommentState } from "../commentSlice";
import { initialUiState } from "../uiSlice";
import { initialErrorState } from "../errorSlice";
import { initialV2ConfigState } from "./v2to3migration";

export const V0InitialMigration = (state: PersistedState): V0StoreState => {
  const persistState = state?._persist || { version: 0, rehydrated: true };

  return {
    ...state,
    tree: initialTreeState,
    section: initialSectionState,
    idea: {
      ideas: {}
    },
    comment: initialCommentState,
    daemon: {
      chatDaemons: [],
      baseDaemon: {
        mainTemplate:
          `# Brainstorming Session (Active)
{}`,
        ideaTemplate: '-[User]: {}',
        commentTemplate: '  -[{}]: {}'
      },
      instructDaemon: {
        systemPrompt: `You are Instruct. You have been designed to follow the instructions provided by the user as quickly and accurately as possible.
You will be given a context, and then a set of instructions. You must follow the instructions to the best of your ability, and then provide a response.
You will be evaluated on how well your responses conform to the following rules:
1. Be concise. Write as little text as possible, with a hard limit of 400 characters.
2. Follow instructions. Do not write anything that is not directly asked for in the instructions.
3. Respond to the user in second person, using the pronoun "you" rather than "the user".`,
        contextTemplate: `Please read the following context, and then follow the instructions that follow:\n\n{}\n\n
Now follow the next instructions keeping in mind the context you just read. 
Make sure to to keep your response as short as possible (less that 400 characters) and to write no unnecessary text which wasn't directly asked for by the user:`
      }
    },
    config: initialV2ConfigState,
    ui: initialUiState,
    error: initialErrorState,
    _persist: persistState
  }
}