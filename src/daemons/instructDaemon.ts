import { Idea, InstructDaemonConfig } from '../redux/models';
import { CallChatModel } from '../networking/llmHandler';
import ChatDaemon from './chatDaemon';


class InstructDaemon {
  config: InstructDaemonConfig;

  constructor(config: InstructDaemonConfig) {
    this.config = config;
  }

  async handleInstruction(pastIdeas: Idea[], instruction: string, openaiKey: string, openaiOrgId: string, instructModel: string) {
    const pastIdeasText = pastIdeas.map(idea => idea.text).join('\n');
    const userPrompt = ChatDaemon.fillInPrompt(this.config.userPrompt, pastIdeasText, instruction);
    return await CallChatModel(this.config.systemPrompt, userPrompt, openaiKey, openaiOrgId, instructModel);
  }
}

export default InstructDaemon;