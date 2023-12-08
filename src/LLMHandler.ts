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

export async function GenerateChatComments(systemPrompt: string, userPrompts: string[], openAIKey: string, openAIOrgId: string) {

    var data = {
        model: "gpt-4-1106-preview",
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
        model: "gpt-4-1106-preview",
        messages: data.messages
    };
    var finalResponse = await CallChatAPI(finalData, config);
    console.log(finalResponse);
    return finalResponse;
}