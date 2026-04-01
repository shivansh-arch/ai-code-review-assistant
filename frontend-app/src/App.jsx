import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User as UserIcon, Bot, RefreshCw, Loader2, Sparkles, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your **Smart Mock AI Mentor**. Paste your code or ask a question, and let\'s solve it together!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let storedId = localStorage.getItem('chatbot_userId');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('chatbot_userId', storedId);
    }
    setUserId(storedId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = '56px'; // Reset to min-height
    }

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // In development, Vite proxys this to localhost:5000
      // In production, Vercel routes this to the serverless function
      const response = await axios.post('/api/chatbot/chat', {
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
    setMessages([{ role: 'bot', content: 'History cleared. How can I assist you?' }]);
  };

  return (
    <div className="flex flex-col h-screen font-sans text-slate-100 selection:bg-indigo-500/30">
      
      {/* Header - Glassmorphic */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/40 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/20 z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-40 animate-pulse"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg ring-1 ring-white/10">
              <Code2 size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Antigravity Mentor
            </h1>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">AI Active</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-700/50 backdrop-blur-sm"
          title="Clear Chat"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="flex-shrink-0 mr-4 mb-1 p-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-sm">
                    <Bot size={20} className="text-indigo-400" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-xl backdrop-blur-md ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm border border-indigo-500/30' 
                      : msg.isError 
                        ? 'bg-red-900/30 text-red-100 rounded-bl-sm border border-red-800/50' 
                        : 'bg-slate-800/60 text-slate-200 rounded-bl-sm border border-slate-700/50'
                  }`}
                >
                  <div className={`prose prose-invert max-w-none ${msg.role === 'bot' ? 'markdown-body' : ''}`}>
                    {msg.role === 'bot' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <div className="rounded-lg overflow-hidden my-4 border border-slate-700/50 shadow-lg">
                                <SyntaxHighlighter
                                  {...props}
                                  children={String(children).replace(/\n$/, '')}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, background: '#1e1e1e', padding: '1rem' }}
                                />
                              </div>
                            ) : (
                              <code {...props} className={className}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap m-0 leading-relaxed text-[15px]">{msg.content}</p>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="flex-shrink-0 ml-4 mb-1 p-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-sm">
                    <UserIcon size={20} className="text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-start"
              >
                <div className="flex-shrink-0 mr-4 p-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-sm">
                  <Bot size={20} className="text-indigo-400" />
                </div>
                <div className="bg-slate-800/60 backdrop-blur-md text-slate-200 rounded-2xl rounded-bl-sm px-6 py-4 border border-slate-700/50 shadow-xl flex items-center space-x-3">
                  <Sparkles size={18} className="animate-pulse text-indigo-400" />
                  <span className="text-[15px] font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 animate-pulse">
                    Analyzing code...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area - Glassmorphic */}
      <footer className="p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xl border-t border-slate-800/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] z-10">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex items-end space-x-3 sm:space-x-4"
        >
          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Paste your code or ask a question... (Shift+Enter for new line)"
              className="relative w-full bg-slate-900/80 text-slate-100 border border-slate-700/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none min-h-[56px] shadow-inner transition-all leading-relaxed text-[15px] placeholder:text-slate-500"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="relative group flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl p-4 transition-all shadow-lg ring-1 ring-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-transparent transition-all"></div>
            <Send size={22} className={`relative z-10 ${loading || !input.trim() ? "opacity-50" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"}`} />
          </button>
        </form>
        <div className="text-center mt-4 text-[11px] text-slate-500 font-medium tracking-wide uppercase">
          Powered by Antigravity AI
        </div>
      </footer>
    </div>
  );
}

export default App;
