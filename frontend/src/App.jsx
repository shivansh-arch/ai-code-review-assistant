import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User as UserIcon, Bot, Loader2, RefreshCw } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize a unique user ID on first load
  useEffect(() => {
    let storedId = localStorage.getItem('chatbot_userId');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('chatbot_userId', storedId);
    }
    setUserId(storedId);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Connect to the backend
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        userId,
        message: userMsg
      });

      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
      } else {
        throw new Error(response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMsg = 'Sorry, I encountered an error. Please try again.';
      if (error.response?.status === 429) {
        errorMsg = 'Rate limit exceeded. Please slow down and try again later.';
      }
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', content: 'Chat history cleared. How can I help you?' }]);
    // We would ideally call an endpoint to clear memory on backend as well.
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-100">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Antigravity AI</h1>
            <p className="text-xs text-indigo-400 font-medium">Fullstack Assistant</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          title="Clear Chat"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className="flex-shrink-0 mr-4 p-2 bg-slate-800 rounded-lg border border-slate-700">
                  <Bot size={20} className="text-indigo-400" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : msg.isError 
                      ? 'bg-red-900/50 text-red-100 rounded-tl-sm border border-red-800/50' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 ml-4 p-2 bg-indigo-900/50 rounded-lg border border-indigo-500/30">
                  <UserIcon size={20} className="text-indigo-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start justify-start">
              <div className="flex-shrink-0 mr-4 p-2 bg-slate-800 rounded-lg border border-slate-700">
                <Bot size={20} className="text-indigo-400" />
              </div>
              <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm px-5 py-3 border border-slate-700 flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800">
        <form 
          onSubmit={handleSend}
          className="max-w-3xl mx-auto flex items-end space-x-3"
        >
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything... (Try 'calculate 5 + 5' or 'what is the time')"
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 min-h-[56px] shadow-sm transition-all"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 sm:p-4 transition-colors shadow-md shadow-indigo-500/20"
          >
            <Send size={24} className={loading || !input.trim() ? "opacity-50" : ""} />
          </button>
        </form>
        <div className="text-center mt-3 text-xs text-slate-500 font-medium">
          Powered by Antigravity AI
        </div>
      </footer>
    </div>
  );
}

export default App;
