import React from 'react';
import { BlackHoleSettings, ColorTheme } from '../lib/types';
import { 
  Sliders, 
  RotateCw, 
  Flame, 
  Sparkles, 
  Radio, 
  Eye, 
  RefreshCw,
  Palette,
  Compass
} from 'lucide-react';

interface Props {
  settings: BlackHoleSettings;
  onChangeSettings: (newSettings: Partial<BlackHoleSettings>) => void;
  onReset: () => void;
  onApplyPreset: (name: string) => void;
}

export const CosmicControls: React.FC<Props> = ({
  settings,
  onChangeSettings,
  onReset,
  onApplyPreset,
}) => {
  const themes: { id: ColorTheme; label: string; bg: string; border: string }[] = [
    { id: 'monochrome', label: 'Monochrome Void (8K)', bg: 'bg-white/20', border: 'border-white' },
    { id: 'gargantua', label: 'Gargantua Gold', bg: 'bg-amber-500/20', border: 'border-amber-400' },
    { id: 'cyan', label: 'Hawking Cyan', bg: 'bg-cyan-500/20', border: 'border-cyan-400' },
    { id: 'violet', label: 'Deep Violet', bg: 'bg-purple-500/20', border: 'border-purple-400' },
    { id: 'crimson', label: 'Relativistic Crimson', bg: 'bg-rose-500/20', border: 'border-rose-400' },
  ];

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-white shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide">Cosmic Physics & Visual Controls</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="text-xs font-medium text-neutral-400 block mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Astrophysical Presets</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onApplyPreset('user-reference')}
            className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-medium text-left transition ${
              settings.colorTheme === 'monochrome' && settings.showJet
                ? 'border-white/50 bg-white/10 text-white shadow-sm'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ★ User Photo Reference
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('gargantua')}
            className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-medium text-left transition ${
              settings.colorTheme === 'gargantua'
                ? 'border-amber-500/60 bg-amber-950/30 text-amber-300'
                : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Interstellar Gargantua
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('quasars')}
            className="py-1.5 px-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 text-[11px] font-medium text-left transition"
          >
            Hyper-Luminous Quasar
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('subtle')}
            className="py-1.5 px-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 text-[11px] font-medium text-left transition"
          >
            Quiet Event Horizon
          </button>
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-xs font-medium text-neutral-400 block mb-1.5 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Luminescence Palette</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChangeSettings({ colorTheme: t.id })}
              className={`py-1.5 px-2.5 rounded-xl border text-[11px] flex items-center gap-2 transition ${
                settings.colorTheme === t.id
                  ? `${t.border} bg-neutral-800 text-white font-medium`
                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${t.bg} border ${t.border}`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Physics Sliders */}
      <div className="space-y-3 pt-1">
        {/* Spin Speed */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3 h-3 text-cyan-400" />
              <span>Accretion Spin Velocity</span>
            </span>
            <span className="font-mono text-[11px] text-cyan-400">{settings.spinSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={settings.spinSpeed}
            onChange={(e) => onChangeSettings({ spinSpeed: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
          />
        </div>

        {/* Lensing Strength */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-purple-400" />
              <span>Gravitational Lensing Warp</span>
            </span>
            <span className="font-mono text-[11px] text-purple-400">{settings.lensingStrength.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={settings.lensingStrength}
            onChange={(e) => onChangeSettings({ lensingStrength: parseFloat(e.target.value) })}
            className="w-full accent-purple-400 bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
          />
        </div>

        {/* Relativistic Jet Intensity */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Relativistic Jet Beam</span>
            </span>
            <span className="font-mono text-[11px] text-amber-400">{settings.jetIntensity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="2.0"
            step="0.1"
            value={settings.jetIntensity}
            onChange={(e) => onChangeSettings({ jetIntensity: parseFloat(e.target.value), showJet: parseFloat(e.target.value) > 0 })}
            className="w-full accent-amber-400 bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
          />
        </div>
      </div>

      {/* Relativistic Physics Toggles */}
      <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs">
        <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
          <input
            type="checkbox"
            checked={settings.dopplerBoost}
            onChange={(e) => onChangeSettings({ dopplerBoost: e.target.checked })}
            className="accent-cyan-400 rounded"
          />
          <span className="text-[11px] text-neutral-300">Doppler Beaming</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
          <input
            type="checkbox"
            checked={settings.showPhotonRing}
            onChange={(e) => onChangeSettings({ showPhotonRing: e.target.checked })}
            className="accent-cyan-400 rounded"
          />
          <span className="text-[11px] text-neutral-300">Photon Sphere Ring</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
          <input
            type="checkbox"
            checked={settings.showStarfield}
            onChange={(e) => onChangeSettings({ showStarfield: e.target.checked })}
            className="accent-cyan-400 rounded"
          />
          <span className="text-[11px] text-neutral-300">Lensed Starfield</span>
        </label>

        <label className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
          <input
            type="checkbox"
            checked={settings.showJet}
            onChange={(e) => onChangeSettings({ showJet: e.target.checked, jetIntensity: e.target.checked ? (settings.jetIntensity || 1) : 0 })}
            className="accent-cyan-400 rounded"
          />
          <span className="text-[11px] text-neutral-300">Vertical Axis Jet</span>
        </label>
      </div>
    </div>
  );
};
