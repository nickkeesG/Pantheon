import { GenerateChatComment } from "../networking/llmHandler";
import type { ChatDaemonConfig, Idea } from "../redux/models";

class ChatDaemon {
	static PAST_VAR = "{PAST}";
	static CURRENT_VAR = "{CURRENT}";
	config: ChatDaemonConfig;

	constructor(config: ChatDaemonConfig) {
		this.config = config;
	}

	static fillInPrompt(
		prompt: string,
		pastIdeasText: string,
		currentIdeaText: string,
	) {
		let filledPrompt = prompt.replace(
			new RegExp(ChatDaemon.PAST_VAR, "g"),
			pastIdeasText,
		);
		filledPrompt = filledPrompt.replace(
			new RegExp(ChatDaemon.CURRENT_VAR, "g"),
			currentIdeaText,
		);
		return filledPrompt;
	}

	async generateComments(
		pastIdeas: Idea[],
		currentIdea: Idea,
		openAIKey: string,
		openAIOrgId: string,
		chatModel: string,
	) {
		const userPrompts = [...this.config.userPrompts];
		const pastIdeasText = pastIdeas.map((idea) => idea.text).join("\n");
		const currentIdeaText = currentIdea.text;
		for (let i = 0; i < userPrompts.length; i++) {
			userPrompts[i] = ChatDaemon.fillInPrompt(
				userPrompts[i],
				pastIdeasText,
				currentIdeaText,
			);
		}
		return await GenerateChatComment(
			this.config.systemPrompt,
			userPrompts,
			openAIKey,
			openAIOrgId,
			chatModel,
		);
	}
}

export default ChatDaemon;
