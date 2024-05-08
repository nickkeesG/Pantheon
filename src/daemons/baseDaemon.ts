import { Idea, BaseDaemonConfig } from '../redux/models';

// TODO - make this configurable
const hardcodedEvaluationTemplate = ` {Comment accepted (y/n):{}}`;

/*
  Behavior mirroring existing comments. Using base model for higher variance behavior
*/
class BaseDaemon {
  config: BaseDaemonConfig;
  mainTemplate: string;
  ideaTemplate: string;
  commentTemplate: string;
  evaluationTemplate: string;

  constructor(config: BaseDaemonConfig) {
    this.config = config;
    this.mainTemplate = config.mainTemplate;
    this.ideaTemplate = config.ideaTemplate;
    this.commentTemplate = config.commentTemplate;
    this.evaluationTemplate = hardcodedEvaluationTemplate;
  }

  getContext(pastIdeas: Idea[]): string {
    let context = "";

    for (let i = 0; i < pastIdeas.length; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", pastIdeas[i].text);
    }

    context = this.mainTemplate.replace("{}", context);

    return context;
  }
}

export default BaseDaemon;