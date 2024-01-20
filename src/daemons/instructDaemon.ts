import { Comment, Idea, InstructDaemonConfig } from '../redux/models';
import { CallChatModel } from '../llmHandler';

const hardcodedIdeaTemplate = '- Me: "{}"';
const hardcodedCommentTemplate = '    - {}: "{}"';

type GroupedComments = { [ideaId: number]: Comment[] };

class InstructDaemon {
  config: InstructDaemonConfig;
  systemPrompt: string;
  contextTemplate: string;

  constructor (config: InstructDaemonConfig) {
    this.config = config;
    this.systemPrompt = config.systemPrompt;
    this.contextTemplate = config.contextTemplate;
  }

  private getContext(currentBranchIdeas: Idea[], groupedComments: GroupedComments): string {
    let context = "";
    for (let i = 0; i < currentBranchIdeas.length; i++) {
      context += hardcodedIdeaTemplate.replace("{}", currentBranchIdeas[i].text);
      if (i !== currentBranchIdeas.length - 1) {
        context += ",\n";
      }

      let comments = groupedComments[currentBranchIdeas[i].id];
      for (let j = 0; j < comments.length; j++) {
        context += hardcodedCommentTemplate.replace("{}", comments[j].daemonName).replace("{}", comments[j].text);
        if (j !== comments.length - 1) {
          context += ",\n";
        }
      }
    }
    return context;
  }

  async handleInstruction(currentBranchIdeas: Idea[], groupedComments: GroupedComments , instruction: string, openaiKey: string, openaiOrgId: string, instructModel: string) {
    let context = this.getContext(currentBranchIdeas, groupedComments);
    context = this.contextTemplate.replace("{}", context);
    let userPrompt = context + "\n\n" + instruction;

    let response = await CallChatModel(this.systemPrompt, userPrompt, openaiKey, openaiOrgId, instructModel);
    return response;
  }
}

export default InstructDaemon;