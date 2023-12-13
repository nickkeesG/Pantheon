import {GenerateBaseComments} from '../LLMHandler';
import { Comment, Idea } from '../redux/models';
import { BaseDaemonConfig } from '../redux/models';
import ErrorHandler from '../ErrorHandler';

class BaseDaemon { 
  config: BaseDaemonConfig;
  mainTemplate: string;
  ideaTemplate: string;
  commentTemplate: string;

  constructor(config: BaseDaemonConfig) {
    this.config = config;
    this.mainTemplate = config.mainTemplate;
    this.ideaTemplate = config.ideaTemplate;
    this.commentTemplate = config.commentTemplate;
  }

  getContext(pastIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>): string {
    let context = "";

    for (let i = 0; i < pastIdeas.length; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", pastIdeas[i].text);

      let comments = commentsForPastIdeas[pastIdeas[i].id] || [];
      for (let j = 0; j < comments.length; j++) {
        context += '\n' + this.commentTemplate.replace("{}", comments[j].daemonName).replace("{}", comments[j].text);
      }
    }

    context = this.mainTemplate.replace("{}", context);

    return context;
  }

  async generateComment(pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, openaiKey: string, openaiOrgId: string, baseModel: string) {
    let context = this.getContext(pastIdeas, commentsForPastIdeas);
    
    // Pick a random current idea
    var randomIndex = Math.floor(Math.random() * currentIdeas.length);

    // Add all ideas up to and including the random idea
    for (let i = 0; i < randomIndex + 1; i++) {
      context += '\n' + this.ideaTemplate.replace("{}", currentIdeas[i].text);
    }

    const commentPrefix= this.commentTemplate.substring(0, this.commentTemplate.indexOf("{}"));
    context += "\n" + commentPrefix;

    try {
      var response = await GenerateBaseComments(context, openaiKey, openaiOrgId, baseModel);
      console.log(context + response[0]);
    } catch (error) {
      ErrorHandler.handleError("Error generating base comment");
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
      id: currentIdeas[randomIndex].id,
      daemonName: daemonName.trim(),
      content: content.trim()
    };
  }
}

export default BaseDaemon;