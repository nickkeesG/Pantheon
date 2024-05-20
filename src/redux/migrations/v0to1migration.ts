import { PersistedState } from "redux-persist";
import { RootState } from "../store";
import { DaemonState } from "../daemonSlice";
import { defaultDaemonState } from "../../daemons/daemonInstructions";

interface V0ChatDaemonConfig {
  id: number;
  name: string;
  description: string;
  rules: string;
  enabled: boolean;
}
interface V0BaseDaemonConfig {
  mainTemplate: string;
  ideaTemplate: string;
  commentTemplate: string;
}
interface V0InstructDaemonConfig {
  systemPrompt: string;
  contextTemplate: string;
}
interface V0DaemonState {
  chatDaemons: V0ChatDaemonConfig[];
  baseDaemon: V0BaseDaemonConfig;
  instructDaemon: V0InstructDaemonConfig;
}

export type V0StoreState = { [P in keyof Omit<RootState, 'daemon'>]: RootState[P]; } & {
  daemon: V0DaemonState
} & PersistedState;

export const V0to1Migration = (state: PersistedState): RootState => {
  if (state && 'daemon' in state) {
    const daemonState = state.daemon as V0DaemonState;
    const newDaemonState: DaemonState = {
      // TODO (Niki) Fix - Decide how the DaemonState should look after a migration from v0
      chatDaemons: [
        ...daemonState.chatDaemons.map(daemon => {
          return {
            ...daemon,
            systemPrompt: daemon.description,
            userPrompts: [daemon.rules]
          }
        }),
        ...defaultDaemonState.chatDaemons
      ],
      baseDaemon: {
        mainTemplate: daemonState.baseDaemon.mainTemplate,
        ideaTemplate: daemonState.baseDaemon.ideaTemplate,
        temperature: 0.7
      },
      instructDaemon: {
        systemPrompt: daemonState.instructDaemon.systemPrompt,
        userPrompt: daemonState.instructDaemon.contextTemplate
      }
    }
    return {
      ...state,
      daemon: newDaemonState
    } as RootState
  }

  return {
    ...state,
    daemon: defaultDaemonState
  } as RootState
}