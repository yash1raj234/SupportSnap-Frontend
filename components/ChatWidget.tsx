'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { chatWithBot } from '@/lib/api';
import { TypingIndicator } from './LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface ChatWidgetProps {
  botId: string;
  suggestedQuestions?: string[];
  className?: string;
  placeholder?: string;
  accentColor?: string;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatWidget({
  botId,
  suggestedQuestions = [],
  className = '',
  placeholder = 'Ask a question...',
  accentColor = '#000000',
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput('');

      const userMsg: Message = { id: makeId(), role: 'user', content: trimmed };
      const assistantId = makeId();
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      try {
        for await (const token of chatWithBot(botId, trimmed)) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
        );
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [botId, isStreaming]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
        style={{ backgroundColor: accentColor }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
          AI
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Support Assistant</p>
          <p className="text-white/70 text-xs">Powered by SupportSnap</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '360px' }}>
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-4">Ask me anything about this product</p>
            {suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
              style={msg.role === 'user' ? { backgroundColor: accentColor } : undefined}
            >
              {msg.streaming && msg.content === '' ? (
                <TypingIndicator />
              ) : (
                <>
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-0.5 h-4 bg-gray-500 ml-0.5 animate-pulse align-middle" />
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-3 border-t border-gray-100"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isStreaming}
          className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-gray-400 transition-colors disabled:opacity-50 placeholder:text-gray-400"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40 flex-shrink-0"
          style={{ backgroundColor: accentColor }}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
