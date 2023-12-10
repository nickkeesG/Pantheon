import { GenerateChatComments } from '../LLMHandler';
import { ChatDaemonConfig } from '../redux/daemonSlice';
import { Idea } from '../redux/textSlice';
import ErrorHandler from '../ErrorHandler';

const historyTemplate = `    {"content": "{}"}`;
const ideaTemplate = `    {"id": {}, "content": "{}"}`;
const contextTemplate = `First, read this history of thoughts from the user:
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


class ChatDaemon {
  config: ChatDaemonConfig;
  ideaTemplate: string;
  historyTemplate: string;
  contextTemplate: string;

  constructor(config: ChatDaemonConfig) {
    this.config = config;
    this.ideaTemplate = ideaTemplate;
    this.historyTemplate = historyTemplate;
    this.contextTemplate = contextTemplate;
  }

  async generateComment(pastIdeas: Idea[], currentIdeas: Idea[], openAIKey: string, openAIOrgId: string, chatModel: string) {

    try {
      var history = "";
      for (let i = 0; i < pastIdeas.length; i++) {
        history += this.historyTemplate.replace("{}", pastIdeas[i].text);
        if (i !== pastIdeas.length - 1) {
          history += ",\n";
        }
      }
      var currentContext = "";
      for (let i = 0; i < currentIdeas.length; i++) {
        let tempId: number = i + 1;
        currentContext += this.ideaTemplate.replace("{}", tempId.toString()).replace("{}", currentIdeas[i].text);
        if (i !== currentIdeas.length - 1) {
          currentContext += ",\n";
        }
      }
      var context = this.contextTemplate.replace("{}", history).replace("{}", currentContext);
      var userPrompts = [];
      userPrompts.push(context + "\n\n" + this.config.startInstruction);
      for (let i = 0; i < this.config.chainOfThoughtInstructions.length; i++) {
        userPrompts.push(this.config.chainOfThoughtInstructions[i]);
      }
      userPrompts.push(this.config.endInstruction);
    } catch (error) {
      ErrorHandler.handleError("Error forming chat model context");
      console.error(error);
      return [];
    }

    try {
      var comments = await GenerateChatComments(this.config.systemPrompt, userPrompts, openAIKey, openAIOrgId, chatModel);
    } catch (error) {
      ErrorHandler.handleError("Error generating chat comment");
      console.error(error);
      return [];
    }

    // Parse the JSON string to a JavaScript objec
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