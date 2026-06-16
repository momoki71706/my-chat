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

 try {
   const response = await fetch(`${apiUrl}/v1/chat/completions`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${apiKey}`,
     },
     body: JSON.stringify({
       model: '[杨枝甘露]claude-sonnet-4-6',
       max_tokens: 1024,
       messages: messages
     }),
   });

   const content = JSON.stringify(data);


   const content = data.choices?.[0]?.message?.content || '未收到回复';
   res.status(200).json({ content });
 } catch (error) {
   res.status(500).json({ error: '网络请求失败' });
 }
}
