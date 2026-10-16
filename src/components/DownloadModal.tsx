import React, { useState } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  Check, 
  Loader2, 
  Info,
  HelpCircle
} from 'lucide-react';
import { BlackHoleCanvasRef } from './BlackHoleCanvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<BlackHoleCanvasRef | null>;
  veoVideoBlobUrl?: string;
}

export const DownloadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  canvasRef,
  veoVideoBlobUrl,
}) => {
  const [downloading8K, setDownloading8K] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<'android' | 'ios'>('android');
  const [guideLang, setGuideLang] = useState<'bn' | 'en'>('en');

  if (!isOpen) return null;

  // 1. Download 8K Ultra HD Still Wallpaper
  const handleDownload8KImage = async () => {
    if (!canvasRef.current || downloading8K) return;

    setDownloading8K(true);
    try {
      // 4320 x 7680 true 8K portrait resolution
      const blob = await canvasRef.current.captureSnapshot(4320, 7680);
      if (!blob) throw new Error('Could not capture 8K snapshot');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `black-hole-8k-ultrahd-wallpaper-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('8K Ultra HD wallpaper image downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      alert(`Error capturing 8K image: ${err.message}`);
    } finally {
      setDownloading8K(false);
    }
  };

  // 2. Download Live Video Loop (Recorded from 60fps simulation)
  const handleDownloadLiveVideo = async () => {
    if (!canvasRef.current || recordingVideo) return;

    setRecordingVideo(true);
    setRecordProgress(0);

    try {
      const blob = await canvasRef.current.startRecording(7000, (pct) => {
        setRecordProgress(pct);
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const isMp4 = blob.type.includes('mp4');
      a.download = `black-hole-live-lockscreen-loop-${Date.now()}.${isMp4 ? 'mp4' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('Live video wallpaper loop downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      alert(`Error generating video wallpaper: ${err.message}`);
    } finally {
      setRecordingVideo(false);
    }
  };

  // 3. Download Veo AI Video
  const handleDownloadVeoVideo = () => {
    if (!veoVideoBlobUrl) return;
    const a = document.createElement('a');
    a.href = veoVideoBlobUrl;
    a.download = `black-hole-veo3-ai-wallpaper-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess('Veo 3 AI Video downloaded!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Download 8K Wallpaper & Video</h2>
            <p className="text-xs text-neutral-400">Mobile Lock Screen Optimized (9:16 Portrait Ultra HD)</p>
          </div>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Download Options Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Option 1: 8K Still Image */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">
                  4320 × 7680
                </span>
              </div>
              <h3 className="font-semibold text-sm text-neutral-100">8K Ultra HD Still</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                Crystal clear static lock screen wallpaper with extreme photon ring detail & relativistic warp.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload8KImage}
              disabled={downloading8K}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              {downloading8K ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering 8K Canvas...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download 8K PNG</span>
                </>
              )}
            </button>
          </div>

          {/* Option 2: Live Video Loop */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Film className="w-4 h-4" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                  60 FPS Loop
                </span>
              </div>
              <h3 className="font-semibold text-sm text-neutral-100">Live Video Wallpaper</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                Smooth 60fps moving black hole video loop ready to set as an animated lock screen background.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadLiveVideo}
              disabled={recordingVideo}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              {recordingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Loop ({recordProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Live Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Option 3: Veo 3 Video Download (if available) */}
        {veoVideoBlobUrl && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-neutral-950 border border-purple-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-white">Veo 3 AI Video is Ready</div>
                <div className="text-[10px] text-neutral-400">Synthesized with veo-3.1-fast-generate-preview</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadVeoVideo}
              className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4</span>
            </button>
          </div>
        )}

        {/* Mobile Setup Guide */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>{guideLang === 'bn' ? 'মোবাইলে কীভাবে সেট করবেন?' : 'How to set on Mobile?'}</span>
              </div>

              {/* Language and OS toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuideLang(guideLang === 'bn' ? 'en' : 'bn')}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 font-mono hover:bg-neutral-700"
                >
                  {guideLang === 'bn' ? 'English' : 'বাংলা'}
                </button>
                <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveGuide('android')}
                    className={`px-2 py-0.5 rounded ${activeGuide === 'android' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
                  >
                    Android
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGuide('ios')}
                    className={`px-2 py-0.5 rounded ${activeGuide === 'ios' ? 'bg-neutral-700 text-white' : 'text-neutral-400'}`}
                  >
                    iPhone (iOS)
                  </button>
                </div>
              </div>
            </div>

            {/* Guide Content */}
            {guideLang === 'bn' ? (
              activeGuide === 'android' ? (
                <ol className="list-decimal list-inside text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                  <li>উপরে থাকা <strong>Download Live Video</strong> বা <strong>8K PNG</strong> বাটনে চাপ দিয়ে ফাইলটি নামিয়ে নিন।</li>
                  <li>ফোনের <strong>Gallery</strong> বা <strong>Google Photos</strong>-এ গিয়ে ডাউনলোড করা ভিডিওটি ওপেন করুন।</li>
                  <li>থ্রি-ডট মেনু (⋮) বা <strong>Set as Wallpaper</strong> অপশনে চাপ দিন।</li>
                  <li><strong>Lock screen</strong> বেছে নিন। ভিডিওটি স্বয়ংক্রিয়ভাবে চলমান ব্ল্যাক হোল হিসেবে সেট হয়ে যাবে!</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                  <li><strong>Download 8K PNG</strong> বা <strong>Live Video</strong> ডাউনলোড করুন।</li>
                  <li>iPhone-এর <strong>Settings &gt; Wallpaper &gt; Add New Wallpaper</strong>-এ যান।</li>
                  <li>Photos থেকে ছবিটি বেছে নিন অথবা <em>intoLive</em> অ্যাপ ব্যবহার করে ভিডিওটিকে <em>Live Photo</em> বানিয়ে লক স্ক্রিনে সেট করুন।</li>
                  <li>লক স্ক্রিন অন করলেই চলমান ব্ল্যাক হোলের জীবন্ত আবহ পাবেন!</li>
                </ol>
              )
            ) : (
              activeGuide === 'android' ? (
                <ol className="list-decimal list-inside text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                  <li>Click <strong>Download Live Video</strong> or <strong>8K PNG</strong> above.</li>
                  <li>Open the downloaded file in your phone&apos;s Gallery or Files.</li>
                  <li>Tap the More menu (⋮) and select <strong>Set as wallpaper &gt; Lock screen</strong>.</li>
                  <li>Preview the fluid motion and tap <strong>Set on Lock screen</strong>.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                  <li>Download the <strong>8K PNG</strong> or <strong>Live Video</strong>.</li>
                  <li>Open <strong>Settings &gt; Wallpaper &gt; Add New Wallpaper</strong> on your iPhone.</li>
                  <li>Select the 8K photo or convert the video using a Live Photo converter app to enable motion on press.</li>
                </ol>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
