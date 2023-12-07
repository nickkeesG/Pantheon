import {GenerateComments} from '../LLMHandler';

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
  name: string;
  systemPrompt: string;
  startInstruction: string;
  chainOfThoughtInstructions: string[];
  endInstruction: string;
  
  ideaTemplate: string;
  contextTemplate: string;

  constructor(name: string, prompt: string, startInstruction: string, chainOfThoughtInstructions: string[], endInstruction: string) {
      this.name = name;
      this.systemPrompt = prompt;
      this.startInstruction = startInstruction;
      this.chainOfThoughtInstructions = chainOfThoughtInstructions;
      this.endInstruction = endInstruction;

      this.ideaTemplate = ideaTemplate;
      this.contextTemplate = contextTemplate;
  }

  async generateComment(pastIdeas: any, currentIdeas: any, openaiKey: string, openaiOrgId: string) {
    var history = "";
    for (var i = 0; i < pastIdeas.length; i++) {
      history += this.ideaTemplate.replace("{}", pastIdeas[i].id).replace("{}", pastIdeas[i].text);
      if (i != pastIdeas.length - 1) {
        history += ",\n";
      }
    }
    var currentContext = "";
    for (var i = 0; i < currentIdeas.length; i++) {
      currentContext += this.ideaTemplate.replace("{}", currentIdeas[i].id).replace("{}", currentIdeas[i].text);
      if (i != currentIdeas.length - 1) {
        currentContext += ",\n";
      }
    }
    var context = this.contextTemplate.replace("{}", history).replace("{}", currentContext);
    var userPrompts = [];
    userPrompts.push(context + "\n\n" + this.startInstruction);
    for (var i = 0; i < this.chainOfThoughtInstructions.length; i++) {
      userPrompts.push(this.chainOfThoughtInstructions[i]);
    }
    userPrompts.push(this.endInstruction);

    var comments = await GenerateComments(this.systemPrompt, userPrompts, openaiKey, openaiOrgId);

    // Parse the JSON string to a JavaScript object
    var commentsObj = JSON.parse(comments);
    var ranking = commentsObj.ranking;

    var results = [];
    for (var i = 0; i < ranking.length; i++) {
      console.log(`id: ${ranking[i].id}, content: ${ranking[i].content}`);
      // Add the id and content to the results array
      results.push({id: ranking[i].id, content: ranking[i].content});
    }

    return results;
  }
}

export default ChatDaemon;