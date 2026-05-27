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

  // ── Touch & Mouse Pointer Dragging Logic ─────────────────────────
  const [position, setPosition] = useState({ x: 0, y: -60 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const totalDragDistance = useRef(0);

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

  const handleResetCountMock = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Hidden developer shortcut to reset messages limit for testing
    localStorage.setItem('sharify_free_chat_count', '0');
    setMessageCount(0);
  };

  // Helper to render configured Lucide icon for AI Widget FAB
  const renderWidgetIcon = () => {
    const iconName = settings.ai_widget_icon?.toLowerCase() || 'sparkles';
    switch (iconName) {
      case 'messagecircle':
        return <MessageCircle className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />;
      case 'messagesquare':
        return <MessageSquare className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />;
      case 'helpcircle':
        return <HelpCircle className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />;
    }
  };

  // ── Dragging Handler Functions ───────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<any>) => {
    if (e.button !== 0) return;
    
    isDragging.current = true;
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    totalDragDistance.current = 0;
    
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
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

    setPosition({ x: cappedX, y: cappedY });
    e.stopPropagation();
  };

  const handlePointerUp = (e: React.PointerEvent<any>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
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
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[9990] font-sans transition-all duration-300 select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none'
      }}
    >
      
      {/* 1. Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleFabClick}
          title="Geser & Klik Asisten AI Syariah"
          className="h-14 w-14 rounded-full bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-400 flex items-center justify-center shadow-neon-emerald transition-all hover:scale-105 active:scale-95 group relative border border-emerald-400/50 cursor-grab active:cursor-grabbing hover:shadow-emerald-400/30 active:animate-none duration-300 animate-pulse"
        >
          <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
          
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex space-x-0.5 opacity-60">
            <span className="w-0.5 h-0.5 rounded-full bg-amber-400"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-amber-400"></span>
            <span className="w-0.5 h-0.5 rounded-full bg-amber-400"></span>
          </div>

          {renderWidgetIcon()}
          
          {isFreeUser && messageCount < maxFreeMessages && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-emerald-950 flex items-center justify-center text-[7px] font-black text-white">
              !
            </span>
          )}
        </button>
      )}

      {/* 2. Cybernetic Draggable Chat Window */}
      {isOpen && (
        <div className="glass-hud-dark w-[340px] sm:w-[370px] h-[510px] rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden flex flex-col animate-zoom-in relative">
          
          {/* Drag Header handle */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="p-3.5 bg-gradient-to-r from-[#03130d] to-[#010604] border-b border-emerald-500/25 text-emerald-100 flex justify-between items-center relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-2 relative z-10">
              <div className="text-emerald-400 opacity-60 shrink-0">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="h-7 w-7 rounded-full bg-emerald-950/80 flex items-center justify-center border border-emerald-500/30 overflow-hidden shrink-0">
                {settings.chat_avatar_url ? (
                  <img src={settings.chat_avatar_url} alt="Bot" className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-[11px] tracking-tight flex items-center text-emerald-50 font-bold">
                  Sharify AI Co-Pilot
                  <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <span className="text-[8px] text-emerald-400/70 block mt-0.5 font-mono">FIQH_MUAMALAH_SYSTEM</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 relative z-10">
              {isFreeUser && messageCount > 0 && (
                <button 
                  onClick={handleResetCountMock}
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Reset Sesi (Dev)"
                  className="text-[7px] bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono text-amber-400 font-bold shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
              
              <button 
                onClick={() => setIsOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                title="Tutup Chat"
                className="text-emerald-400 hover:text-emerald-200 bg-emerald-900/30 hover:bg-emerald-900/50 p-1.5 rounded-lg border border-emerald-500/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subscription pricing indicator row */}
          <div className="px-4 py-1.5 border-b border-emerald-500/10 bg-emerald-950/40 flex items-center justify-between text-[9px] font-mono">
            {isFreeUser ? (
              <span className={`font-bold ${messageCount >= maxFreeMessages ? 'text-rose-400 font-black' : 'text-emerald-400/80'}`}>
                {messageCount >= maxFreeMessages 
                  ? 'FREE_LIMIT_REACHED (5/5)' 
                  : `FREE_TIER_QUOTA: ${messageCount}/${maxFreeMessages} MESSAGES`
                }
              </span>
            ) : (
              <span className="text-amber-400 font-extrabold flex items-center">
                <Crown className="w-3 h-3 mr-1 text-amber-400 animate-pulse" />
                PREMIUM_ADVISOR ({userRole.toUpperCase()})
              </span>
            )}
            <span className="text-emerald-400/40 text-[8px] tracking-wider">SSL_SECURED</span>
          </div>

          {/* Chat content stream */}
          <div className="flex-1 p-3.5 overflow-y-auto bg-emerald-950/15 space-y-3.5 select-text font-sans text-emerald-200">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar bubble */}
                  <div className={`flex-shrink-0 h-6.5 w-6.5 rounded-full flex items-center justify-center overflow-hidden border ${
                    msg.role === 'model' 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20' 
                      : 'bg-emerald-900/30 text-emerald-300 border-emerald-500/10'
                  } ${msg.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                    {msg.role === 'model' ? (
                      settings.chat_avatar_url ? (
                        <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Bot size={13} />
                      )
                    ) : (
                      <UserIcon size={12} />
                    )}
                  </div>

                  {/* Bubble text content */}
                  <div className={`px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-xs border ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-50 rounded-tr-none shadow-[0_0_10px_rgba(52,211,153,0.05)]' 
                      : 'bg-emerald-950/75 border-emerald-500/15 text-emerald-200 rounded-tl-none'
                  }`}>
                    <div className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'prose-invert text-emerald-50 font-bold' : 'text-emerald-200'}`}>
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
                  <div className="flex-shrink-0 h-6.5 w-6.5 rounded-full flex items-center justify-center overflow-hidden bg-emerald-950 text-emerald-400 border border-emerald-500/20 mr-2">
                    {settings.chat_avatar_url ? (
                      <img src={settings.chat_avatar_url} alt="Bot Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Bot size={13} />
                    )}
                  </div>
                  <div className="px-3 py-2.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/20 rounded-tl-none flex items-center space-x-1.5 shadow-xs">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form container input */}
          <div className="p-3 border-t border-emerald-500/25 bg-emerald-950/45 select-text">
            {isFreeUser && messageCount >= maxFreeMessages ? (
              
              /* Lock overlay at limit count */
              <div className="space-y-2.5 py-1">
                <div className="bg-rose-950/80 border border-rose-500/30 p-2.5 rounded-xl flex items-start space-x-2 text-rose-300">
                  <Lock className="w-4 h-4 text-rose-400 mt-0.5 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-wider">Konsultasi AI Terkunci</h4>
                    <p className="text-[9px] mt-0.5 leading-relaxed text-rose-300/80 font-sans">Anda telah menggunakan batas **5 pesan gratis**. Konsultasi hukum muamalah premium tanpa batas dengan Sharify Plus.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/upgrade');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold py-2 px-3 rounded-xl text-[10px] shadow-neon-gold flex items-center justify-center space-x-1 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-emerald-950 mr-1" />
                  <span>Upgrade ke Plus / Pro Sekarang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            ) : (

              /* Dynamic input typing */
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanyakan akad, zakat, atau investasi halal..." 
                  className="flex-1 px-3 py-2 border border-emerald-500/30 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-emerald-950/90 text-emerald-100 focus:bg-[#020907] transition-all select-text font-sans"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:bg-emerald-500 cursor-pointer shadow-neon-emerald duration-300 shrink-0"
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
