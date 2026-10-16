import React, { useState, useRef } from 'react';
import { BlackHoleCanvas, BlackHoleCanvasRef } from './components/BlackHoleCanvas';
import { LockScreenOverlay } from './components/LockScreenOverlay';
import { Header } from './components/Header';
import { CosmicControls } from './components/CosmicControls';
import { VeoVideoStudio } from './components/VeoVideoStudio';
import { GeminiThinkingPanel } from './components/GeminiThinkingPanel';
import { DownloadModal } from './components/DownloadModal';
import { BlackHoleSettings, LockScreenConfig, AspectRatio } from './lib/types';
import { 
  Sparkles, 
  Video, 
  Brain, 
  Sliders, 
  Smartphone, 
  Download, 
  Maximize2, 
  Upload, 
  Flame, 
  Layers, 
  Check,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const canvasRef = useRef<BlackHoleCanvasRef | null>(null);

  // Initial settings modeled directly after the user's uploaded black & white black hole photo
  const [settings, setSettings] = useState<BlackHoleSettings>({
    spinSpeed: 1.2,
    lensingStrength: 1.6,
    jetIntensity: 1.4, // Prominent vertical cosmic jet like the user's reference
    accretionTurbulence: 1.1,
    particleDensity: 900,
    colorTheme: 'monochrome', // Exact match to the user's monochrome request!
    glowRadius: 1.5,
    showStarfield: true,
    showJet: true,
    showPhotonRing: true,
    dopplerBoost: true,
  });

  const [lockConfig, setLockConfig] = useState<LockScreenConfig>({
    enabled: true, // Default to true so user immediately sees their mobile lock screen!
    style: 'ios',
    time: '10:04',
    dateLanguage: 'en',
    showNotifications: true,
    showWidgets: true,
    batteryLevel: 98,
    carrierName: 'Deep Space',
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'veo' | 'physics' | 'brain' | 'lockscreen'>('veo');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [veoVideoBlobUrl, setVeoVideoBlobUrl] = useState<string | undefined>(undefined);
  const [copiedPromptSuccess, setCopiedPromptSuccess] = useState(false);

  // Settings updater
  const handleUpdateSettings = (newSettings: Partial<BlackHoleSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Lock screen config updater
  const handleUpdateLockConfig = (newConfig: Partial<LockScreenConfig>) => {
    setLockConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Quick Presets
  const handleApplyPreset = (presetName: string) => {
    switch (presetName) {
      case 'user-reference':
        setSettings({
          spinSpeed: 1.4,
          lensingStrength: 1.7,
          jetIntensity: 1.5,
          accretionTurbulence: 1.2,
          particleDensity: 1000,
          colorTheme: 'monochrome',
          glowRadius: 1.5,
          showStarfield: true,
          showJet: true,
          showPhotonRing: true,
          dopplerBoost: true,
        });
        break;
      case 'gargantua':
        setSettings({
          spinSpeed: 1.0,
          lensingStrength: 2.0,
          jetIntensity: 0.2,
          accretionTurbulence: 0.9,
          particleDensity: 1100,
          colorTheme: 'gargantua',
          glowRadius: 2.0,
          showStarfield: true,
          showJet: false,
          showPhotonRing: true,
          dopplerBoost: true,
        });
        break;
      case 'quasars':
        setSettings({
          spinSpeed: 2.4,
          lensingStrength: 1.4,
          jetIntensity: 1.8,
          accretionTurbulence: 1.6,
          particleDensity: 1200,
          colorTheme: 'cyan',
          glowRadius: 1.8,
          showStarfield: true,
          showJet: true,
          showPhotonRing: true,
          dopplerBoost: true,
        });
        break;
      case 'subtle':
        setSettings({
          spinSpeed: 0.6,
          lensingStrength: 1.0,
          jetIntensity: 0,
          accretionTurbulence: 0.7,
          particleDensity: 500,
          colorTheme: 'monochrome',
          glowRadius: 1.0,
          showStarfield: true,
          showJet: false,
          showPhotonRing: true,
          dopplerBoost: false,
        });
        break;
    }
  };

  const handleReset = () => {
    handleApplyPreset('user-reference');
  };

  // Apply prompt from Gemini 4 Argon thinking panel into Veo 3 studio
  const handleApplyThoughtPrompt = (prompt: string) => {
    setActiveSidebarTab('veo');
    // Also copy to clipboard or set in state
    navigator.clipboard?.writeText(prompt).catch(() => {});
    setCopiedPromptSuccess(true);
    setTimeout(() => setCopiedPromptSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top Navigation */}
      <Header
        lockConfig={lockConfig}
        onChangeLockConfig={handleUpdateLockConfig}
        aspectRatio={aspectRatio}
        onChangeAspectRatio={setAspectRatio}
        onOpenDownloadModal={() => setIsDownloadOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 8K Black Hole Viewport & Mobile Lock Screen Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          {/* Viewport Card */}
          <div className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative flex flex-col items-center justify-center min-h-[580px] lg:min-h-[740px]">
            {/* Quick overlay banner */}
            <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-medium">
                {lockConfig.enabled ? '8K Mobile Lock Screen Preview' : '8K Fullscreen Live Simulation'}
              </span>
            </div>

            {/* Top Right Viewport Actions */}
            <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdateLockConfig({ enabled: !lockConfig.enabled })}
                className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition shadow-sm"
                title="Toggle Phone Lock Screen Frame"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] hidden sm:inline">{lockConfig.enabled ? 'Hide Frame' : 'Lock Screen'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDownloadOpen(true)}
                className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition shadow-sm"
                title="Download 8K Wallpaper or Video"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] hidden sm:inline">Download</span>
              </button>
            </div>

            {/* The Black Hole Live Simulation inside Lock Screen Frame */}
            <div className="w-full flex items-center justify-center py-6">
              <LockScreenOverlay
                config={lockConfig}
                onChangeConfig={handleUpdateLockConfig}
              >
                <BlackHoleCanvas
                  ref={canvasRef}
                  settings={settings}
                  uploadedImage={uploadedImage}
                  aspectRatio={aspectRatio}
                  className="w-full h-full"
                />
              </LockScreenOverlay>
            </div>

            {/* Bottom Quick Bar under Viewport */}
            <div className="w-full pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[11px]">60 FPS WebGL / Canvas</span>
                </span>
                <span className="hidden sm:inline font-mono text-[11px] text-neutral-500">|</span>
                <span className="hidden sm:inline font-mono text-[11px] text-neutral-400">
                  ISCO Relativistic Beaming: Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('user-reference')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition underline underline-offset-4"
                >
                  Reload Reference Monochrome
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Control Center (Veo 3 Studio, Physics Controls, Gemini 4 Argon Thinking) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('veo')}
              className={`py-2 px-2 rounded-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                activeSidebarTab === 'veo'
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">Veo 3</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('physics')}
              className={`py-2 px-2 rounded-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                activeSidebarTab === 'physics'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Physics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('brain')}
              className={`py-2 px-2 rounded-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                activeSidebarTab === 'brain'
                  ? 'bg-gradient-to-r from-purple-950 to-pink-950 text-purple-300 border border-purple-800/60 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px]">Thinking</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('lockscreen')}
              className={`py-2 px-2 rounded-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 transition ${
                activeSidebarTab === 'lockscreen'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Lock UI</span>
            </button>
          </div>

          {/* Tab 1: Veo 3 Video Generator */}
          {activeSidebarTab === 'veo' && (
            <VeoVideoStudio
              uploadedImage={uploadedImage}
              onUploadImage={(base64) => setUploadedImage(base64)}
              aspectRatio={aspectRatio}
              onChangeAspectRatio={setAspectRatio}
            />
          )}

          {/* Tab 2: Physics & Visual Controls */}
          {activeSidebarTab === 'physics' && (
            <CosmicControls
              settings={settings}
              onChangeSettings={handleUpdateSettings}
              onReset={handleReset}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {/* Tab 3: Gemini 4 Argon High Thinking */}
          {activeSidebarTab === 'brain' && (
            <GeminiThinkingPanel
              onApplyPrompt={handleApplyThoughtPrompt}
            />
          )}

          {/* Tab 4: Lock Screen Customizer */}
          {activeSidebarTab === 'lockscreen' && (
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-white shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-sm">Lock Screen Display Settings</h3>
                </div>
              </div>

              {/* Language toggle */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                  Language for Date & Notifications (তারিখ ও ভাষা)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateLockConfig({ dateLanguage: 'bn' })}
                    className={`py-2 px-3 rounded-xl border font-medium transition ${
                      lockConfig.dateLanguage === 'bn'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateLockConfig({ dateLanguage: 'en' })}
                    className={`py-2 px-3 rounded-xl border font-medium transition ${
                      lockConfig.dateLanguage === 'en'
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Lock Screen Style */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                  Device Aesthetic
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateLockConfig({ style: 'ios' })}
                    className={`py-2 px-3 rounded-xl border font-medium transition ${
                      lockConfig.style === 'ios'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    iOS 18 Glass
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateLockConfig({ style: 'android' })}
                    className={`py-2 px-3 rounded-xl border font-medium transition ${
                      lockConfig.style === 'android'
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Android Material
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <span>Show Lock Screen Widgets</span>
                  <input
                    type="checkbox"
                    checked={lockConfig.showWidgets}
                    onChange={(e) => handleUpdateLockConfig({ showWidgets: e.target.checked })}
                    className="accent-emerald-400 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <span>Show Observatory Alert Notification</span>
                  <input
                    type="checkbox"
                    checked={lockConfig.showNotifications}
                    onChange={(e) => handleUpdateLockConfig({ showNotifications: e.target.checked })}
                    className="accent-emerald-400 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Download Center Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        canvasRef={canvasRef}
        veoVideoBlobUrl={veoVideoBlobUrl}
      />
    </div>
  );
}
