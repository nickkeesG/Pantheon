import { Idea, BaseDaemonConfig } from '../redux/models';
import { GenerateBaseCompletions } from '../networking/llmHandler';


class BaseDaemon {
  config: BaseDaemonConfig;
  mainTemplate: string;
  ideaTemplate: string;

  constructor(config: BaseDaemonConfig) {
    this.config = config;
    this.mainTemplate = config.mainTemplate;
    this.ideaTemplate = config.ideaTemplate;
  }

  getContext(pastIdeas: Idea[]): string {
    let context = "";
    for (let i = 0; i < pastIdeas.length; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", pastIdeas[i].text);
    }
    context = this.mainTemplate.replace("{}", context);
    return context;
  }

  getPrefix(): string {
    return this.ideaTemplate.substring(0, this.ideaTemplate.indexOf("{}"));
  }

  getContextWithPrefix(pastIdeas: Idea[]): string {
    let context = this.getContext(pastIdeas);
    context += "\n" + this.getPrefix();
    return context;
  }

  getCompletions = async (currentIdeas: Idea[], openAIKey: string, openAIOrgId: string, baseModel: string) => {
    const context = this.getContextWithPrefix(currentIdeas);
    const completions = await GenerateBaseCompletions(context, openAIKey, openAIOrgId, baseModel, this.config.temperature);
    return completions;
  }
}

export default BaseDaemon;