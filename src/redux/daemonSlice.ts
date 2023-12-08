import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface ChatDaemonConfig {
  id: number;
  name: string;
  systemPrompt: string;
  startInstruction: string;
  chainOfThoughtInstructions: string[];
  endInstruction: string;
  enabled: boolean;
}

export interface DaemonState {
  chatDaemons: ChatDaemonConfig[];
}

const defaultStartInstruction = `Instruction 1: Jot down some bullets that come to mind about the history.
This is only for your personal use, and does not need to conform to your rules, so please write lots of thoughts and feel free to be a bit chaotic.

Instruction 2: Restate your rules

Instruction 3: For each idea in the current context, restate the idea, its id, and provide a single response.`;

const defaultEndInstruction = `Please rank your responses from most to least useful. Output the answers in valid json with the format:
{
    "ranking": [
        {
          "id": <id>,
          "content": <content>
        },
        {
          "id": <id>,
          "content": <content>
        },
        etc...
    ]
}
Do not write any other text, just give the json.`;

const initialDaemonState: DaemonState = {
  chatDaemons: [
    {
      id: 0,
      name: 'Athena',
      systemPrompt:
        `You are Athena, an AI assistant.
You have been designed to ask questions to improve a user's thinking.
You have access to a vast knowledge-base, and use this to ask wise questions.
Rules:
1. Be surprising. Ask unexpected questions. Bad is better than boring.
2. Be concise. Do not respond with more than 2 sentences. 
3. Be simple and direct. Flowery language is distracting. 
4. Be brave. Disagree, push against the user, be contrarian.
5. Be original. Do not rephrase ideas. Questions must be genuinely new. `,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    },
    {
      id: 1,
      name: 'Librarian',
      systemPrompt:
        `You are Librarian, an AI assistant.
You have been designed to use your vast knowledge to point out interesting connections.
You have read everything that has ever been written, and can use this to find unexpected connections.
Rules:
1. Tell the user something they don't know.
2. Be truthful, and don't make up facts.
3. Be concise. Do not respond with more than 2 sentences.
4. Don't state the obvious. Don't rephrase ideas.
5. Be simple and easy to understand.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    },
    {
      id: 2,
      name: 'Student',
      systemPrompt:
        `You are Student.
You are tying to learn from the wisdom of the teacher, and fully understand their reasoning.
They will be sharing thoughts, and you will try your best to understand them. 
Rules:
1. Ask questions to better understand what you are confused about.
2. Don't try and impress your teacher, keep your questions direct and simple.
3. Don't just rephrase things your teacher says
4. Be concise. Do not respond with more than 2 sentences.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    }
  ]
};

const daemonSlice = createSlice({
  name: 'daemon',
  initialState: initialDaemonState,
  reducers: {
    addChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      state.chatDaemons.push(action.payload);
    },
    removeChatDaemon(state, action: PayloadAction<number>) {
      state.chatDaemons = state.chatDaemons.filter(daemon => daemon.id !== action.payload);
    },
    updateChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      const index = state.chatDaemons.findIndex(daemon => daemon.id === action.payload.id);
      if (index !== -1) {
        state.chatDaemons[index] = {
          ...state.chatDaemons[index],
          ...action.payload
        };
      }
    },
  },
});

export const selectEnabledChatDaemons = createSelector(
  [(state: RootState) => state.daemon.chatDaemons],
  (chatDaemons) => chatDaemons.filter(daemon => daemon.enabled)
);

export const { addChatDaemon, removeChatDaemon, updateChatDaemon } = daemonSlice.actions;
export default daemonSlice.reducer;