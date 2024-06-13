import { Idea, InstructDaemonConfig } from '../redux/models';
import { CallChatModel } from '../llmHandler';
import ChatDaemon from './chatDaemon';

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

    let pastIdeasText = pastIdeas.map(idea => idea.text).join('\n');
    userPrompt = ChatDaemon.fillInPrompt(userPrompt, pastIdeasText, instruction);

    let response = await CallChatModel(this.config.systemPrompt, userPrompt, openaiKey, openaiOrgId, instructModel);

    return response;
  }
}

export default InstructDaemon;