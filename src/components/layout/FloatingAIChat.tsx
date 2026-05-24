import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, X, Send, Bot, User as UserIcon, 
  Crown, Lock, ChevronRight, MessageCircle, MessageSquare, HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiChatSession } from '../../lib/gemini';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export const FloatingAIChat: React.FC = () => {
  const { profile } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Assalamu alaikum! Saya Sharify, Asisten Finansial Syariah AI Anda. Ada yang bisa saya bantu untuk mengelola aset, zakat, atau detoks riba Anda hari ini?',
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

  // Initialize Gemini Chat Session and load free message limit counter
  useEffect(() => {
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

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
    // Hidden developer shortcut to reset messages limit for testing
    localStorage.setItem('sharify_free_chat_count', '0');
    setMessageCount(0);
  };

  // Helper to render configured Lucide icon for AI Widget FAB
  const renderWidgetIcon = () => {
    const iconName = settings.ai_widget_icon?.toLowerCase() || 'sparkles';
    switch (iconName) {
      case 'messagecircle':
        return <MessageCircle className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />;
      case 'messagesquare':
        return <MessageSquare className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />;
      case 'helpcircle':
        return <HelpCircle className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 font-sans">
      
      {/* 1. Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Tanya Asisten AI Syariah"
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#0F4C3A] via-[#10B981] to-[#D4AF37] text-white flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 group relative overflow-hidden animate-pulse hover:animate-none shadow-[#10B981]/30 border border-emerald-400/25"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {renderWidgetIcon()}
          
          {/* Notification Dot */}
          {isFreeUser && messageCount < maxFreeMessages && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black">
              !
            </span>
          )}
        </button>
      )}

      {/* 2. Sleek Overlay Chat Window (approx. 360px wide, 520px tall) */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[380px] h-[520px] rounded-2xl shadow-2xl border border-gray-150 overflow-hidden flex flex-col animate-zoom-in relative">
          
          {/* Header */}
          <div className="p-4 bg-[#0F4C3A] text-white flex justify-between items-center shadow-md relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center space-x-2.5 relative z-10">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                {settings.chat_avatar_url ? (
                  <img src={settings.chat_avatar_url} alt="Bot" className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-tight flex items-center">
                  Sharify AI Co-Pilot
                  <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <span className="text-[9px] text-emerald-200/80 block leading-none mt-0.5">Asisten Keuangan Syariah</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 relative z-10">
              {/* Reset count helper visible under Free mode for quick testing */}
              {isFreeUser && messageCount > 0 && (
                <button 
                  onClick={handleResetCountMock}
                  title="Reset Counter (Dev)"
                  className="text-[8px] bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded font-mono text-amber-300"
                >
                  Reset
                </button>
              )}
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing Tier Status Indicator */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between text-[10px]">
            {isFreeUser ? (
              <span className={`font-semibold ${messageCount >= maxFreeMessages ? 'text-rose-600 font-extrabold' : 'text-gray-500'}`}>
                {messageCount >= maxFreeMessages 
                  ? 'Batas Kuota Gratis Tercapai (5/5)' 
                  : `Kuota Chat: ${messageCount}/${maxFreeMessages} Pesan Terpakai`
                }
              </span>
            ) : (
              <span className="text-emerald-700 font-extrabold flex items-center">
                <Crown className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                Premium Advisor ({userRole.toUpperCase()})
              </span>
            )}
            <span className="text-gray-400 text-[8px] font-mono uppercase tracking-wider">Sesi Terenkripsi</span>
          </div>

          {/* Chat Messages Panel */}
          <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Mini Avatar */}
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center overflow-hidden ${
                    msg.role === 'model' ? 'bg-emerald-100 text-[#0F4C3A]' : 'bg-gray-100 text-gray-600'
                  } ${msg.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                    {msg.role === 'model' ? (
                      settings.chat_avatar_url ? (
                        <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Bot size={13} />
                      )
                    ) : (
                      <UserIcon size={13} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-3 py-2.5 rounded-xl text-[11px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#0F4C3A] text-white rounded-tr-none shadow-sm' 
                      : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <div className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
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
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center overflow-hidden bg-emerald-100 text-[#0F4C3A] mr-2">
                    {settings.chat_avatar_url ? (
                      <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Bot size={13} />
                    )}
                  </div>
                  <div className="px-3 py-3 rounded-xl bg-gray-50 border border-gray-100 rounded-tl-none flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-[#0F4C3A] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#0F4C3A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#0F4C3A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gated Input Form Panel */}
          <div className="p-3.5 border-t border-gray-100 bg-white shadow-inner">
            {isFreeUser && messageCount >= maxFreeMessages ? (
              
              /* Block Panel for Free Users at Limit */
              <div className="space-y-3 py-1">
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start space-x-2 text-rose-800">
                  <Lock className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider">Analisis Syariah AI Terkunci</h4>
                    <p className="text-[9px] mt-0.5 leading-relaxed">Anda telah menggunakan seluruh **5 pesan konsultasi gratis**. Hubungi asisten finansial tanpa batas dengan Sharify Plus.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/upgrade');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-white font-extrabold py-2 px-3 rounded-xl text-[10px] shadow-md flex items-center justify-center space-x-1 transition-all"
                >
                  <Crown className="w-3.5 h-3.5 text-white mr-1" />
                  <span>Upgrade ke Plus / Pro Sekarang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            ) : (

              /* Standard Form Input */
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik konsultasi muamalah Anda..." 
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-3.5 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={12} />
                </button>
              </form>

            )}
          </div>

        </div>
      )}

    </div>
  );
};
