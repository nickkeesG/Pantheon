import { Idea, ChatDaemonConfig } from '../redux/models';
import { GenerateChatComment } from '../llmHandler';
import { dispatchError } from '../errorHandler';

/*
  Used to generate chat comments, using prompt pipeline defined by config
*/
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
    // Generate prompts
    let userPrompts = [...this.config.userPrompts];

    let pastIdeasText = pastIdeas.map(idea => idea.text).join('\n');
    let currentIdeaText = currentIdea.text;

    for (let i = 0; i < userPrompts.length; i++) {
      userPrompts[i] = ChatDaemon.fillInPrompt(userPrompts[i], pastIdeasText, currentIdeaText);
    }

    try {
      // Call LLMHandler to generate comments
      var response = await GenerateChatComment(this.config.systemPrompt, userPrompts, openAIKey, openAIOrgId, chatModel);
    } catch (error) {
      dispatchError("Error calling chat model"); // send error to user
      console.error(error);
      return null;
    }

    return response;
  }
}

export default ChatDaemon;