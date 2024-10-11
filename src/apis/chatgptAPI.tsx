// Ví dụ sử dụng OpenAI để gửi một yêu cầu
export async function getChatGPTResponse(prompt: any, role: any = "user") {
    const url = 'https://chatgpt-42.p.rapidapi.com/gpt4';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'x-rapidapi-key': 'f07d9c06e4mshc8052135c7cd87bp166577jsn716e8395f673'
      },
      body: JSON.stringify({
        messages: [{ role: role, content: prompt }],
        web_access: false
      })
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.result;
    } catch (error) {
    console.error('Error:', error);
    }
    return "";

}

