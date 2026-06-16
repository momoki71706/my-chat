import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    localStorage.setItem('chat-history', JSON.stringify(newMessages));
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      const updated = [...newMessages, { role: 'assistant', content: data.content }];
      setMessages(updated);
      localStorage.setItem('chat-history', JSON.stringify(updated));
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '出错了，请重试' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat-history');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h1 style={{ margin: 0 }}>我们的小家</h1>
        <button onClick={clearChat} style={{ padding: '6px 12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>清空记录</button>
      </div>
      <div style={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: msg.role === 'user' ? '#007bff' : '#f0f0f0', color: msg.role === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: 12, display: 'inline-block' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入消息..."
          disabled={loading}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          发送
        </button>
      </div>
    </div>
  );
}

export default App;