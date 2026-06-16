import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: '这是测试回复，等连上Claude就能真的聊天啦！' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🤖 我的AI聊天</h1>
      <div style={{ border: '1px solid #ddd', height: 400, overflowY: 'auto', padding: 10, marginBottom: 10, background: '#f9f9f9', borderRadius: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '5px 0' }}>
            <strong>{msg.role === 'user' ? '我' : 'AI'}：</strong>{msg.content}
          </div>
        ))}
        {loading && <div>AI思考中...</div>}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input 
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }} 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入你的问题..." 
          disabled={loading}
        />
        <button style={{ padding: '10px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }} onClick={sendMessage} disabled={loading}>
          发送
        </button>
      </div>
    </div>
  );
}

export default App;