import React, { useState, useEffect } from 'react';
import { LockScreenConfig } from '../lib/types';
import { 
  Wifi, 
  BatteryMedium, 
  Flashlight, 
  Camera, 
  Lock, 
  Sparkles, 
  Atom,
  Clock as ClockIcon,
  Bell
} from 'lucide-react';

interface Props {
  config: LockScreenConfig;
  onChangeConfig: (newConfig: Partial<LockScreenConfig>) => void;
  children: React.ReactNode;
}

export const LockScreenOverlay: React.FC<Props> = ({
  config,
  onChangeConfig,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDateEn, setCurrentDateEn] = useState<string>('Friday, October 16');
  const [currentDateBn, setCurrentDateBn] = useState<string>('Friday, October 16');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      // English date
      const optionsEn: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDateEn(now.toLocaleDateString('en-US', optionsEn));

      // Bengali date fallback
      try {
        const optionsBn: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        setCurrentDateBn(`${now.toLocaleDateString('en-US', optionsBn)} • Cosmic Time`);
      } catch (e) {
        setCurrentDateBn('Fri, Oct 16 • Cosmic Time');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateText = config.dateLanguage === 'bn' ? (currentDateBn || currentDateEn) : currentDateEn;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Phone Mockup Frame (if lock screen enabled) */}
      <div 
        className={`relative transition-all duration-500 overflow-hidden ${
          config.enabled 
            ? 'w-full max-w-[390px] h-[92vh] max-h-[820px] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[10px] border-neutral-900 ring-1 ring-white/20' 
            : 'w-full h-full rounded-2xl'
        }`}
      >
        {/* The Live Wallpaper / Black Hole Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          {children}
        </div>

        {/* Lock Screen UI Overlays */}
        {config.enabled && (
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none select-none text-white">
            {/* Top Status Bar & Dynamic Island */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold px-4 pt-1 text-white/90">
                <span className="tracking-tight font-medium">{currentTime}</span>

                {/* Dynamic Island pill */}
                <div className="pointer-events-auto h-7 px-4 bg-black/90 border border-white/10 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-neutral-300">8K Singularity</span>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">{config.batteryLevel}%</span>
                    <BatteryMedium className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Lock Icon & Time & Date */}
              <div className="mt-8 flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 mb-2">
                  <Lock className="w-3 h-3 text-cyan-300" />
                  <span>{config.style === 'ios' ? 'Face ID Active' : 'Biometric Secured'}</span>
                </div>

                <div className="text-white/80 text-sm font-medium tracking-wide drop-shadow-md">
                  {dateText}
                </div>

                <div className="text-7xl font-light tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] font-sans">
                  {currentTime}
                </div>

                {/* Cosmic Lockscreen Widgets */}
                {config.showWidgets && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white/90">
                      <Atom className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono">ISCO: 3.0 Rs</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white/90">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono">8K UHD Live</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Notification Preview */}
            {config.showNotifications && (
              <div className="my-auto pointer-events-auto">
                <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl transition hover:bg-neutral-900/90">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Deep Space Observatory</span>
                    </div>
                    <span className="text-[10px]">Just now</span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Event Horizon Lock Screen Engaged
                  </div>
                  <div className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                    Gravitational lensing wallpaper rendered at 8K resolution. Wallpaper loop ready for download.
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Flashlight, Unlock Bar, Camera */}
            <div className="pb-2">
              <div className="flex items-center justify-between px-3 mb-6 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setTorchOn(!torchOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-lg border transition-all duration-200 ${
                    torchOn 
                      ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]' 
                      : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                  }`}
                  title="Flashlight"
                >
                  <Flashlight className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="text-[11px] text-white/60 tracking-wider">
                    Swipe up to unlock
                  </div>
                  <div className="w-36 h-1.5 bg-white/70 rounded-full mx-auto mt-2 animate-pulse shadow-sm" />
                </div>

                <button
                  type="button"
                  onClick={() => alert('Camera shortcut preview')}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-lg border border-white/20 text-white hover:bg-black/60 transition"
                  title="Camera"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
