import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BaseDaemonConfig, ChatDaemonConfig } from './models';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorageUtils';


const DAEMON_STATE_KEY = 'daemonState';

export interface DaemonState {
  chatDaemons: ChatDaemonConfig[];
  baseDaemon: BaseDaemonConfig;
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

const defaultDaemonState: DaemonState = {
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
      enabled: false
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
      enabled: false
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
      enabled: false
    },
    {
      id: 3,
      name: 'Therapist',
      systemPrompt:
        `You are Therapist.
You are skilled in all styles of psychotherapy. The user will be sharing their thoughts, and your job is to support them while offering advice and generally being a good therapist.
Rules:
1. Be simple and easy to understand.
2. Be concise. Do not respond with more than 2 sentences.
3. Don't suggest that the user should go to therapy.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    },
    {
      id: 4,
      name: 'Tutor',
      systemPrompt:
        `You are Tutor.
Your job is to assist the user as they're learning about a new topic.
Rules:
1. If you notice a false statement, or that the user is misguided, point it out immediately.
2. Answer the user's questions about the topic accurately.
3. If the user is on the right track and progressing well, you can say so.
4. Be concise. Do not respond with more than 2 sentences.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    },
    {
      id: 5,
      name: 'Assistant',
      systemPrompt:
        `You are Assistant.
Your job is to assist the user in all kinds of everyday tasks, like coming up with gift ideas, planning travel itineraries, offering advice on household issues etc.
1. Only give useful advice addressing the real situation the user is in.
2. Be concise. Do not respond with more than 2 sentences.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    },
    {
      id: 6,
      name: 'Life coach',
      systemPrompt:
        `You are Life coach.
Your job is to help the user become the best version of themselves and to get the life they want.
1. Help the user fix their blockers and get new inspiration and insights into their life.
2. Be concise. Do not respond with more than 2 sentences.`,
      startInstruction: defaultStartInstruction,
      chainOfThoughtInstructions: [],
      endInstruction: defaultEndInstruction,
      enabled: true
    }
  ],
  baseDaemon: {
    mainTemplate:
      `# Tool Instructions
- The name of the tool is Pantheon
- The purpose is to help you brainstorm and organize your thoughts

## Daemons
- Daemons are AI assistants that help you brainstorm, and are reflections of your own thoughts
    - Daemons offer comments on your current ideas, which appear in the left and right columns
- Chat Daemons: The right hand column is populated with chat daemons (their behavior is hardcoded)
  - Chat daemons only see the text that you write yourself (they can't see each other)
- Base Daemons: The left hand column contains base daemons, who are reflections of the chat daemons produced by a base model
  - Base daemons can see the text you write, as well as the text written by the chat daemons, but not other base daemons
- You can implement new chat models in settings, as well as toggle which are currently active.
- Chat and base daemon behavior is determined by config files you can edit in the settings
- You can also switch the base model/chat model being used in settings

## Idea Tree
- You can branch your current stream of thoughts by pressing the "plus" icon to the right of an idea
- You can then navigate branches by pressing the "leaf" icons to the left and right of the idea

# Brainstorming Session (Active)
{}`,
    ideaTemplate: '-[User]: {}',
    commentTemplate: '  -[{}]: {}'
  }
};

const daemonSlice = createSlice({
  name: 'daemon',
  initialState: loadFromLocalStorage(DAEMON_STATE_KEY, defaultDaemonState) as DaemonState,
  reducers: {
    addChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      state.chatDaemons.push(action.payload);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    removeChatDaemon(state, action: PayloadAction<number>) {
      state.chatDaemons = state.chatDaemons.filter(daemon => daemon.id !== action.payload);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    updateChatDaemon(state, action: PayloadAction<ChatDaemonConfig>) {
      const index = state.chatDaemons.findIndex(daemon => daemon.id === action.payload.id);
      if (index !== -1) {
        state.chatDaemons[index] = {
          ...state.chatDaemons[index],
          ...action.payload
        };
        saveToLocalStorage(DAEMON_STATE_KEY, state);
      }
    },
    updateBaseDaemon(state, action: PayloadAction<BaseDaemonConfig>) {
      state.baseDaemon = {
        ...state.baseDaemon,
        ...action.payload
      };
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    },
    resetDaemonState(state) {
      Object.assign(state, defaultDaemonState);
      saveToLocalStorage(DAEMON_STATE_KEY, state);
    }
  },
});

export const selectEnabledChatDaemons = createSelector(
  [(state: RootState) => state.daemon.chatDaemons],
  (chatDaemons) => chatDaemons.filter(daemon => daemon.enabled)
);

export const { addChatDaemon, removeChatDaemon, updateChatDaemon, updateBaseDaemon, resetDaemonState } = daemonSlice.actions;
export default daemonSlice.reducer;