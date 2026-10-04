import { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ChatAssistant() {
  const { chatMessages, sendChatMessage, clearChat } = useApp();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].role === 'user') {
      setTyping(true);
      const t = setTimeout(() => setTyping(false), 600);
      return () => clearTimeout(t);
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const suggestions = [
    'Which stocks have strong momentum?',
    'What does RSI mean?',
    'Show me my watchlist',
    "What caused today's market movement?",
  ];

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-lg transition-transform hover:scale-110 animate-glow-pulse"
          aria-label="Open AI Assistant"
        >
          <Brain className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-bull-500" />
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-brand-500/20 bg-white shadow-glow-lg dark:bg-ink-900 animate-slide-up">
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-ink-200 bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-white dark:border-ink-700">
            <div className="absolute inset-0 bg-gradient-animated opacity-20" />
            <div className="relative flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">StockSense AI Assistant</p>
                <p className="text-[10px] text-brand-200">Ask about stocks, indicators, or market trends</p>
              </div>
            </div>
            <div className="relative flex items-center gap-1">
              <button onClick={clearChat} className="rounded p-1 text-brand-200 transition-colors hover:bg-white/20 hover:text-white" aria-label="Clear chat">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-brand-200 transition-colors hover:bg-white/20 hover:text-white" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                    : 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <p className={`mt-1 text-[10px] ${msg.role === 'user' ? 'text-brand-200' : 'text-ink-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-1 rounded-xl bg-ink-100 px-4 py-3 dark:bg-ink-800">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {chatMessages.length <= 1 && (
            <div className="border-t border-ink-100 p-3 dark:border-ink-800">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-ink-400">Try asking:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendChatMessage(s)}
                    className="rounded-lg border border-ink-200 bg-ink-50 px-2.5 py-1.5 text-xs text-ink-600 transition-all hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-brand-950/20 dark:hover:text-brand-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-ink-200 p-3 dark:border-ink-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about stocks, indicators..."
                className="input flex-1"
              />
              <button onClick={handleSend} disabled={!input.trim()} className="btn-primary p-2">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
