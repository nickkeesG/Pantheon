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

// The prompt will elicit a functional response
export const V0to1UserPrompt = `First, read this history of thoughts from the user:
{PAST}
{CURRENT}

Keeping in mind your rules, and considering everything the user has written, please give an original response to the most recent idea:
{Current}

Type only your response, and write no other text.`;

export const V0to1Migration = (state: PersistedState): RootState => {
  if (state && 'daemon' in state) {
    const daemonState = state.daemon as V0DaemonState;
    const newDaemonState: DaemonState = {
      chatDaemons: [
        ...daemonState.chatDaemons.map(daemon => {
          return {
            id: daemon.id,
            name: daemon.name,
            systemPrompt: daemon.description + "\n" + daemon.rules,
            userPrompts: [V0to1UserPrompt],
            enabled: daemon.enabled
          }
        }),
        ...defaultDaemonState.chatDaemons.map((daemon, index) => ({
          ...daemon,
          id: daemon.id + daemonState.chatDaemons.length
        }))
      ],
      baseDaemon: defaultDaemonState.baseDaemon,
      instructDaemon: defaultDaemonState.instructDaemon
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