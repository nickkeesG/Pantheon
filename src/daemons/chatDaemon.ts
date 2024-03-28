import { Idea, ChatDaemonConfig } from '../redux/models';
import { GenerateChatComments } from '../llmHandler';
import { dispatchError } from '../errorHandler';

/*
  Behavior hardcoded from config. Using chat model for predictable behavior
*/
class ChatDaemon {
  config: ChatDaemonConfig;

  constructor(config: ChatDaemonConfig) {
    this.config = config;
  }

  async generateComment(pastIdeas: Idea[], currentIdea: Idea, openAIKey: string, openAIOrgId: string, chatModel: string) {
    // Generate prompts
    let userPrompts = [...this.config.userPrompts];

    let pastIdeaText = pastIdeas.map(idea => idea.text).join('\n');
    let currentIdeaText = currentIdea.text;

    for (let i = 0; i < userPrompts.length; i++) {
      userPrompts[i] = userPrompts[i].replace("{PAST}", pastIdeaText);
      userPrompts[i] = userPrompts[i].replace("{CURRENT}", currentIdeaText);
    }

    try {
      // Call LLMHandler to generate comments
      var response = await GenerateChatComments(this.config.systemPrompt, userPrompts, openAIKey, openAIOrgId, chatModel);
    } catch (error) {
      dispatchError("Error calling chat model"); // send error to user
      console.error(error);
      return null;
    }

    return response;
  }
}

export default ChatDaemon;