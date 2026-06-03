import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, X, Send, Bot, User as UserIcon, 
  Crown, Lock, ChevronRight, MessageCircle, MessageSquare, HelpCircle, GripVertical
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
      content: 'Assalamu alaikum! ✨ Saya Sharify, AI Co-Pilot Finansial Syariah Anda. Ada yang bisa saya bantu untuk menghitung zakat, merancang tujuan finansial, waris faraidh, atau detoks riba agar keuangan Anda semakin berkah hari ini? 🍃',
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

  // ── Touch & Mouse Pointer Dragging Logic ─────────────────────────
  const positionRef = useRef({ x: 0, y: -60 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const totalDragDistance = useRef(0);

  // Initialize Gemini Chat Session and load free message limit counter
  useEffect(() => {
    setChatSession(getGeminiChatSession("gemini-1.5-flash", settings.gemini_api_key));

    // Load message count from localStorage to persist across refreshes
    const storedCount = localStorage.getItem('sharify_free_chat_count');
    if (storedCount) {
      setMessageCount(parseInt(storedCount, 10));
    } else {
      localStorage.setItem('sharify_free_chat_count', '0');
      setMessageCount(0);
    }
  }, [settings.gemini_api_key]);

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
      return;
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
      const result = await chatSession.sendMessage(userMessageContent);
      const responseText = result.response.text();

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

  const handleResetCountMock = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('sharify_free_chat_count', '0');
    setMessageCount(0);
  };

  // Helper to render configured Lucide icon for AI Widget FAB
  const renderWidgetIcon = () => {
    const iconName = settings.ai_widget_icon?.toLowerCase() || 'sparkles';
    switch (iconName) {
      case 'messagecircle':
        return <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />;
      case 'messagesquare':
        return <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />;
      case 'helpcircle':
        return <HelpCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />;
    }
  };

  // ── Dragging Handler Functions ───────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<any>) => {
    if (e.button !== 0) return;
    
    isDragging.current = true;
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    totalDragDistance.current = 0;
    
    dragStart.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y
    };
    
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent<any>) => {
    if (!isDragging.current) return;
    
    const moveX = e.clientX - dragStart.current.x;
    const moveY = e.clientY - dragStart.current.y;
    
    const dist = Math.hypot(e.clientX - dragStartCoords.current.x, e.clientY - dragStartCoords.current.y);
    totalDragDistance.current = dist;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const dragWidth = isOpen ? 360 : 56;
    const dragHeight = isOpen ? 520 : 56;

    const maxLeftDrag = -viewportWidth + dragWidth + 24;
    const maxRightDrag = 16;
    const maxUpDrag = -viewportHeight + dragHeight + 24;
    const maxDownDrag = 16;

    const cappedX = Math.min(maxRightDrag, Math.max(maxLeftDrag, moveX));
    const cappedY = Math.min(maxDownDrag, Math.max(maxUpDrag, moveY));

    positionRef.current = { x: cappedX, y: cappedY };
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${cappedX}px, ${cappedY}px)`;
    }
    e.stopPropagation();
  };

  const handleFabClick = (e: React.MouseEvent) => {
    if (totalDragDistance.current > 6) {
      e.preventDefault();
      return;
    }
    setIsOpen(true);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[9990] font-sans select-none"
      style={{
        transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
        touchAction: 'none'
      }}
    >
      
      {/* 1. Floating Action Button (FAB) - Solid Green Clean Pill style */}
      {!isOpen && (
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => {
            isDragging.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
            e.stopPropagation();
          }}
          onClick={handleFabClick}
          title="Geser & Klik Asisten AI Syariah"
          className="h-14 w-14 rounded-full bg-[#10B981] hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 group relative border border-white/20 cursor-grab active:cursor-grabbing hover:shadow-emerald-500/30 active:animate-none duration-300"
        >
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex space-x-0.5 opacity-60">
            <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-white"></span>
          </div>

          {renderWidgetIcon()}
          
          {isFreeUser && messageCount < maxFreeMessages && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white">
              !
            </span>
          )}
        </button>
      )}

      {/* 2. Pristine Minimalist Chat Window (Matches reference layout) */}
      {isOpen && (
        <div className="w-[340px] sm:w-[370px] h-[510px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-zoom-in relative">
          
          {/* Solid Green Clean Header */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => {
              isDragging.current = false;
              e.currentTarget.releasePointerCapture(e.pointerId);
              e.stopPropagation();
            }}
            className="p-4 bg-[#10B981] text-white flex justify-between items-center relative cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="text-white/50 shrink-0">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center border border-white/25 overflow-hidden shrink-0">
                {settings.chat_avatar_url && !avatarError ? (
                  <img 
                    src={settings.chat_avatar_url} 
                    alt="Bot" 
                    className="w-full h-full object-cover" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-[12px] tracking-tight flex items-center text-white leading-none">
                  Sharify AI Co-Pilot
                  <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                </h3>
                <span className="text-[8px] text-emerald-100 block mt-1 font-bold uppercase tracking-wider">Sharia Advisor</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 relative z-10">
              {isFreeUser && messageCount > 0 && (
                <button 
                  onClick={handleResetCountMock}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Reset Sesi (Dev)"
                  className="text-[8px] bg-white/20 hover:bg-white/30 border border-white/10 px-2 py-0.5 rounded-full font-bold text-white shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
              
              <button 
                onClick={() => setIsOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                title="Tutup Chat"
                className="text-white hover:text-slate-100 bg-white/15 hover:bg-white/25 p-1.5 rounded-full border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Clean Slate Quota Row */}
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[9px] font-semibold text-slate-500">
            {isFreeUser ? (
              <span className={messageCount >= maxFreeMessages ? 'text-rose-500 font-extrabold' : 'text-slate-500'}>
                {messageCount >= maxFreeMessages 
                  ? 'KONSULTASI GRATIS HABIS (5/5)' 
                  : `KUOTA GRATIS: ${messageCount}/${maxFreeMessages} PESAN`
                }
              </span>
            ) : (
              <span className="text-[#10B981] font-extrabold flex items-center">
                <Crown className="w-3.5 h-3.5 mr-1 text-[#10B981]" />
                PREMIUM ADVISOR ({userRole.toUpperCase()})
              </span>
            )}
            <span className="text-slate-400 font-semibold tracking-wider">SECURE SHARIA CONNECT</span>
          </div>

          {/* Chat Bubble List Container - Fiqh advice stream */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4 select-text font-sans text-slate-700">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar wrapper */}
                  <div 
                    className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center overflow-hidden border ${
                      msg.role === 'model' 
                        ? 'bg-emerald-50 text-[#10B981] border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    } ${msg.role === 'user' ? 'ml-2' : 'mr-2'}`}
                    style={{ minWidth: '28px', maxWidth: '28px', minHeight: '28px', maxHeight: '28px' }}
                  >
                    {msg.role === 'model' ? (
                      settings.chat_avatar_url && !avatarError ? (
                        <img 
                          src={settings.chat_avatar_url} 
                          alt="Bot Avatar" 
                          className="w-full h-full object-cover" 
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <Bot size={14} />
                      )
                    ) : (
                      <UserIcon size={13} />
                    )}
                  </div>

                  {/* Clean Message bubbles */}
                  <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[#10B981] border-[#0ea572] text-white rounded-tr-none' 
                      : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'prose-invert text-white' : 'text-slate-800 font-medium'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Chat loading bubble */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <div 
                    className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center overflow-hidden bg-emerald-50 text-[#10B981] border border-emerald-100 mr-2"
                    style={{ minWidth: '28px', maxWidth: '28px', minHeight: '28px', maxHeight: '28px' }}
                  >
                    {settings.chat_avatar_url && !avatarError ? (
                      <img 
                        src={settings.chat_avatar_url} 
                        alt="Bot Avatar" 
                        className="w-full h-full object-cover" 
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-100 rounded-tl-none flex items-center space-x-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input - Spacious White Panel */}
          <div className="p-3.5 border-t border-slate-100 bg-white select-text">
            {isFreeUser && messageCount >= maxFreeMessages ? (
              
              /* Clean Lock Alert Overlay */
              <div className="space-y-3 py-1">
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-start space-x-2.5 text-rose-700">
                  <Lock className="w-4 h-4 text-rose-500 mt-0.5 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-950">Konsultasi AI Terkunci</h4>
                    <p className="text-[10px] mt-0.5 leading-relaxed text-rose-600 font-semibold">Yaaah, kuota chat gratis kamu udah abis nih... Kamu udah menghabiskan batas **5 pesan gratis**. Yuk, upgrade plan kamu biar bisa konsultasi sat-set tanpa batas!</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/upgrade');
                  }}
                  className="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold py-3 px-4 rounded-full text-xs shadow-md shadow-emerald-500/10 flex items-center justify-center space-x-1 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-white mr-1.5" />
                  <span>Upgrade ke Plus / Pro Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            ) : (

              /* Clean Text Input Form */
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanyakan akad, zakat, atau investasi halal..." 
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10B981] bg-slate-50 text-slate-800 focus:bg-white transition-all select-text font-sans font-semibold"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#10B981] hover:bg-emerald-600 text-white p-2.5 rounded-full transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:bg-[#10B981] cursor-pointer shadow-md shadow-emerald-500/10 shrink-0"
                >
                  <Send size={13} />
                </button>
              </form>

            )}
          </div>

        </div>
      )}

    </div>
  );
};
