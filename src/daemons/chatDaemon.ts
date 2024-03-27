import { Idea, ChatDaemonConfig } from '../redux/models';
import { GenerateChatComments } from '../llmHandler';
import { dispatchError } from '../errorHandler';

/*
  Hardcoded templates for the chat daemon
*/
const hardcodedHistoryItemTemplate = `    - "{}"`;
const hardcodedFirstInstructionTemplate = `First, read this history of thoughts from the user:
{}

Next, follow these three instructions to the best of your ability.

Instruction 1: Jot down some bullets that come to mind about the history.
This is only for your personal use, and does not need to conform to your rules, so please write lots of thoughts and feel free to be a bit chaotic.

Instruction 2: Restate your rules

Instruction 3: Provide 10 unique responses to the following idea: {}`;

const hardcodedLastInstruction = `Of all the responses you wrote, please select the one you think is the most original, interesting, and useful. 
Once you have decided, please type out only the selected response, and no other text.`;


/*
  Behavior hardcoded from config. Using instruct model for predictable behavior
*/
class ChatDaemon {
  config: ChatDaemonConfig;
  historyItemTemplate: string;
  firstInstructionTemplate: string; // Still need to replace "{}" with history and current idea
  lastInstruction: string;

  constructor(config: ChatDaemonConfig) {
    this.config = config;
    this.historyItemTemplate = hardcodedHistoryItemTemplate;
    this.firstInstructionTemplate = hardcodedFirstInstructionTemplate;
    this.lastInstruction = hardcodedLastInstruction;
  }

  private getFirstInstruction = (pastIdeas: Idea[], currentIdea: Idea): string => {
    // Get the history of ideas
    let history = "";
    for (let i = 0; i < pastIdeas.length; i++) {
      history += this.historyItemTemplate.replace("{}", pastIdeas[i].text);
      if (i !== pastIdeas.length - 1) {
        history += ",\n";
      }
    }

    // Get the current idea
    let currentIdeaText = currentIdea.text;

    // Replace the "{}" in the template with the history and current idea
    let firstInstruction = this.firstInstructionTemplate.replace("{}", history).replace("{}", currentIdeaText);

    return firstInstruction;
  }

  /*
    Function called from DaemonManager to generate a list of comments for the current ideas
  */
  async generateComment(pastIdeas: Idea[], currentIdea: Idea, openAIKey: string, openAIOrgId: string, chatModel: string) {
    // Generate prompts
    let systemPrompt = this.config.description + "\n\n" + this.config.rules;
    let firstInstruction = this.getFirstInstruction(pastIdeas, currentIdea);
    let lastInstruction = this.lastInstruction;

    try {
      // Call LLMHandler to generate comments
      var response = await GenerateChatComments(systemPrompt, firstInstruction, lastInstruction, openAIKey, openAIOrgId, chatModel);
    } catch (error) {
      dispatchError("Error calling chat model"); // send error to user
      console.error(error);
      return null;
    }

    return response;
  }
}

export default ChatDaemon;