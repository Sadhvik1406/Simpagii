import React, { useState } from 'react';
import { MessageSquare, Send, Phone, Video, MoreVertical, ArrowLeft, CheckCheck, Paperclip } from 'lucide-react';

interface MessageItem {
  id: string;
  sender: 'mom' | 'user' | 'agent';
  text: string;
  time: string;
}

interface MessagesAppProps {
  isAgentActive?: boolean;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({ isAgentActive = false }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'mom',
      text: 'Hi honey, did you finish putting the medical clinic invoices into the spreadsheet?',
      time: '12:30 PM',
    },
    {
      id: '2',
      sender: 'agent',
      text: 'Hi Mom! AstraClaw is processing them right now. 4 invoices verified and totaled $1,035.60.',
      time: '12:35 PM',
    },
    {
      id: '3',
      sender: 'mom',
      text: 'Wow that was so fast! Thank you so much ❤️',
      time: '12:36 PM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: 'user',
        text: inputVal.trim(),
        time: '12:46 PM',
      },
    ]);
    setInputVal('');
  };

  return (
    <div className="w-full h-full bg-[#0b141a] text-white flex flex-col font-sans select-none overflow-hidden text-xs">
      {/* WhatsApp Header */}
      <div className="bg-[#202c33] px-3 py-2 flex items-center justify-between shrink-0 shadow">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
            👩
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight">Mom ❤️</h3>
            <span className="text-[10px] text-emerald-400">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
          <Video className="w-4 h-4 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map(msg => {
          const isMine = msg.sender === 'user' || msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-1.5 shadow ${
                  isMine ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-[9px] text-sky-300 font-bold block mb-0.5">
                    🤖 AstraClaw Auto-Reply
                  </span>
                )}
                <p className="text-xs leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-300 mt-1 font-mono">
                  <span>{msg.time}</span>
                  {isMine && <CheckCheck className="w-3 h-3 text-sky-400" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div className="bg-[#202c33] p-2 flex items-center gap-2 shrink-0">
        <Paperclip className="w-4 h-4 text-slate-400 cursor-pointer" />
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Message Mom or type command..."
          className="flex-1 bg-[#2a3942] text-white text-xs rounded-full px-3 py-1.5 focus:outline-none placeholder-slate-400"
          aria-label="Type a message"
        />
        <button
          onClick={sendMessage}
          className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white active:scale-95 transition"
          aria-label="Send"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
