import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiMinus, FiInfo } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm your BuyerPortal AI Assistant. How can I help you find your dream home today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // We pass the last 5 messages for context
      const history = messages.slice(-5);
      
      const response = await axiosClient.post('/ai/chat', { 
        message: userMessage,
        history: history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please make sure you are logged in and try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <FiMessageSquare className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiMinus />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form 
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all shadow-inner"
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                        input.trim() && !isLoading 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      <FiSend />
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <FiInfo className="text-[8px]" /> Powered by Gemini 1.5 Flash
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl flex items-center justify-center text-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-14 group-hover:translate-y-0 transition-transform duration-300" />
          <FiMessageSquare className="relative z-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </motion.button>
      )}
    </div>
  );
};

export default AIChatbot;
