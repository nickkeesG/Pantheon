import { Comment, Idea, BaseDaemonConfig } from '../redux/models';
//import { GenerateBaseComments } from '../llmHandler';
//import { dispatchError } from '../errorHandler';


/*
  Behavior mirroring existing comments. Using base model for higher variance behavior
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

  getPastContext(pastIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>): string {
    let context = "";

    for (let i = 0; i < pastIdeas.length; i++) {
      if (pastIdeas[i].isUser) {
        context += '\n' + this.ideaTemplate.replace("{}", pastIdeas[i].text);
      }
    }

    context = this.mainTemplate.replace("{}", context);

    return context;
  }

  getFullContext(pastIdeas: Idea[], currentIdeas: Idea[], selectedIdeaIdx: number, commentsForPastIdeas: Record<number, Comment[]>): string {
    let context = this.getPastContext(pastIdeas, commentsForPastIdeas);

    for (let i = 0; i < selectedIdeaIdx + 1; i++) {
      if (currentIdeas[i].isUser) {
        context += '\n' + this.ideaTemplate.replace("{}", currentIdeas[i].text);
      }
    }

    return context;
  }
}

export default BaseDaemon;