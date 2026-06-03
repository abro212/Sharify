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
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [settings.chat_avatar_url]);
  
  // Free Tier Message Gating States
  const [messageCount, setMessageCount] = useState<number>(0);
  const maxFreeMessages = 5;
  const userRole = profile?.role?.toLowerCase() || 'free';
  const isFreeUser = userRole === 'free';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session
    setChatSession(getGeminiChatSession("gemini-2.5-flash", settings.gemini_api_key));

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
      <div className="glass-hud-dark rounded-2xl border border-emerald-500/30 h-[calc(100vh-8.5rem)] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Telemetry border corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/30 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/30 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/30 pointer-events-none"></div>

        {/* Header */}
        <div className="p-4 border-b border-emerald-500/25 flex items-center justify-between bg-gradient-to-r from-[#03130d] to-[#010604] relative overflow-hidden shrink-0 select-none">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-xl bg-emerald-950 flex items-center justify-center border border-emerald-500/30 mr-3 shadow-neon-emerald">
              <MessageSquare className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-emerald-50 uppercase tracking-widest flex items-center font-bold">
                Sharify AI Co-Pilot
                <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </h2>
              <p className="text-[10px] text-emerald-400/60 font-mono tracking-wider">FIQH_MUAMALAH_CORE_SYSTEM</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isFreeUser ? (
              <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                messageCount >= maxFreeMessages 
                  ? 'bg-rose-950/80 border-rose-500/30 text-rose-400' 
                  : 'bg-emerald-950 border-emerald-500/20 text-emerald-400/80'
              }`}>
                {messageCount >= maxFreeMessages 
                  ? 'FREE_LIMIT_EXCEEDED' 
                  : `MESSAGES: ${messageCount}/${maxFreeMessages}`
                }
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-950/50 text-amber-400 border border-amber-500/20 text-[9px] font-mono font-extrabold shadow-neon-gold">
                <Crown className="w-3 h-3 mr-1.5 text-amber-400 animate-pulse" />
                {userRole.toUpperCase()}_PLAN
              </span>
            )}
            
            {/* Reset count helper visible under Free mode for quick testing */}
            {isFreeUser && messageCount > 0 && (
              <button 
                onClick={handleResetCountMock}
                title="Reset Counter (Dev)"
                className="text-[9px] bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/20 px-2 py-1 rounded font-mono text-amber-400 font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto bg-emerald-950/15 space-y-5 select-text font-sans text-emerald-200">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div 
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${
                    message.role === 'model' 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' 
                      : 'bg-emerald-900/30 text-emerald-300 border-emerald-500/10'
                  } ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}
                  style={{ minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}
                >
                  {message.role === 'model' ? (
                    settings.chat_avatar_url && !avatarError ? (
                      <img 
                        src={settings.chat_avatar_url} 
                        alt="Bot Avatar" 
                        className="w-full h-full object-cover rounded-full" 
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <Bot size={16} />
                    )
                  ) : (
                    <UserIcon size={15} />
                  )}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl shadow-xs border ${
                  message.role === 'user' 
                    ? 'bg-[#064E3B] border-[#043E2F] text-white rounded-tr-none shadow-sm' 
                    : 'bg-white border-emerald-500/20 text-emerald-950 rounded-tl-none'
                }`}>
                  <div className={`prose prose-sm max-w-none break-words ${message.role === 'user' ? 'prose-invert text-white' : 'text-emerald-950 font-medium'}`}>
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
                <div 
                  className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-emerald-950 text-emerald-400 border border-emerald-500/20 mr-3"
                  style={{ minWidth: '32px', maxWidth: '32px', minHeight: '32px', maxHeight: '32px' }}
                >
                  {settings.chat_avatar_url && !avatarError ? (
                    <img 
                      src={settings.chat_avatar_url} 
                      alt="Bot Avatar" 
                      className="w-full h-full object-cover rounded-full" 
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div className="px-4 py-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/20 rounded-tl-none flex items-center space-x-2 shadow-xs">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Panel */}
        <div className="p-4 border-t border-emerald-500/25 bg-emerald-950/45 select-text shrink-0">
          {isFreeUser && messageCount >= maxFreeMessages ? (
            
            /* Gated locking panel */
            <div className="space-y-3 max-w-xl mx-auto py-1.5">
              <div className="bg-rose-950/80 border border-rose-500/30 p-3 rounded-xl flex items-start space-x-2 text-rose-300">
                <Lock className="w-4 h-4 text-rose-400 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-wider">Konsultasi AI Terkunci</h4>
                  <p className="text-[9px] mt-0.5 leading-relaxed text-rose-300/80 font-sans">Anda telah menggunakan batas **5 pesan gratis** di chatbot ini. Upgrade ke Plus untuk konsultasi hukum muamalah tanpa batas.</p>
                </div>
              </div>

              <Link
                to="/upgrade"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-neon-gold flex items-center justify-center space-x-1 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Crown className="w-4 h-4 text-emerald-950 mr-1.5" />
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
                className="flex-1 px-4 py-3 border border-emerald-500/30 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-[#E6F4ED]/50 text-emerald-950 focus:bg-white transition-all select-text font-sans"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-neon-emerald duration-300 shrink-0 font-sans"
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
