import React, { useState, useEffect, useRef } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiChatSession, cleanMarkdownResponse } from '../lib/gemini';
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
      content: 'Assalamu alaikum! Saya Sharify, Konsultan AI Keuangan Syariah Anda. Seluruh jawaban saya dipandu KETAT oleh **Fatwa DSN-MUI (Dewan Syariah Nasional Majelis Ulama Indonesia)** & Fiqh Muamalah tanpa mengarang. Ada yang ingin Anda tanyakan seputar akad KPR, investasi saham, hukum paylater, zakat, atau detoks riba hari ini? 🛡️✨',
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
    setChatSession(getGeminiChatSession(settings.gemini_model || "gemini-3.5-flash", settings.gemini_api_key));

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
      const rawText = result.response.text();
      const responseText = cleanMarkdownResponse(rawText);

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
          content: "Maaf, saya mengalami gangguan jaringan saat merumuskan analisis syariah berlandaskan Fatwa DSN-MUI. Silakan coba kirim ulang pesan Anda.",
        },
      ]);
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
      <div className="flex flex-col h-[calc(100vh-6rem)] p-3 space-y-3">
        
        {/* Deep Emerald Header Card matching Screen 6 & 15 */}
        <div className="bg-[#064E3B] text-white p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between shrink-0">
          <div className="relative z-10 max-w-[75%] space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-200 mb-1">
              <span>🛡️ 100% Berlandaskan Fatwa DSN-MUI (Presisi & Anti-Ngarang)</span>
            </div>
            <h2 className="text-sm font-extrabold text-white leading-tight">
              AI Sharia Advisor — Konsultasi Keuangan Syariah
            </h2>
            <p className="text-[11px] text-emerald-100/90 font-medium">
              Jawaban terverifikasi dengan nomor fatwa DSN-MUI resmi &amp; kaidah Fiqh Muamalah
            </p>
          </div>
          
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
            <Bot className="w-6 h-6" />
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 bg-white dark:bg-slate-800/90 rounded-3xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div 
                  className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center border text-xs ${
                    message.role === 'model' 
                      ? 'bg-emerald-100/80 text-[#064E3B] border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  } ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}
                >
                  {message.role === 'model' ? <Bot size={14} /> : <UserIcon size={13} />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  message.role === 'user' 
                    ? 'bg-[#064E3B] text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
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

        {/* Suggested Questions Horizontal Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Pilihan:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(q);
              }}
              className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shrink-0 hover:border-emerald-500 transition-all shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white dark:bg-slate-800/90 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan akad, zakat, atau hukum keuangan syariah Anda..." 
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#064E3B] hover:bg-[#043E2F] text-white p-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </DashboardContainer>
  );
};
