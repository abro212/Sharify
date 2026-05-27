import React, { useState, useEffect, useRef } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Bot, User as UserIcon, Crown, Lock, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiChatSession } from '../lib/gemini';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export const Chat: React.FC = () => {
  const { profile } = useAuthStore();
  const { settings } = useSettingsStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Assalamu alaikum! Saya Sharify, Asisten Finansial Syariah AI Anda. Ada yang bisa saya bantu untuk menganalisis kesucian aset, merencanakan zakat, melunasi riba, atau memeriksa draf akad Anda hari ini?',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  // Free Tier Message Gating States
  const [messageCount, setMessageCount] = useState<number>(0);
  const maxFreeMessages = 5;
  const userRole = profile?.role?.toLowerCase() || 'free';
  const isFreeUser = userRole === 'free';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session
    setChatSession(getGeminiChatSession());

    // Load message count from localStorage to persist across refreshes
    const storedCount = localStorage.getItem('sharify_free_chat_count');
    if (storedCount) {
      setMessageCount(parseInt(storedCount, 10));
    } else {
      localStorage.setItem('sharify_free_chat_count', '0');
      setMessageCount(0);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSession || isLoading) return;

    // Strict Gating check
    if (isFreeUser && messageCount >= maxFreeMessages) {
      return; // Do not send if limit exceeded
    }

    const userMessageContent = inputValue.trim();
    setInputValue('');
    
    // Add user message to UI
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Increment message count for free users
    if (isFreeUser) {
      const nextCount = messageCount + 1;
      setMessageCount(nextCount);
      localStorage.setItem('sharify_free_chat_count', nextCount.toString());
    }

    try {
      // Send message to Gemini
      const result = await chatSession.sendMessage(userMessageContent);
      const responseText = result.response.text();

      // Add model response to UI
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: responseText,
        },
      ]);
    } catch (error: any) {
      console.error("Error communicating with Gemini:", error);
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: "Maaf, saya mengalami gangguan jaringan saat merumuskan analisis syariah. Silakan coba kirim ulang pesan Anda.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCountMock = () => {
    localStorage.setItem('sharify_free_chat_count', '0');
    setMessageCount(0);
  };

  return (
    <DashboardContainer>
      <div className="glass-card rounded-2xl border border-slate-200/50 h-[calc(100vh-8.5rem)] flex flex-col overflow-hidden shadow-md">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0F4C3A] to-emerald-600 flex items-center justify-center text-white mr-3 shadow-xs">
              <MessageSquare className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center">
                Sharify AI Co-Pilot
                <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold">Penasihat Keuangan Syariah Virtual (Fiqh Muamalah)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isFreeUser ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                messageCount >= maxFreeMessages 
                  ? 'bg-rose-50 border border-rose-100 text-rose-600' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {messageCount >= maxFreeMessages 
                  ? 'Batas Kuota Gratis Tercapai' 
                  : `Kuota: ${messageCount}/${maxFreeMessages} Pesan`
                }
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-extrabold shadow-sm">
                <Crown className="w-3 h-3 mr-1 text-[#D4AF37]" />
                {userRole.toUpperCase()} PLAN
              </span>
            )}
            
            {/* Reset count helper visible under Free mode for quick testing */}
            {isFreeUser && messageCount > 0 && (
              <button 
                onClick={handleResetCountMock}
                title="Reset Counter (Dev)"
                className="text-[9px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded font-mono text-slate-600 font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/20 space-y-5 select-text">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${
                  message.role === 'model' 
                    ? 'bg-emerald-50 text-[#0F4C3A] border-emerald-100' 
                    : 'bg-white text-slate-500 border-slate-200'
                } ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                  {message.role === 'model' ? (
                    settings.chat_avatar_url ? (
                      <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Bot size={16} />
                    )
                  ) : (
                    <UserIcon size={15} />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-2xl shadow-xs border ${
                  message.role === 'user' 
                    ? 'bg-[#0F4C3A] border-[#0A3327] text-white rounded-tr-none' 
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <div className={`prose prose-sm max-w-none break-words ${message.role === 'user' ? 'prose-invert text-white' : ''}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-emerald-50 text-[#0F4C3A] border border-emerald-100 mr-3">
                  {settings.chat_avatar_url ? (
                    <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div className="px-4 py-3.5 rounded-2xl bg-white border border-slate-150 rounded-tl-none flex items-center space-x-2 shadow-xs">
                  <div className="w-2 h-2 bg-[#0F4C3A] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#0F4C3A] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#0F4C3A] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Panel */}
        <div className="p-4 border-t border-slate-100 bg-white shadow-inner select-text">
          {isFreeUser && messageCount >= maxFreeMessages ? (
            
            /* Gated locking panel */
            <div className="space-y-3 max-w-xl mx-auto py-1.5">
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start space-x-2 text-rose-800">
                <Lock className="w-4 h-4 text-rose-600 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider">Konsultasi AI Terkunci</h4>
                  <p className="text-[9px] mt-0.5 leading-relaxed text-rose-700/90 font-medium">Anda telah menggunakan batas **5 pesan gratis** di chatbot ini. Upgrade ke Plus untuk konsultasi hukum muamalah tanpa batas.</p>
                </div>
              </div>

              <Link
                to="/upgrade"
                className="w-full bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-white font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-md flex items-center justify-center space-x-1 transition-all active:scale-[0.98]"
              >
                <Crown className="w-4 h-4 text-white mr-1" />
                <span>Upgrade ke Plus / Pro Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          ) : (

            /* Text typing box */
            <form onSubmit={handleSendMessage} className="flex space-x-2 max-w-4xl mx-auto">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan keraguan Fiqh Muamalah Anda (investasi halal, riba, nisab zakat)..." 
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#0F4C3A] bg-slate-50/50 focus:bg-white transition-all select-text"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#0F4C3A] hover:bg-emerald-950 text-white px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
              >
                <Send size={14} className="mr-1.5" />
                Kirim
              </button>
            </form>

          )}
        </div>
      </div>
    </DashboardContainer>
  );
};
