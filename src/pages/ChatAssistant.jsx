import { useState, useRef, useEffect } from 'react';
import { Activity, Droplets, Thermometer, CloudRain, ShieldAlert, Sprout, Send, MessageSquare, Bot } from 'lucide-react';
import './ChatAssistant.css';

const initialMessages = [
  {
    role: 'assistant',
    content: 'Good morning. I have analysed the latest telemetry from Demo Farm. All systems are operational. Zone B moisture levels require attention — pre-irrigation is recommended before 18:00 today. How can I assist you?'
  }
];

const suggestions = [
  'What is the current yield outlook?',
  'Explain Zone B moisture drop',
  'Run a full farm risk assessment',
];

const history = [
  { label: 'Today 08:45', title: 'Morning Farm Brief' },
  { label: 'Yesterday 14:30', title: 'Irrigation Sequence Review' },
  { label: 'Yesterday 09:00', title: 'Soil Analysis Report' },
];

function ChatAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Analysing current telemetry...\n\nBased on live sensor data, soil moisture in Zone B has dropped to 58% — below the 60% threshold for the Soybean vegetative stage. I recommend initiating a 45-minute targeted drip irrigation sequence for Zone B. Expected moisture restoration: ~68% within 2 hours post-irrigation.\n\nShall I schedule the sequence for 16:00 today?'
      }]);
    }, 900);
  };

  return (
    <div className="container page-chat">
      <div className="chat-layout">

        {/* Left Sidebar — History */}
        <div className="panel chat-sidebar">
          <div className="panel-header">
            <h2 className="panel-title">Conversation History</h2>
          </div>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={i} className={`history-item ${i === 0 ? 'active' : ''}`}>
                <MessageSquare size={14} />
                <div>
                  <span className="h-title">{h.title}</span>
                  <span className="h-label">{h.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="panel chat-main">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-success" />
              <h2 className="panel-title" style={{ marginBottom: 0 }}>NxTYield AI Copilot</h2>
            </div>
            <div className="badge badge-success">Farm Context Active</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-row ${msg.role}`}>
                <div className={`chat-avatar ${msg.role}`}>
                  {msg.role === 'assistant' ? <Bot size={16} /> : <span>You</span>}
                </div>
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="suggestions-row">
                <span className="sug-label">Suggested questions</span>
                <div className="sug-chips">
                  {suggestions.map((s, i) => (
                    <button key={i} className="sug-chip" onClick={() => handleSend(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask anything about your farm..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn btn btn-primary" onClick={() => handleSend()}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right — Live Context */}
        <div className="panel context-panel">
          <div className="panel-header">
            <h2 className="panel-title">Live Farm Context</h2>
          </div>
          <p className="ctx-sub text-muted">AI is aware of current conditions</p>

          <div className="ctx-grid mt-3">
            <div className="ctx-row">
              <Activity size={16} className="text-success" />
              <div>
                <span className="ctx-key">Farm Health</span>
                <span className="ctx-val text-success">92 / 100</span>
              </div>
            </div>
            <div className="ctx-row">
              <Sprout size={16} className="text-success" />
              <div>
                <span className="ctx-key">Active Crop</span>
                <span className="ctx-val">Soybean (JS 335)</span>
              </div>
            </div>
            <div className="ctx-row">
              <Droplets size={16} className="text-primary" />
              <div>
                <span className="ctx-key">Avg. Moisture</span>
                <span className="ctx-val">67%</span>
              </div>
            </div>
            <div className="ctx-row">
              <Thermometer size={16} className="text-warning" />
              <div>
                <span className="ctx-key">Temperature</span>
                <span className="ctx-val">28.4°C</span>
              </div>
            </div>
            <div className="ctx-row">
              <CloudRain size={16} className="text-primary" />
              <div>
                <span className="ctx-key">Rain Probability</span>
                <span className="ctx-val">12%</span>
              </div>
            </div>
            <div className="ctx-row warning">
              <ShieldAlert size={16} className="text-warning" />
              <div>
                <span className="ctx-key">Active Alerts</span>
                <span className="ctx-val text-warning">2 Moderate</span>
              </div>
            </div>
          </div>

          <div className="ctx-footer mt-4">
            <span className="ctx-key text-muted">Predicted Yield</span>
            <span className="ctx-yield text-success">3.2 T / Acre</span>
            <span className="ctx-conf text-muted">Confidence: 88.4%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ChatAssistant;
