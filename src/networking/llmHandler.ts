import axios from "axios";
import { dispatchError } from "../errorHandler";
import { ChainOfThoughtType } from "../redux/models";
import type {
	AxiosConfig,
	AxiosData,
	BaseApiData,
	ChatApiData,
} from "./networkingModels";

async function CallOpenAIAPI(
	url: string,
	data: AxiosData,
	openAIKey: string,
	openAIOrgId: string,
) {
	const config: AxiosConfig = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${openAIKey}`,
			"OpenAI-Organization": openAIOrgId,
		},
	};
	try {
		return await axios.post(url, data, config);
	} catch (error: unknown) {
		dispatchError("Error calling OpenAI API");
		console.error(error);
	}
}

async function CallChatAPI(
	data: ChatApiData,
	openAIKey: string,
	openAIOrgId: string,
): Promise<string[] | null> {
	const response = await CallOpenAIAPI(
		"https://api.openai.com/v1/chat/completions",
		data,
		openAIKey,
		openAIOrgId,
	);
	if (response) {
		try {
			return response.data.choices.map(
				(choice: { message: { content: string } }) =>
					choice.message.content.trim(),
			);
		} catch (error: unknown) {
			dispatchError("Couldn't parse response from OpenAI Chat API");
			console.error(error);
			return null;
		}
	} else {
		return null;
	}
}

async function CallBaseAPI(
	data: BaseApiData,
	openAIKey: string,
	openAIOrgId: string,
): Promise<string[] | null> {
	const response = await CallOpenAIAPI(
		"https://api.openai.com/v1/completions",
		data,
		openAIKey,
		openAIOrgId,
	);
	if (response) {
		try {
			return response.data.choices.map((choice: { text: string }) =>
				choice.text.trim(),
			);
		} catch (error: unknown) {
			dispatchError("Couldn't parse response from OpenAI Base API");
			console.error(error);
			return null;
		}
	} else {
		return null;
	}
}

export async function CallChatModel(
	systemPrompt: string,
	userPrompt: string,
	openAIKey: string,
	openAIOrgId: string,
	chatModel: string,
): Promise<string[] | null> {
	const data: ChatApiData = {
		model: chatModel,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt },
		],
	};
	return await CallChatAPI(data, openAIKey, openAIOrgId);
}

const roleToEnumMap: { [key: string]: ChainOfThoughtType } = {
	system: ChainOfThoughtType.System,
	user: ChainOfThoughtType.User,
	assistant: ChainOfThoughtType.Daemon,
};

export async function GenerateChatComment(
	systemPrompt: string,
	userPrompts: string[],
	openAIKey: string,
	openAIOrgId: string,
	chatModel: string,
): Promise<{
	text: string;
	chainOfThought: [ChainOfThoughtType, string][];
} | null> {
	const data: ChatApiData = {
		model: chatModel,
		messages: [{ role: "system", content: systemPrompt }],
	};
	try {
		for (const userPrompt of userPrompts) {
			data.messages.push({ role: "user", content: userPrompt });
			const intermediateResponse = await CallChatAPI(
				data,
				openAIKey,
				openAIOrgId,
			);
			if (intermediateResponse) {
				data.messages.push({
					role: "assistant",
					content: intermediateResponse[0],
				});
			} else {
				throw new Error("Didn't receive response from OpenAI Chat API", {
					cause: intermediateResponse,
				});
			}
		}
		const commentText: string = data.messages[data.messages.length - 1].content;
		const chainOfThought: [ChainOfThoughtType, string][] = data.messages.map(
			(message: { role: string; content: string }) => [
				roleToEnumMap[message.role],
				message.content,
			],
		);
		return { text: commentText, chainOfThought: chainOfThought };
	} catch (error: unknown) {
		dispatchError("Couldn't finish daemon chain-of-thought");
		console.error(error);
		return null;
	}
}

export async function GenerateBaseCompletions(
	prompt: string,
	openAIKey: string,
	openAIOrgId: string,
	baseModel: string,
	temperature: number,
): Promise<string[] | null> {
	const data: BaseApiData = {
		model: baseModel,
		prompt: prompt.trim(),
		max_tokens: 64,
		temperature: temperature,
		stop: ["\n"],
		n: 6,
	};
	return await CallBaseAPI(data, openAIKey, openAIOrgId);
}
