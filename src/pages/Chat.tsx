import React, { useState, useEffect, useRef } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Send, Bot, User as UserIcon, Plus, Trash2, MessageSquare, 
  Clock, History, X, ShieldCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiChatSession, cleanMarkdownResponse } from '../lib/gemini';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

export type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export interface ChatSessionData {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: 'welcome-1',
  role: 'model',
  content: 'Assalamu alaikum! ✨ Saya Sharify, teman ngobrol & penasihat keuangan syariah kamu. Jawaban saya santai, langsung *to-the-point*, dan pastinya 100% berlandaskan **Fatwa DSN-MUI**. Ada yang mau kamu tanyakan soal zakat, investasi halal, paylater, atau KPR hari ini? 😊🍃',
};

const STORAGE_KEY_SESSIONS = 'sharify_chat_sessions_v2';
const STORAGE_KEY_ACTIVE_ID = 'sharify_active_session_id';

export const Chat: React.FC = () => {
  const { profile } = useAuthStore();
  const { settings } = useSettingsStore();

  // Sessions state
  const [sessions, setSessions] = useState<ChatSessionData[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  
  // Default sidebar open on desktop (>=640px), closed on mobile (<640px)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 640 : false;
  });

  // Active Chat states
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  // Free Tier Message Gating States
  const [messageCount, setMessageCount] = useState<number>(0);
  const maxFreeMessages = 5;
  const userRole = profile?.role?.toLowerCase() || 'free';
  const isFreeUser = userRole === 'free';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Load Sessions from localStorage or create default initial session
  useEffect(() => {
    const storedSessionsRaw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    let loadedSessions: ChatSessionData[] = [];

    if (storedSessionsRaw) {
      try {
        loadedSessions = JSON.parse(storedSessionsRaw);
      } catch (err) {
        console.error("Failed to parse chat sessions from localStorage:", err);
      }
    }

    if (loadedSessions.length === 0) {
      const newInitialSession: ChatSessionData = {
        id: Date.now().toString(),
        title: 'Konsultasi Syariah Baru',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [DEFAULT_WELCOME_MESSAGE],
      };
      loadedSessions = [newInitialSession];
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(loadedSessions));
    }

    setSessions(loadedSessions);

    const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    const validActiveSession = loadedSessions.find(s => s.id === storedActiveId) || loadedSessions[0];

    setActiveSessionId(validActiveSession.id);
    setMessages(validActiveSession.messages);

    // Initialize Gemini Chat Session with past conversation history
    initGeminiSession(validActiveSession.messages);

    // Load message count
    const storedCount = localStorage.getItem('sharify_free_chat_count');
    if (storedCount) {
      setMessageCount(parseInt(storedCount, 10));
    } else {
      localStorage.setItem('sharify_free_chat_count', '0');
      setMessageCount(0);
    }
  }, [settings.gemini_api_key]);

  // Helper to initialize Gemini Chat session with history
  const initGeminiSession = (msgs: Message[]) => {
    const historyForGemini = msgs
      .filter((_, idx) => idx > 0) // Skip first static greeting
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

    const session = getGeminiChatSession(
      settings.gemini_model || "gemini-2.5-flash",
      settings.gemini_api_key,
      undefined,
      historyForGemini
    );
    setChatSession(session);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 2. Create New Consultation Session
  const handleCreateNewSession = () => {
    const newSession: ChatSessionData = {
      id: Date.now().toString(),
      title: 'Konsultasi Syariah Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [DEFAULT_WELCOME_MESSAGE],
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setActiveSessionId(newSession.id);
    setMessages(newSession.messages);

    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updatedSessions));
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, newSession.id);

    initGeminiSession(newSession.messages);

    // Auto close drawer on mobile after creating session
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  // 3. Switch Active Session
  const handleSelectSession = (session: ChatSessionData) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, session.id);
    initGeminiSession(session.messages);

    // Auto close drawer on mobile after selection
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  // 4. Delete Session
  const handleDeleteSession = (e: React.MouseEvent, sessionIdToDelete: string) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleCreateNewSession();
      return;
    }

    const updatedSessions = sessions.filter(s => s.id !== sessionIdToDelete);
    setSessions(updatedSessions);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updatedSessions));

    if (activeSessionId === sessionIdToDelete) {
      const nextSession = updatedSessions[0];
      setActiveSessionId(nextSession.id);
      setMessages(nextSession.messages);
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, nextSession.id);
      initGeminiSession(nextSession.messages);
    }
  };

  // 5. Send Message Handler with Auto Session Saving
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSession || isLoading) return;

    if (isFreeUser && messageCount >= maxFreeMessages) {
      return;
    }

    const userMessageContent = inputValue.trim();
    setInputValue('');

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
    };

    const updatedMessagesWithUser = [...messages, newUserMessage];
    setMessages(updatedMessagesWithUser);
    setIsLoading(true);

    if (isFreeUser) {
      const nextCount = messageCount + 1;
      setMessageCount(nextCount);
      localStorage.setItem('sharify_free_chat_count', nextCount.toString());
    }

    try {
      const result = await chatSession.sendMessage(userMessageContent);
      const rawText = result.response.text();
      const responseText = cleanMarkdownResponse(rawText);

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
      };

      const finalMessages = [...updatedMessagesWithUser, newModelMessage];
      setMessages(finalMessages);

      // Auto update title if still default
      setSessions((prevSessions) => {
        const nextSessions = prevSessions.map((s) => {
          if (s.id === activeSessionId) {
            const isDefaultTitle = s.title === 'Konsultasi Syariah Baru';
            const autoTitle = isDefaultTitle 
              ? userMessageContent.slice(0, 28) + (userMessageContent.length > 28 ? '...' : '') 
              : s.title;

            return {
              ...s,
              title: autoTitle,
              updatedAt: new Date().toISOString(),
              messages: finalMessages,
            };
          }
          return s;
        });

        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(nextSessions));
        return nextSessions;
      });

    } catch (error: any) {
      console.error("Error communicating with Gemini:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Maaf, terjadi masalah jaringan saat merumuskan analisis syariah. Silakan coba kirim ulang pesan Anda.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'Fatwa DSN-MUI Paylater & Pinjol?',
    'Hukum Asuransi Syariah (Fatwa No. 21)?',
    'Akad KPR Syariah MMQ vs Murabahah?',
    'Hukum Kripto menurut Keputusan MUI?',
    'Penapisan Saham Syariah (Fatwa No. 40 & 80)?',
    'Denda Keterlambatan Ta\'zir (Fatwa No. 17)?',
  ];

  return (
    <DashboardContainer>
      <div className="flex h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] p-2 sm:p-3 space-x-0 sm:space-x-3 overflow-hidden relative">
        
        {/* ── MOBILE BACKDROP OVERLAY ───────────────────────────────── */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 sm:hidden transition-opacity duration-300"
          />
        )}

        {/* ── 1. SESSION HISTORY SIDEBAR / MOBILE DRAWER ───────────── */}
        <div 
          className={`
            fixed sm:relative top-0 bottom-0 left-0 z-40 sm:z-20
            h-full w-[85%] sm:w-72 md:w-80 
            bg-white dark:bg-slate-800/95 rounded-r-3xl sm:rounded-3xl 
            border-r sm:border border-slate-200/80 dark:border-slate-700/60 
            shadow-2xl sm:shadow-[0_2px_16px_rgba(0,0,0,0.04)] 
            flex flex-col transition-transform duration-300 ease-in-out shrink-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0 sm:w-0 sm:hidden'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#064E3B] dark:text-emerald-400">
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="text-xs font-extrabold tracking-tight">Riwayat Sesi Konsultasi</h3>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Session Button */}
          <div className="p-3">
            <button
              onClick={handleCreateNewSession}
              className="w-full bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold py-2.5 px-4 rounded-2xl text-xs shadow-md shadow-emerald-950/10 flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>+ Sesi Konsultasi Baru</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-2 no-scrollbar">
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const formattedDate = new Date(s.updatedAt || s.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s)}
                  className={`group relative p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-[#064E3B] dark:text-emerald-300 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-[#064E3B] dark:text-emerald-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold truncate block">{s.title}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      title="Hapus Sesi Ini"
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-all shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 shrink-0" />
                      {formattedDate}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-bold">
                      {s.messages.length} pesan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/60 text-[10px] font-semibold text-slate-400 text-center rounded-br-3xl sm:rounded-b-3xl">
            🔒 Sesi disimpan aman di browser Anda
          </div>
        </div>

        {/* ── 2. MAIN CHAT CONTAINER ────────────────────────────────── */}
        <div className="flex-1 flex flex-col h-full space-y-2 sm:space-y-3 min-w-0">
          
          {/* Deep Emerald Header Card */}
          <div className="bg-[#064E3B] text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between shrink-0">
            
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 z-10 max-w-[85%] sm:max-w-[80%]">
              {/* Toggle Sidebar Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-xl sm:rounded-2xl border border-white/20 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
                title={isSidebarOpen ? "Sembunyikan Riwayat Sesi" : "Buka Riwayat Sesi"}
              >
                <History className="w-4 h-4 text-emerald-300" />
              </button>

              <div className="space-y-0.5 min-w-0">
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-[9px] sm:text-[10px] font-bold text-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">100% Fatwa DSN-MUI</span>
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                  AI Sharia Advisor — Konsultasi Syariah
                </h2>
              </div>
            </div>

            <div className="h-9 w-9 sm:h-12 sm:w-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
              <Bot className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700/60 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-y-auto space-y-3 sm:space-y-4 font-sans text-xs">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[94%] sm:max-w-[88%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div 
                    className={`flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center border text-xs ${
                      message.role === 'model' 
                        ? 'bg-emerald-100/80 text-[#064E3B] border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    } ${message.role === 'user' ? 'ml-1.5 sm:ml-2' : 'mr-1.5 sm:mr-2'}`}
                  >
                    {message.role === 'model' ? <Bot size={13} /> : <UserIcon size={12} />}
                  </div>
                  
                  <div className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-xs text-xs leading-relaxed ${
                    message.role === 'user' 
                      ? 'bg-[#064E3B] text-white rounded-tr-none font-medium' 
                      : 'bg-slate-50 dark:bg-slate-700/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-600/50'
                  }`}>
                    <div className="prose prose-sm max-w-none break-words dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none">
                  <div className="w-1.5 h-1.5 bg-[#064E3B] dark:bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#064E3B] dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#064E3B] dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Horizontal Pills (Mobile Touch Scrollable) */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar shrink-0 -mx-1 px-1 touch-pan-x">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Topik:</span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(q);
                }}
                className="text-[10px] sm:text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shrink-0 hover:border-emerald-500 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="bg-white dark:bg-slate-800/90 p-2 sm:p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan hukum zakat, paylater, atau KPR..." 
                className="flex-1 px-3 sm:px-3.5 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-[#064E3B] hover:bg-[#043E2F] text-white p-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm cursor-pointer active:scale-95 flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
