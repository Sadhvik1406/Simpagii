import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Search, ShieldCheck, Bookmark, ExternalLink } from 'lucide-react';

interface BrowserAppProps {
  isAgentActive?: boolean;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ isAgentActive = false }) => {
  const [url, setUrl] = useState('https://news.google.com');
  const [inputUrl, setInputUrl] = useState('https://news.google.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (targetUrl: string) => {
    setIsLoading(true);
    setUrl(targetUrl);
    setInputUrl(targetUrl);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden text-xs">
      {/* Chrome Address Bar */}
      <div className="bg-slate-900 px-2 py-2 border-b border-slate-800 flex items-center gap-1.5 shrink-0">
        <button className="p-1 text-slate-400 hover:text-white" aria-label="Back">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 text-slate-400 hover:text-white" aria-label="Forward">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => handleNavigate(inputUrl)}
          className={`p-1 text-slate-400 hover:text-white ${isLoading ? 'animate-spin' : ''}`}
          aria-label="Reload"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* URL Input */}
        <div className="flex-1 flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1 border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNavigate(inputUrl)}
            className="w-full bg-transparent text-white text-xs focus:outline-none"
            aria-label="Address bar"
          />
        </div>
      </div>

      {/* Webpage Content Surface */}
      <div className="flex-1 overflow-y-auto bg-slate-900/40 p-4 space-y-4">
        {/* News Article / Web View */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
            Google AI News • Live Feed
          </span>
          <h2 className="text-sm font-bold text-white leading-tight">
            Autonomous Server-Side AI Models Unlock Zero-Phone-Battery Mobile Assistants
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            By offloading all visual reasoning and model weights to low-latency server clusters, mobile devices run at 0% GPU and under 0.5% CPU load.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleNavigate('https://github.com/astraclaw/agent')}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-medium"
            >
              Read Full Article
            </button>
            <button
              onClick={() => handleNavigate('https://wikipedia.org/wiki/Project_Astra')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
            >
              Wikipedia Reference
            </button>
          </div>
        </div>

        {/* Search Results Mock */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400">Trending Searches</h3>
          <div className="grid grid-cols-2 gap-2">
            {['PUBG Mobile Gyroscope Settings', 'Mom Data Entry Automation', 'Best Free Gemini Prompts', 'Android 15 PWA Features'].map((query, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(`https://google.com/search?q=${encodeURIComponent(query)}`)}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left text-[11px] text-slate-300 flex items-center justify-between"
              >
                <span className="truncate">{query}</span>
                <Search className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
