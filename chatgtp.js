async function generateText(req,userMessage, systemContent) {
    const socket = req.app.get('socket');
    const completionStream = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMessage },
      ],
      model: 'gpt-3.5-turbo',
      stream: true,
    });
    let text = "";
    for await (const chunk of completionStream) {
      if (chunk.choices[0].delta.content) {
        socket.emit('stream-chunk', chunk.choices[0].delta.content);
        text += chunk.choices[0].delta.content;
      }
    }
    return text;
  }

  module.exports = generateText;