import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askRag, RagMessage } from '../services/ragService';

const STARTER_QUESTIONS = [
  'Who are my top 5 athletes by clutch factor?',
  'Which athletes are at risk of underperforming?',
  'How should I approach coaching a developing athlete?',
  'Show me the strongest recruit candidates.'
];

const RagChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const reset = () => {
    setMessages([]);
    setInput('');
    setLoading(false);
    inputRef.current?.focus();
  };

  const ask = async (text: string) => {
    if (!text || loading) return;
    setInput('');
    const newMessages: RagMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const answer = await askRag(text, messages);
      setMessages([...newMessages, { role: 'assistant', content: answer }]);
    } catch (err) {
      console.error('RAG error:', err);
      const friendly = "Sorry - I couldn't generate a response just now. Try rephrasing your question, or start a new chat if the issue persists.";
      setMessages([...newMessages, { role: 'assistant', content: friendly }]);
    } finally {
      setLoading(false);
    }
  };

  const send = () => ask(input.trim());

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-ink hover:opacity-90 text-white rounded-full shadow-lift flex items-center justify-center transition-opacity"
          title="Ask the NTangible Assistant"
        >
          <MessageCircle size={24} strokeWidth={1.8} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`fixed z-50 bg-white border border-line-strong shadow-lift flex flex-col overflow-hidden transition-all duration-200 ${
          fullscreen
            ? 'inset-4 rounded-card'
            : 'bottom-6 right-6 w-96 h-[520px] rounded-card'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-ink">
            <p className="text-white font-mono text-[11px] font-medium uppercase tracking-[0.16em]">NTangible Assistant</p>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="bg-white text-ink font-mono text-[10px] font-medium uppercase tracking-[0.14em] px-3 py-1.5 rounded-pill hover:bg-chip transition-colors"
                title="New chat"
              >
                New chat
              </button>
              <button
                onClick={() => setFullscreen(f => !f)}
                className="bg-white text-ink p-1.5 rounded-card hover:bg-chip transition-colors"
                title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? <Minimize2 size={14} strokeWidth={1.8} /> : <Maximize2 size={14} strokeWidth={1.8} />}
              </button>
              <button
                onClick={() => { setOpen(false); setFullscreen(false); }}
                className="bg-white text-ink p-1.5 rounded-card hover:bg-chip transition-colors"
                title="Close"
              >
                <X size={14} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.length === 0 && (
              <div className="text-body text-sm mt-2">
                <p className="text-center font-mono text-[11px] text-gray-brand uppercase tracking-[0.16em] mb-4">Try one of these</p>
                <div className="space-y-2">
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => ask(q)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 rounded-card bg-white hover:bg-chip border border-line-strong hover:border-ink text-body hover:text-ink text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-bubble px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'max-w-[80%] bg-ink text-white rounded-br-card'
                    : 'max-w-full bg-chip text-ink border border-line rounded-bl-card'
                }`}>
                  {m.role === 'user' ? m.content : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <p className="font-bold text-base mb-1">{children}</p>,
                        h2: ({children}) => <p className="font-bold text-sm mb-1">{children}</p>,
                        h3: ({children}) => <p className="font-semibold text-sm mb-1">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-ink">{children}</strong>,
                        ul: ({children}) => <ul className="list-disc pl-4 space-y-0.5 my-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 space-y-0.5 my-1">{children}</ol>,
                        li: ({children}) => <li className="text-ink">{children}</li>,
                        p: ({children}) => <p className="mb-1.5 last:mb-0">{children}</p>,
                        table: ({node}) => {
                          const extractText = (n: any): string => {
                            if (n.type === 'text') return n.value ?? '';
                            return (n.children ?? []).map(extractText).join('');
                          };
                          const thead = (node?.children ?? []).find((c: any) => c.tagName === 'thead');
                          const tbody = (node?.children ?? []).find((c: any) => c.tagName === 'tbody');
                          const headers = (thead?.children?.[0]?.children ?? [])
                            .filter((c: any) => c.tagName === 'th')
                            .map((c: any) => extractText(c));
                          const rows = (tbody?.children ?? [])
                            .filter((c: any) => c.tagName === 'tr')
                            .map((row: any) =>
                              (row.children ?? [])
                                .filter((c: any) => c.tagName === 'td')
                                .map((c: any) => extractText(c))
                            );
                          if (headers.length === 0) return null;
                          return (
                            <div className="my-2 space-y-2">
                              {rows.map((cells: string[], ri: number) => (
                                <div key={ri} className="bg-white rounded-card p-2.5 border border-line-strong">
                                  {headers.map((h: string, ci: number) => (
                                    <div key={ci} className="flex justify-between items-baseline py-0.5">
                                      <span className="text-gray-brand text-xs">{h}</span>
                                      <span className="text-ink text-xs font-medium ml-2 text-right tabular-nums">{cells[ci] ?? ''}</span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        },
                        thead: () => null,
                        tbody: () => null,
                        tr: () => null,
                        th: () => null,
                        td: () => null,
                        code: ({children}) => <code className="bg-chip px-1 rounded-card text-xs">{children}</code>,
                      }}
                    >{m.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-chip border border-line rounded-bubble rounded-bl-card px-3 py-2">
                  <Loader size={16} strokeWidth={1.8} className="text-gray-brand animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-line flex gap-3 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask a question..."
              className="nt-input flex-1"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-ink hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-pill px-5 py-2 transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RagChat;
