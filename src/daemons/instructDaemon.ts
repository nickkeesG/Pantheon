import { CallChatModel } from "../networking/llmHandler";
import {
	type Idea,
	IdeaType,
	type InstructDaemonConfig,
} from "../redux/models";
import ChatDaemon from "./chatDaemon";

class InstructDaemon {
	config: InstructDaemonConfig;

	constructor(config: InstructDaemonConfig) {
		this.config = config;
	}

	async handleInstruction(
		pastIdeas: Idea[],
		instruction: string,
		openaiKey: string,
		openaiOrgId: string,
		instructModel: string,
	) {
		const pastIdeasText = pastIdeas
			.map((idea) => {
				switch (idea.type) {
					case IdeaType.InstructionToAi:
						return `[Instruction] ${idea.text}`;
					case IdeaType.ResponseFromAi:
						return `[AI Response] ${idea.text}`;
					default:
						return idea.text;
				}
			})
			.join("\n");
		const userPrompt = ChatDaemon.fillInPrompt(
			this.config.userPrompt,
			pastIdeasText,
			instruction,
		);
		return await CallChatModel(
			this.config.systemPrompt,
			userPrompt,
			openaiKey,
			openaiOrgId,
			instructModel,
		);
	}
}

export default InstructDaemon;
