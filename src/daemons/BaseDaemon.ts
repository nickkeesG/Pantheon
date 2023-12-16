import { Comment, Idea, BaseDaemonConfig } from '../redux/models';
import { GenerateBaseComments } from '../LLMHandler';
import ErrorHandler from '../ErrorHandler';

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
  evalutationTemplate: string;

  constructor(config: BaseDaemonConfig) {
    this.config = config;
    this.mainTemplate = config.mainTemplate;
    this.ideaTemplate = config.ideaTemplate;
    this.commentTemplate = config.commentTemplate;
    this.evalutationTemplate = hardcodedEvaluationTemplate;
  }

  getPastContext(pastIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>): string {
    console.log("Getting past context");
    console.log("number of past ideas: " + pastIdeas.length);
    let context = "";

    for (let i = 0; i < pastIdeas.length; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", pastIdeas[i].text);

      let comments = commentsForPastIdeas[pastIdeas[i].id] || [];
      console.log("number of comments for idea " + pastIdeas[i].id + ": " + comments.length);
      for (let j = 0; j < comments.length; j++) {
        context += '\n' + this.commentTemplate.replace("{}", comments[j].daemonName).replace("{}", comments[j].text);

        let approvalString = comments[j].userApproved ? " y" : " n";
        context += this.evalutationTemplate.replace("{}", approvalString);
      }
    }

    context = this.mainTemplate.replace("{}", context);

    return context;
  }

  getFullContext(pastIdeas: Idea[], currentIdeas: Idea[], selectedIdeaIdx: number, commentsForPastIdeas: Record<number, Comment[]>): string {
    let context = this.getPastContext(pastIdeas, commentsForPastIdeas);

    for (let i = 0; i < selectedIdeaIdx + 1; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", currentIdeas[i].text);
    }

    return context;
  }

  async generateComment(pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, openaiKey: string, openaiOrgId: string, baseModel: string) {
    // Pick a random current idea
    var selectedIdeaIndex = Math.floor(Math.random() * currentIdeas.length);

    let context = this.getFullContext(pastIdeas, currentIdeas, selectedIdeaIndex, commentsForPastIdeas);

    const commentPrefix = this.commentTemplate.substring(0, this.commentTemplate.indexOf("{}"));
    context += "\n" + commentPrefix;

    try {
      // currently only returns a single comment
      var response = await GenerateBaseComments(context, openaiKey, openaiOrgId, baseModel);
      console.log(context + response[0]);
    } catch (error) {
      ErrorHandler.handleError("Error generating base comment"); // send error to user
      console.error(error);
      return null;
    }


    let commentTemplateDivider = "";
    const regex = /\{\}(.*?)\{\}/;
    const match = this.commentTemplate.match(regex);

    if (match && match[1]) {
      commentTemplateDivider = match[1];
    }
    else {
      ErrorHandler.handleError("Regex failed to match");
      return null;
    }

    var splitResponse = response[0].split(commentTemplateDivider);

    if (splitResponse.length < 2) {
      ErrorHandler.handleError("Error: Response did not contain divider");
      return null;
    }

    var daemonName = splitResponse[0].trim();
    var content = splitResponse[1].trim();

    console.log("Daemon name: " + daemonName);
    console.log("Content: " + content);

    return {
      id: currentIdeas[selectedIdeaIndex].id,
      daemonName: daemonName.trim(),
      content: content.trim()
    };
  }
}

export default BaseDaemon;