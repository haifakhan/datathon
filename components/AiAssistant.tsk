import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your ZeroHunger assistant. Ask me about food insecurity trends, how to donate, or where to find nearby shelters.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await getChatResponse(userMsg.text);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response };
    
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Assistant</h2>
          <p className="text-xs text-slate-500">Powered by Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-emerald-100'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-emerald-600" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          className="w-full p-4 pr-12 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm text-slate-900 placeholder-slate-400"
          placeholder="Ask about food banks or logistics..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;