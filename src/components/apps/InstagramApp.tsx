import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Search, 
  Home, 
  Compass, 
  PlusSquare, 
  User, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface InstagramAppProps {
  isAgentActive?: boolean;
}

export const InstagramApp: React.FC<InstagramAppProps> = ({ isAgentActive = false }) => {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'dms' | 'chat'>('feed');
  const [likedPosts, setLikedPosts] = useState<number[]>([1]);
  const [chatUser, setChatUser] = useState('Alex Rivera');
  const [messages, setMessages] = useState([
    { sender: 'alex', text: 'Hey, did you see the new Android AGI project?' },
    { sender: 'me', text: 'Yeah! AstraClaw runs completely on server, zero phone battery drain.' },
    { sender: 'alex', text: 'Can it play games and reply to Instagram messages autonomously?' },
    { sender: 'me', text: 'Yes, it has full accessibility permissions and autonomous reasoning.' },
  ]);
  const [inputText, setInputText] = useState('');

  const stories = [
    { name: 'Your Story', avatar: '🧑‍💻', hasUnseen: false },
    { name: 'Mom ❤️', avatar: '👩', hasUnseen: true },
    { name: 'PUBG Esports', avatar: '🎯', hasUnseen: true },
    { name: 'Gemini AI', avatar: '✨', hasUnseen: true },
    { name: 'TechCrunch', avatar: '📰', hasUnseen: false },
  ];

  const posts = [
    {
      id: 1,
      author: 'pubg_mobile',
      avatar: '🎯',
      location: 'Erangel • Military Base',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      caption: 'Chicken dinner secured! Autonomous Jarvis tactical co-pilot detected the enemy flank.',
      likes: 18450,
      comments: 520,
      time: '1 HOUR AGO',
    },
    {
      id: 2,
      author: 'creative_coder',
      avatar: '💻',
      location: 'Android Studio',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      caption: 'Building next-gen autonomous Android agents. Self-healing, multi-key rotation.',
      likes: 8940,
      comments: 198,
      time: '5 HOURS AGO',
    },
  ];

  const toggleLike = (id: number) => {
    setLikedPosts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text: inputText.trim() }]);
    setInputText('');
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none overflow-hidden text-xs">
      {/* Top App Bar */}
      <div className="bg-black/90 px-3 py-2 border-b border-white/10 flex items-center justify-between shrink-0">
        {activeScreen === 'chat' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScreen('dms')}
              className="p-1 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="font-bold text-white text-xs">{chatUser}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white font-serif italic">
              Instagram
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-slate-300 cursor-pointer" />
          <button
            onClick={() => setActiveScreen(activeScreen === 'dms' ? 'feed' : 'dms')}
            className="relative"
            aria-label="Direct Messages"
          >
            <Send className="w-4 h-4 text-slate-300 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Screen Content: Feed or DMs or Chat */}
      {activeScreen === 'feed' && (
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {/* Stories Carousel */}
          <div className="p-2 flex gap-3 overflow-x-auto border-b border-white/10 shrink-0">
            {stories.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                <div
                  className={`w-12 h-12 rounded-full p-0.5 flex items-center justify-center ${
                    s.hasUnseen
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                      : 'bg-slate-800'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-lg">
                    {s.avatar}
                  </div>
                </div>
                <span className="text-[10px] text-slate-300 truncate w-14 text-center">
                  {s.name}
                </span>
              </div>
            ))}
          </div>

          {/* Posts */}
          {posts.map(post => {
            const isLiked = likedPosts.includes(post.id);

            return (
              <div key={post.id} className="pb-3 space-y-2">
                {/* Author Info */}
                <div className="px-3 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-[11px]">{post.author}</div>
                      <div className="text-[9px] text-slate-400">{post.location}</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Post Image */}
                <div className="relative w-full aspect-square bg-slate-900 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Action Buttons */}
                <div className="px-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLike(post.id)}>
                      <Heart
                        className={`w-4 h-4 transition ${
                          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <MessageCircle className="w-4 h-4 text-slate-300" />
                    <Send className="w-4 h-4 text-slate-300" />
                  </div>
                  <Bookmark className="w-4 h-4 text-slate-300" />
                </div>

                {/* Likes & Caption */}
                <div className="px-3 space-y-0.5">
                  <div className="font-bold text-white text-[11px]">
                    {(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
                  </div>
                  <p className="text-[11px] text-slate-200">
                    <span className="font-bold mr-1.5">{post.author}</span>
                    {post.caption}
                  </p>
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">
                    {post.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeScreen === 'dms' && (
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
          <div className="p-1 mb-2">
            <span className="font-bold text-white text-xs">Direct Messages</span>
          </div>

          {[
            { name: 'Alex Rivera', handle: '@alex_r', avatar: '🧑‍💻', preview: 'Can it play games and reply to messages?', unread: true },
            { name: 'Mom ❤️', handle: '@mom', avatar: '👩', preview: 'Love you sweetie! Thanks for the invoices', unread: false },
            { name: 'PUBG Squad HQ', handle: '@pubg_squad', avatar: '🎯', preview: 'Ready for tournament drop tonight?', unread: false },
          ].map((chat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setChatUser(chat.name);
                setActiveScreen('chat');
              }}
              className="p-2.5 flex items-center justify-between rounded-xl hover:bg-white/5 cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                  {chat.avatar}
                </div>
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>{chat.name}</span>
                    {chat.unread && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                    {chat.preview}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeScreen === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-black">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs ${
                    m.sender === 'me'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-white/10 flex items-center gap-2 bg-black">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Message..."
              className="flex-1 bg-[#1a1a1a] text-white text-xs rounded-full px-3 py-1.5 focus:outline-none placeholder-slate-500"
              aria-label="Instagram message input"
            />
            <button
              onClick={handleSend}
              className="text-sky-400 font-bold text-xs px-2 hover:text-sky-300"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="bg-black border-t border-white/10 py-2 px-4 flex items-center justify-between text-slate-400 shrink-0">
        <button onClick={() => setActiveScreen('feed')} className="hover:text-white">
          <Home className="w-5 h-5" />
        </button>
        <button className="hover:text-white">
          <Search className="w-5 h-5" />
        </button>
        <button className="hover:text-white">
          <PlusSquare className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveScreen('dms')} className="hover:text-white">
          <Compass className="w-5 h-5" />
        </button>
        <button className="hover:text-white">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
