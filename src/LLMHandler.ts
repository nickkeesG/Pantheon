import axios from 'axios';
import { getEncoding } from 'js-tiktoken';
import ErrorHandler from './ErrorHandler';

async function CallChatAPI(data: any, config: any) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
        return response.data.choices.map((choice: { message: { content: string } }) => choice.message.content.trim());
    } catch (error: any) {
        if (error.response) {
            ErrorHandler.handleError(error.response.data.error.message);
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
            ErrorHandler.handleError(error.response.data.error.message);
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
            ErrorHandler.handleError(error.response.data.error.message);
        }
        console.error("Error calling base API for logprobs")
        console.error(error)
        return [];
    }
}

export async function GenerateChatComments(systemPrompt: string, userPrompts: string[], openAIKey: string, openAIOrgId: string, chatModel: string) {
    var data = {
        model: chatModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompts[0] }
        ]
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`,
            'OpenAI-Organization': openAIOrgId
        }
    };

    console.log(userPrompts[0])

    for (let userPrompt of userPrompts.slice(1)) {
        var response = await CallChatAPI(data, config);
        console.log(response);
        data.messages.push({ role: "assistant", content: response[0] });
        data.messages.push({ role: "user", content: userPrompt });
        console.log(userPrompt)
    }

    var finalData = {
        model: chatModel,
        response_format: {
            type: "json_object",
        },
        messages: data.messages
    };
    var finalResponse = await CallChatAPI(finalData, config);
    console.log(finalResponse);
    return finalResponse;
}

export async function GenerateBaseComments(prompt: string, openAIKey: string, openAIOrgId: string, baseModel: string) {
    var data = {
        model: baseModel,
        prompt: prompt,
        max_tokens: 128,
        stop: ["\n", " {"]
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
        console.log("Token: " + enc.decode([targetStringEncoded[i]]));
        console.log("Log prob full context: " + logProbFullContext);
        console.log("Log prob partial context: " + logProbPartialContext);

        var surprisal = logProbPartialContext - logProbFullContext;
        targetStringWithSurprisal.push({ token: enc.decode([targetStringEncoded[i]]), surprisal: surprisal });

        if (fullContextResponse.tokens[idxFullContext] !== partialContextResponse.tokens[idxPartialContext]) {
            console.error("Error: tokens do not match");
        }
    }

    if (targetStringWithSurprisal.length !== targetStringEncodedLength) {
        console.error("Error: target string surprisal length does not match target string length");
    }

    for (let i = 0; i < targetStringEncodedLength; i++) {
        console.log(targetStringWithSurprisal[i].token + ": " + targetStringWithSurprisal[i].surprisal);
    }

    return targetStringWithSurprisal;
}