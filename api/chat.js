cat > api/chat.js << 'EOF'
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置API密钥' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: messages
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || '未收到回复';
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ error: '网络请求失败' });
  }
}
EOF