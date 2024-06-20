import { Idea, ChatDaemonConfig } from '../redux/models';
import { GenerateChatComment } from '../networking/llmHandler';


class ChatDaemon {
  config: ChatDaemonConfig;

  constructor(config: ChatDaemonConfig) {
    this.config = config;
  }

  static fillInPrompt(prompt: string, pastIdeasText: string, currentIdeaText: string) {
    let filledPrompt = prompt.replace('{PAST}', pastIdeasText);
    filledPrompt = filledPrompt.replace('{CURRENT}', currentIdeaText);
    return filledPrompt;
  }

  async generateComments(pastIdeas: Idea[], currentIdea: Idea, openAIKey: string, openAIOrgId: string, chatModel: string) {
    const userPrompts = [...this.config.userPrompts];
    const pastIdeasText = pastIdeas.map(idea => idea.text).join('\n');
    const currentIdeaText = currentIdea.text;
    for (let i = 0; i < userPrompts.length; i++) {
      userPrompts[i] = ChatDaemon.fillInPrompt(userPrompts[i], pastIdeasText, currentIdeaText);
    }
    return await GenerateChatComment(this.config.systemPrompt, userPrompts, openAIKey, openAIOrgId, chatModel);
  }
}

export default ChatDaemon;