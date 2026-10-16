import React from 'react';
import { 
  Download, 
  Smartphone, 
  Eye, 
  Sparkles, 
  Globe, 
  Settings2,
  Tv,
  Layers
} from 'lucide-react';
import { AspectRatio, LockScreenConfig } from '../lib/types';

interface Props {
  lockConfig: LockScreenConfig;
  onChangeLockConfig: (newConfig: Partial<LockScreenConfig>) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ar: AspectRatio) => void;
  onOpenDownloadModal: () => void;
}

export const Header: React.FC<Props> = ({
  lockConfig,
  onChangeLockConfig,
  aspectRatio,
  onChangeAspectRatio,
  onOpenDownloadModal,
}) => {
  return (
    <header className="w-full bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <div className="w-4 h-4 rounded-full bg-black border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">Singularity 8K</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
                8K UHD
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                Veo 3 Live
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Moving Black Hole Lock Screen Wallpaper Generator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Lock Screen Toggle */}
          <button
            type="button"
            onClick={() => onChangeLockConfig({ enabled: !lockConfig.enabled })}
            className={`py-1.5 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
              lockConfig.enabled
                ? 'bg-neutral-800 border-neutral-700 text-cyan-300 shadow-sm'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle Lock Screen Frame & Clock Overlay"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Screen Mode</span>
            <span className="sm:hidden">Lock</span>
          </button>

          {/* Bengali / English Language Toggle */}
          <button
            type="button"
            onClick={() => onChangeLockConfig({ dateLanguage: lockConfig.dateLanguage === 'bn' ? 'en' : 'bn' })}
            className="py-1.5 px-2.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-xs text-neutral-300 flex items-center gap-1 transition"
            title="Bangla / English Toggle"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="font-sans text-[11px] font-semibold">{lockConfig.dateLanguage === 'bn' ? 'BN' : 'EN'}</span>
          </button>

          {/* Aspect Ratio Switch */}
          <div className="hidden md:flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onChangeAspectRatio('9:16')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                aspectRatio === '9:16' ? 'bg-neutral-800 text-cyan-300' : 'text-neutral-400 hover:text-white'
              }`}
            >
              9:16
            </button>
            <button
              type="button"
              onClick={() => onChangeAspectRatio('16:9')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                aspectRatio === '16:9' ? 'bg-neutral-800 text-cyan-300' : 'text-neutral-400 hover:text-white'
              }`}
            >
              16:9
            </button>
          </div>

          {/* Download CTA Button */}
          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Wallpaper</span>
          </button>
        </div>
      </div>
    </header>
  );
};
