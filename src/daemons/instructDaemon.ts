import { Idea, InstructDaemonConfig } from '../redux/models';
import { CallChatModel } from '../llmHandler';

/*
  Used to respond directly to instructions, for performing simple tasks (e.g. summarization)
*/
class InstructDaemon {
  config: InstructDaemonConfig;

  constructor (config: InstructDaemonConfig) {
    this.config = config;
  }

  async handleInstruction(pastIdeas: Idea[], instruction: string, openaiKey: string, openaiOrgId: string, instructModel: string) {

    let userPrompt = this.config.userPrompt;

    let pastIdeaText = pastIdeas.map(idea => idea.text).join('\n');
    userPrompt = userPrompt.replace("{PAST}", pastIdeaText);
    userPrompt = userPrompt.replace("{CURRENT}", instruction);

    let response = await CallChatModel(this.config.systemPrompt, userPrompt, openaiKey, openaiOrgId, instructModel);
    return response;
  }
}

export default InstructDaemon;