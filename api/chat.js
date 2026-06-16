export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const apiUrl = process.env.ANTHROPIC_BASE_URL || 'https://shufulei.net/v1';

  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置API密钥' });
  }

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || '调用失败' });
    }

    const reply = data.choices?.[0]?.message?.content || '未收到回复';
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: '网络请求失败' });
  }
}