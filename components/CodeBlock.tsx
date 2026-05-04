'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export default function CodeBlock({ code, language = 'html', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`relative group rounded-2xl overflow-hidden bg-gray-900 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
