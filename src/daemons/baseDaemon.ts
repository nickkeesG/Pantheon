import { Idea, BaseDaemonConfig } from '../redux/models';
import { GenerateBaseCompletions } from '../llmHandler';

/*
  Used to generate base model completions of the user text
*/
class BaseDaemon {
  config: BaseDaemonConfig;
  mainTemplate: string;
  ideaTemplate: string;

  constructor(config: BaseDaemonConfig) {
    this.config = config;
    this.mainTemplate = config.mainTemplate;
    this.ideaTemplate = config.ideaTemplate;
  }

  getContext(currentIdeas: Idea[]): string {
    let context = "";

    for (let i = 0; i < currentIdeas.length; i++) {
      if (currentIdeas[i].isUser) {
        context += '\n' + this.ideaTemplate.replace("{}", currentIdeas[i].text);
      }
    }

    context = this.mainTemplate.replace("{}", context);

    let ideaPrefix = this.ideaTemplate.split("{}")[0];
    context += '\n' + ideaPrefix;

    return context;
  }

  getCompletions = async (currentIdeas: Idea[], openAIKey: string, openAIOrgId: string, baseModel: string) => {
    const context = this.getContext(currentIdeas);
    const completions = await GenerateBaseCompletions(context, openAIKey, openAIOrgId, baseModel, this.config.temperature);

    return completions;
  }
}

export default BaseDaemon;