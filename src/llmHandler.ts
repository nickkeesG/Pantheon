import axios from 'axios';
import { getEncoding } from 'js-tiktoken';
import { dispatchError } from './errorHandler';

async function CallChatAPI(data: any, config: any) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
        return response.data.choices.map((choice: { message: { content: string } }) => choice.message.content.trim());
    } catch (error: any) {
        if (error.response) {
            dispatchError(error.response.data.error.message);
        }
        console.error("Error calling chat API")
        console.error(error)
        return [];
    }
}

async function CallBaseAPI(data: any, config: any) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, config);
        return response.data.choices.map((choice: { text: string }) => choice.text.trim());
    } catch (error: any) {
        if (error.response) {
            dispatchError(error.response.data.error.message);
        }
        console.error("Error calling base API")
        console.error(error)
        return [];
    }
}

async function CallBaseAPIForLogprobs(data: any, config: any) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, config);
        return response.data.choices[0].logprobs;
    } catch (error: any) {
        if (error.response) {
            dispatchError(error.response.data.error.message);
        }
        console.error("Error calling base API for logprobs")
        console.error(error)
        return [];
    }
}

export async function CallChatModel(systemPrompt: string, userPrompt: string, openAIKey: string, openAIOrgId: string, chatModel: string) {
    var data = {
        model: chatModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
            'OpenAI-Organization': openAIOrgId
        }
    };

    var response = await CallChatAPI(data, config);
    return response[0];
}

export async function GenerateChatComment(systemPrompt: string, userPrompts: string[], openAIKey: string, openAIOrgId: string, chatModel: string) {
    var data = {
        model: chatModel,
        messages: [{ role: "system", content: systemPrompt }]
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
            'OpenAI-Organization': openAIOrgId
        }
    };

    for (const userPrompt of userPrompts) {
        data.messages.push({ role: "user", content: userPrompt });

        let intermediateResponse = await CallChatAPI(data, config);
        if (intermediateResponse.length > 0) {
            data.messages.push({ role: "assistant", content: intermediateResponse[0] });
        }
    }

    return data.messages[data.messages.length - 1].content;
}

export async function GenerateBaseCompletions(prompt: string, openAIKey: string, openAIOrgId: string, baseModel: string, temperature: number) {
    prompt = prompt.trim();

    var data = {
        model: baseModel,
        prompt: prompt,
        max_tokens: 64,
        temperature: temperature,
        stop: ["\n"],
        n: 6,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
            'OpenAI-Organization': openAIOrgId
        }
    };

    var response = await CallBaseAPI(data, config);
    return response;
}

export async function GetSurprisal(fullContext: string,
    partialContext: string,
    targetString: string,
    openAIKey: string,
    openAIOrgId: string,
    baseModel: string) {


    const enc = getEncoding("cl100k_base");
    fullContext = fullContext.trim();
    partialContext = partialContext.trim();
    targetString = " " + targetString.trim();
    const targetStringEncoded = enc.encode(targetString);
    const targetStringEncodedLength = targetStringEncoded.length;

    var fullContextData = {
        model: baseModel,
        prompt: fullContext + targetString,
        max_tokens: 0,
        logprobs: 0,
        echo: true,
    };

    var partialContextData = {
        model: baseModel,
        prompt: partialContext + targetString,
        max_tokens: 0,
        logprobs: 0,
        echo: true,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
            'OpenAI-Organization': openAIOrgId
        }
    };

    var fullContextResponse = await CallBaseAPIForLogprobs(fullContextData, config);
    var partialContextResponse = await CallBaseAPIForLogprobs(partialContextData, config);
    var fullContextResponseLength = fullContextResponse.token_logprobs.length;
    var partialContextResponseLength = partialContextResponse.token_logprobs.length;

    var targetStringWithSurprisal = [];
    for (let i = 0; i < targetStringEncodedLength; i++) {
        var idxFullContext = fullContextResponseLength - targetStringEncodedLength + i;
        var idxPartialContext = partialContextResponseLength - targetStringEncodedLength + i;
        var logProbFullContext = fullContextResponse.token_logprobs[idxFullContext];
        var logProbPartialContext = partialContextResponse.token_logprobs[idxPartialContext];

        var surprisal = logProbPartialContext - logProbFullContext;
        targetStringWithSurprisal.push({ token: enc.decode([targetStringEncoded[i]]), surprisal: surprisal });

        if (fullContextResponse.tokens[idxFullContext] !== partialContextResponse.tokens[idxPartialContext]) {
            console.error("Error: tokens do not match");
        }
    }

    if (targetStringWithSurprisal.length !== targetStringEncodedLength) {
        console.error("Error: target string surprisal length does not match target string length");
    }

    return targetStringWithSurprisal;
}