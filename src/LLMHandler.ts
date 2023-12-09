import axios from 'axios';

async function CallChatAPI(data: any, config: any) {
  try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
      return response.data.choices.map((choice: { message: { content: string } }) => choice.message.content.trim());
  } catch (error) {
      console.error(error);
      return [];
  }
}

async function CallBaseAPI(data: any, config: any) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, config);
        return response.data.choices.map((choice: { text: string }) => choice.text.trim());
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function GenerateChatComments(systemPrompt: string, userPrompts: string[], openAIKey: string, openAIOrgId: string, chatModel: string) {
    var data = {
        model: chatModel,
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: userPrompts[0]}
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
      data.messages.push({role: "assistant", content: response[0]});
      data.messages.push({role: "user", content: userPrompt});
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
        stop: "\n"
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