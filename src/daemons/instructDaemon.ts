import { Comment, Idea, InstructDaemonConfig } from '../redux/models';
import { } from '../llmHandler';

class InstructDaemon {
  config: InstructDaemonConfig;
  systemPrompt: string;
  contextTemplate: string;

  constructor (config: InstructDaemonConfig) {
    this.config = config;
    this.systemPrompt = config.systemPrompt;
    this.contextTemplate = config.contextTemplate;
  }

  async handleInstruction(currentBranchIdeas: Idea[], currentBranchComments: Comment[], instruction: string, openaiKey: string, openaiOrgId: string, instructModel: string) {
    return "Do it yourself!";
  }
}

export default InstructDaemon;