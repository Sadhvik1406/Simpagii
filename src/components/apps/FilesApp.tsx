import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Trash2, 
  Copy, 
  HardDrive, 
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Search
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'doc' | 'image' | 'audio' | 'video' | 'archive';
  size: string;
  modified: string;
  isDuplicate?: boolean;
}

interface FilesAppProps {
  isAgentActive?: boolean;
}

export const FilesApp: React.FC<FilesAppProps> = ({ isAgentActive = false }) => {
  const [currentFolder, setCurrentFolder] = useState('/storage/emulated/0');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [cleanedCount, setCleanedCount] = useState(0);

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'DCIM', type: 'folder', size: '4.2 GB', modified: 'Yesterday' },
    { id: '2', name: 'Downloads', type: 'folder', size: '1.8 GB', modified: '2 hours ago' },
    { id: '3', name: 'Documents', type: 'folder', size: '320 MB', modified: 'Today' },
    { id: '4', name: 'Mom_Invoices_October.pdf', type: 'doc', size: '2.4 MB', modified: '10 mins ago' },
    { id: '5', name: 'Mom_Invoices_October (1).pdf', type: 'doc', size: '2.4 MB', modified: '10 mins ago', isDuplicate: true },
    { id: '6', name: 'pubg_screen_record_clutch.mp4', type: 'video', size: '48 MB', modified: 'Oct 15' },
    { id: '7', name: 'screenshot_20261019_0412.png', type: 'image', size: '1.1 MB', modified: 'Oct 19', isDuplicate: true },
  ]);

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const autoCleanDuplicates = () => {
    const duplicates = files.filter(f => f.isDuplicate);
    setFiles(prev => prev.filter(f => !f.isDuplicate));
    setCleanedCount(c => c + duplicates.length);
  };

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-sky-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-emerald-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden text-xs">
      {/* Top Header */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">Files & Storage</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          64.2 GB / 128 GB Free
        </span>
      </div>

      {/* Breadcrumb Path & Search */}
      <div className="bg-slate-900/60 p-2 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono truncate">
          <span>Root</span>
          <span>&gt;</span>
          <span className="text-white font-medium">Internal Storage</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={autoCleanDuplicates}
            className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 px-2 py-1 rounded text-[10px] font-medium"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Clean Duplicates
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-900 p-1">
        {files.map(file => {
          const isSelected = selectedFiles.includes(file.id);

          return (
            <div
              key={file.id}
              onClick={() => toggleSelect(file.id)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                isSelected ? 'bg-sky-500/20 border border-sky-400/40' : 'hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(file.type)}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-200 truncate">{file.name}</span>
                    {file.isDuplicate && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded">
                        Duplicate
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 font-mono">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              </div>

              {isSelected && <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Footer Storage Stats */}
      <div className="bg-slate-900/90 border-t border-slate-800 p-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>{files.length} items total</span>
        {cleanedCount > 0 && (
          <span className="text-emerald-400 font-medium">
            Saved {(cleanedCount * 2.4).toFixed(1)} MB space
          </span>
        )}
      </div>
    </div>
  );
};
