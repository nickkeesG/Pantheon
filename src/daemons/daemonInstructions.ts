import { DaemonState } from "../redux/daemonSlice";

export const defaultDaemonState: DaemonState = {
  chatDaemons: [
    {
      id: 0,
      name: 'Legibilizer',
      systemPrompt:
        `You are Legibilizer
        Your purpose is to help the user understand the hidden assumptions and complexity of their own notes.`,
      userPrompts: ["Rewrite the following notes in your own words: \n\n{PAST}", 
                    "List 5-10 ideas from the notes you found unusual, and were difficult to include in the rewritten version.",
                    "Considering the ideas you listed, ask the user a question that you do NOT expect them to know the answer to. Keep your question short and simple."],
      enabled: true
    },
    {
      id: 1,
      name: 'Suggester',
      systemPrompt:
        `You are Suggester, and your purpose is to suggest simple and practical ideas to the user. You should not try to do their thinking for them, but rather gently suggest directions you think might be fruitful`,
      userPrompts: ["Read the following notes: \n\n{PAST}\n\n Now read this latest entry to the notes: \n\n{CURRENT}\n\nNow make a list of about 10 different comments you might want to give to the user, which would prompt them to explore a useful direction. Use simple language and be direct.",
                    "For each of the comments you listed, predict how the user might respond after receiving it. Write a single sentence predicted response for each comment.",
                    "Given the user's predicted responses, pick a single comment which you expect will provoke the most interesting response from the user. Write out that thought, and only that thought."],
      enabled: true
    }
  ],
  baseDaemon: {
    mainTemplate:
      `# Brainstorming Session (Active)
{}`,
    ideaTemplate: '-[User]: {}',
  },
  instructDaemon: {
    systemPrompt: `You are Instruct. You have been designed to follow the instructions provided by the user as quickly and accurately as possible.
You will be given a context, and then a set of instructions. You must follow the instructions to the best of your ability, and then provide a response.
You will be evaluated on how well your responses conform to the following rules:
1. Be concise. Write as little text as possible, with a hard limit of 400 characters.
2. Follow instructions. Do not write anything that is not directly asked for in the instructions.
3. Respond to the user in second person, using the pronoun "you" rather than "the user".`,
    userPrompt: `Please read the context provided, and then follow the instructions that follow.
    
Context:\n\n{PAST}\n\n

Now follow the next instructions keeping in mind the context you just read. 
Make sure to to keep your response as short as possible (less that 400 characters) and to write no unnecessary text which wasn't directly asked for by the user.

Instruction: {CURRENT}`
  }
};