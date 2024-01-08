import { Idea, ChatDaemonConfig } from '../redux/models';
import { GenerateChatComments } from '../LLMHandler';
import ErrorHandler from '../ErrorHandler';

/*
  Hardcoded templates for the chat daemon
*/
const hardcodedHistoryTemplate = `    {"content": "{}"}`;
const hardcodedIdeaTemplate = `    {"id": {}, "content": "{}"}`;
const hardcodedContextTemplate = `First, read this history of thoughts from the user:
{
  "history": [
{}
  ]
}

Next, read these ideas which make up their current context:

{
  "current_context": [
{}
  ]
}`;


/*
  Behavior hardcoded from config. Using instruct model for predictable behavior
*/
class ChatDaemon {
  config: ChatDaemonConfig;
  ideaTemplate: string;
  historyTemplate: string;
  contextTemplate: string;

  constructor(config: ChatDaemonConfig) {
    this.config = config;
    this.ideaTemplate = hardcodedIdeaTemplate;
    this.historyTemplate = hardcodedHistoryTemplate;
    this.contextTemplate = hardcodedContextTemplate;
  }

  private getContext = (pastIdeas: Idea[], currentIdeas: Idea[]): string => {
    let history = "";
    for (let i = 0; i < pastIdeas.length; i++) {
      history += this.historyTemplate.replace("{}", pastIdeas[i].text);
      if (i !== pastIdeas.length - 1) {
        history += ",\n";
      }
    }
    let currentContext = "";
    for (let i = 0; i < currentIdeas.length; i++) {
      let tempId: number = i + 1;
      currentContext += this.ideaTemplate.replace("{}", tempId.toString()).replace("{}", currentIdeas[i].text);
      if (i !== currentIdeas.length - 1) {
        currentContext += ",\n";
      }
    }
    let context = this.contextTemplate.replace("{}", history).replace("{}", currentContext);
    return context;
  }

  /*
    Function called from DaemonManager to generate a list of comments for the current ideas
  */
  async generateComments(pastIdeas: Idea[], currentIdeas: Idea[], openAIKey: string, openAIOrgId: string, chatModel: string) {
    try {
      var userPrompts = []; // List of prompts to send, one by one, to the chat model
      var context = this.getContext(pastIdeas, currentIdeas);
      userPrompts.push(context + "\n\n" + this.config.startInstruction);
      for (let i = 0; i < this.config.chainOfThoughtInstructions.length; i++) {
        userPrompts.push(this.config.chainOfThoughtInstructions[i]);
      }
      userPrompts.push(this.config.endInstruction);
    } catch (error) {
      ErrorHandler.handleError("Error generating user prompts for chat model"); // send error to user
      console.error(error);
      return [];
    }

    try {
      // Call LLMHandler to generate comments
      var comments = await GenerateChatComments(this.config.systemPrompt, userPrompts, openAIKey, openAIOrgId, chatModel);
    } catch (error) {
      ErrorHandler.handleError("Error calling chat model"); // send error to user
      console.error(error);
      return [];
    }

    // Parse the JSON string to a JavaScript object
    try {
      var commentsObj = JSON.parse(comments);
      var ranking = commentsObj.ranking;

      var results = [];
      for (let i = 0; i < ranking.length; i++) {
        console.log(`id: ${ranking[i].id}, content: ${ranking[i].content}`);
        // Add the id and content to the results array
        let tempId: number = ranking[i].id - 1;
        results.push({ id: currentIdeas[tempId].id, content: ranking[i].content });
      }
    } catch (error) {
      ErrorHandler.handleError("Error parsing chat comment");
      console.error(error);
      return [];
    }

    return results;
  }
}

export default ChatDaemon;