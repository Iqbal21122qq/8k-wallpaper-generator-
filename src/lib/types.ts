export type AspectRatio = '9:16' | '16:9';
export type Resolution = '720p' | '1080p';

export type ColorTheme = 'monochrome' | 'gargantua' | 'cyan' | 'violet' | 'crimson';

export interface BlackHoleSettings {
  spinSpeed: number; // 0.1 to 3.0
  lensingStrength: number; // 0.5 to 2.5
  jetIntensity: number; // 0 to 2.0
  accretionTurbulence: number; // 0.5 to 2.0
  particleDensity: number; // 100 to 2000
  colorTheme: ColorTheme;
  glowRadius: number;
  showStarfield: boolean;
  showJet: boolean;
  showPhotonRing: boolean;
  dopplerBoost: boolean; // One side brighter due to relativistic motion
}

export interface LockScreenConfig {
  enabled: boolean;
  style: 'ios' | 'android';
  time: string;
  dateLanguage: 'bn' | 'en';
  showNotifications: boolean;
  showWidgets: boolean;
  batteryLevel: number;
  carrierName: string;
}

export interface VideoGenerationJob {
  id: string;
  operationName: string;
  mode: 'image-to-video' | 'text-to-video';
  prompt: string;
  aspectRatio: AspectRatio;
  status: 'idle' | 'submitting' | 'processing' | 'done' | 'failed';
  progressMessage: string;
  error?: string;
  videoBlobUrl?: string;
  createdAt: number;
}
