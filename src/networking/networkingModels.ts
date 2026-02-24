export interface AxiosData {
	model: string;
}

export type ChatApiData = AxiosData & {
	messages: {
		role: string;
		content: string;
	}[];
};

export type BaseApiData = AxiosData & {
	prompt: string;
	max_tokens: number;
	temperature: number;
	stop: string[];
	n: number;
};

export type AxiosConfig = {
	headers: {
		"Content-Type": string;
		Authorization: string;
		"OpenAI-Organization": string;
	};
};
