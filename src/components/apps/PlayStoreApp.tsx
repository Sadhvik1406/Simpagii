import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Star, 
  CheckCircle2, 
  Play, 
  ArrowLeft, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export interface PlayStoreAppItem {
  id: string;
  name: string;
  developer: string;
  icon: string;
  rating: number;
  reviewsCount: string;
  downloadCount: string;
  size: string;
  category: string;
  description: string;
  isInstalled: boolean;
  installProgress?: number; // 0 to 100
  isInstalling?: boolean;
}

interface PlayStoreAppProps {
  installedAppIds: string[];
  onInstallApp: (app: PlayStoreAppItem) => void;
  onOpenApp: (appId: string) => void;
  isAgentActive?: boolean;
}

export const PlayStoreApp: React.FC<PlayStoreAppProps> = ({
  installedAppIds,
  onInstallApp,
  onOpenApp,
  isAgentActive = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<PlayStoreAppItem | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  const initialApps: PlayStoreAppItem[] = [
    {
      id: 'pubg',
      name: 'PUBG MOBILE',
      developer: 'Level Infinite',
      icon: '🎯',
      rating: 4.5,
      reviewsCount: '44M',
      downloadCount: '1B+',
      size: '850 MB',
      category: 'Action • Battle Royale',
      description: 'Original battle royale mobile game with extreme survival firefights, vehicle chases, and tactical squad play.',
      isInstalled: installedAppIds.includes('pubg'),
    },
    {
      id: 'data_entry',
      name: 'Microsoft Excel: Spreadsheets',
      developer: 'Microsoft Corporation',
      icon: '📊',
      rating: 4.5,
      reviewsCount: '4.8M',
      downloadCount: '1B+',
      size: '72 MB',
      category: 'Productivity • Office',
      description: 'Create, view, and edit spreadsheets, data entry ledgers, charts, and budget formulas on the go.',
      isInstalled: installedAppIds.includes('data_entry'),
    },
    {
      id: 'spotify',
      name: 'Spotify: Music and Podcasts',
      developer: 'Spotify AB',
      icon: '🎵',
      rating: 4.4,
      reviewsCount: '32M',
      downloadCount: '1B+',
      size: '34 MB',
      category: 'Music & Audio',
      description: 'Stream music, playlists, podcasts, and albums from artists all over the globe.',
      isInstalled: installedAppIds.includes('spotify'),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Messenger',
      developer: 'Meta Platforms, Inc.',
      icon: '💬',
      rating: 4.3,
      reviewsCount: '190M',
      downloadCount: '5B+',
      size: '42 MB',
      category: 'Communication',
      description: 'Simple. Reliable. Private. Instant messaging, group chats, and voice calls.',
      isInstalled: installedAppIds.includes('whatsapp'),
    },
    {
      id: 'roblox',
      name: 'Roblox',
      developer: 'Roblox Corporation',
      icon: '🧱',
      rating: 4.4,
      reviewsCount: '38M',
      downloadCount: '500M+',
      size: '180 MB',
      category: 'Adventure',
      description: 'Roblox is the ultimate virtual universe that lets you create, share experiences, and be anything you imagine.',
      isInstalled: installedAppIds.includes('roblox'),
    },
    {
      id: 'duolingo',
      name: 'Duolingo: Language Lessons',
      developer: 'Duolingo',
      icon: '🦉',
      rating: 4.7,
      reviewsCount: '21M',
      downloadCount: '500M+',
      size: '64 MB',
      category: 'Education',
      description: 'Learn Spanish, French, German, Japanese, and 30+ languages with bite-sized gamified lessons.',
      isInstalled: installedAppIds.includes('duolingo'),
    },
    {
      id: 'youtube',
      name: 'YouTube',
      developer: 'Google LLC',
      icon: '▶️',
      rating: 4.2,
      reviewsCount: '140M',
      downloadCount: '10B+',
      size: '58 MB',
      category: 'Video Players & Editors',
      description: 'Watch the worlds videos and discover new music, gaming, news, and entertainment.',
      isInstalled: installedAppIds.includes('youtube'),
    },
  ];

  const filteredApps = initialApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startInstall = (app: PlayStoreAppItem) => {
    setInstallingId(app.id);
    setInstallProgress(10);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallingId(null);
          onInstallApp(app);
          setTimeout(() => {
            onOpenApp(app.id);
          }, 800);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  // Autonomous Agent Driver (ensures it actually presses Install and NEVER tap-spams while downloading)
  useEffect(() => {
    if (!isAgentActive) return;

    // Phase 1: If on catalog and no app selected, select uninstalled app (e.g. Roblox or Duolingo)
    if (!selectedApp && !installingId) {
      const target = initialApps.find(a => !installedAppIds.includes(a.id)) || initialApps[0];
      const timer = setTimeout(() => {
        setSelectedApp(target);
      }, 700);
      return () => clearTimeout(timer);
    }

    // Phase 2: If on app details page and not installed, press Install!
    if (selectedApp && !installedAppIds.includes(selectedApp.id) && !installingId) {
      const timer = setTimeout(() => {
        startInstall(selectedApp);
      }, 800);
      return () => clearTimeout(timer);
    }

    // Phase 3: If already installed, click Open
    if (selectedApp && installedAppIds.includes(selectedApp.id) && !installingId) {
      const timer = setTimeout(() => {
        onOpenApp(selectedApp.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAgentActive, selectedApp, installingId, installedAppIds]);

  return (
    <div className="w-full h-full bg-[#121212] text-white flex flex-col font-sans select-none overflow-hidden text-xs">
      {/* Top Play Store Bar */}
      <div className="bg-[#1f1f1f] p-2.5 border-b border-[#2d2d2d] flex items-center gap-2 shrink-0">
        {selectedApp ? (
          <button
            onClick={() => setSelectedApp(null)}
            className="p-1 rounded-full hover:bg-white/10 text-slate-300"
            aria-label="Back to store"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-tight">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-white text-xs">Google Play</span>
          </div>
        )}

        {/* Search Input Box */}
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search apps & games..."
            className="w-full bg-[#2b2b2b] text-white text-xs rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 border border-transparent"
            aria-label="Search apps"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {selectedApp ? (
          /* App Detail View */
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#2b2b2b] border border-white/10 flex items-center justify-center text-3xl shadow-lg shrink-0">
                {selectedApp.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white leading-snug">{selectedApp.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{selectedApp.developer}</p>
                <p className="text-[10px] text-slate-400">{selectedApp.category}</p>
              </div>
            </div>

            {/* Quick Metrics (Rating, Reviews, Downloads) */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 font-bold text-slate-200">
                  <span>{selectedApp.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-[10px] text-slate-500">{selectedApp.reviewsCount} reviews</span>
              </div>
              <div>
                <div className="font-bold text-slate-200">{selectedApp.downloadCount}</div>
                <span className="text-[10px] text-slate-500">Downloads</span>
              </div>
              <div>
                <div className="font-bold text-slate-200">{selectedApp.size}</div>
                <span className="text-[10px] text-slate-500">Download size</span>
              </div>
            </div>

            {/* Install / Open Button */}
            <div>
              {installedAppIds.includes(selectedApp.id) ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenApp(selectedApp.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-md transition active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Open
                  </button>
                </div>
              ) : installingId === selectedApp.id ? (
                <div className="space-y-1.5 bg-[#1f1f1f] p-3 rounded-xl border border-white/10">
                  <div className="flex justify-between text-[11px] font-medium text-slate-300">
                    <span>{installProgress < 100 ? 'Downloading...' : 'Installing...'}</span>
                    <span className="font-mono">{installProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#2d2d2d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified by Play Protect
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => startInstall(selectedApp)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 space-y-1">
              <h4 className="text-xs font-semibold text-slate-200">About this app</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{selectedApp.description}</p>
            </div>
          </div>
        ) : (
          /* Store Catalog Grid */
          <div className="space-y-4">
            {/* Category Banner */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended for You'}
              </h3>
              <span className="text-[10px] text-emerald-400 font-medium">Top Rated</span>
            </div>

            {/* App List */}
            <div className="space-y-2">
              {filteredApps.map(app => {
                const isInstalled = installedAppIds.includes(app.id);
                const isInstalling = installingId === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-white/10 flex items-center justify-center text-2xl shadow shrink-0">
                        {app.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs truncate">{app.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{app.category}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                          <span className="flex items-center gap-0.5 text-amber-400">
                            ★ {app.rating}
                          </span>
                          <span>•</span>
                          <span>{app.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isInstalled ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onOpenApp(app.id);
                          }}
                          className="px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-950/40"
                        >
                          Open
                        </button>
                      ) : isInstalling ? (
                        <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                          {installProgress}%
                        </span>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            startInstall(app);
                          }}
                          className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold hover:bg-emerald-400"
                        >
                          Install
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
