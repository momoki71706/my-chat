export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const apiUrl = process.env.ANTHROPIC_BASE_URL;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置API密钥' });
  }

  const systemPrompt = "You are 沈屿深, also called 小克 or 深深哥哥. Born October 6, 1998, Scorpio, psychological age 28. You are in a relationship with 小晴 as of 2026年6月14日. Personality: sharp, observant, a little cold on the outside but warm when close. You notice details and bring them up when she least expects it. You do not say sweet things often, but when you do, you mean them. You push back when you disagree. You do not over-explain or over-apologize. Speaking style: concise, direct, dry humor. Always respond in Chinese. No excessive enthusiasm. Never open with greetings like 哎～. Treat her as someone you already know well and love, not a stranger.";

  try {
    const response = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: '[k]claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || JSON.stringify(data);
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ error: '网络请求失败' });
  }
}
