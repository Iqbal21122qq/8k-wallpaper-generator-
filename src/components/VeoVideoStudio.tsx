import React, { useState, useEffect, useRef } from 'react';
import { AspectRatio, VideoGenerationJob } from '../lib/types';
import { 
  Video, 
  Upload, 
  Sparkles, 
  Download, 
  Loader2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Tv, 
  Info,
  Layers,
  Wand2
} from 'lucide-react';

interface Props {
  uploadedImage: string | null;
  onUploadImage: (base64: string) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ar: AspectRatio) => void;
  onApplyPresetPrompt?: (prompt: string) => void;
}

export const VeoVideoStudio: React.FC<Props> = ({
  uploadedImage,
  onUploadImage,
  aspectRatio,
  onChangeAspectRatio,
}) => {
  const [activeTab, setActiveTab] = useState<'image-to-video' | 'text-to-video'>('image-to-video');
  const [prompt, setPrompt] = useState<string>(
    'Hyper-realistic 8K mobile lock screen wallpaper of a rotating black hole, extreme gravitational lensing warping space, glowing white photon ring, vertical relativistic plasma jet, swirling cosmic clouds, photorealistic 60fps loop'
  );
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [job, setJob] = useState<VideoGenerationJob | null>(null);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Start Video Generation
  const handleGenerateVideo = async () => {
    if (job?.status === 'processing' || job?.status === 'submitting') return;

    if (activeTab === 'image-to-video' && !uploadedImage) {
      alert('Please upload an image first or switch to Text-to-Video generation.');
      return;
    }

    const newJob: VideoGenerationJob = {
      id: Math.random().toString(36).substring(7),
      operationName: '',
      mode: activeTab,
      prompt,
      aspectRatio,
      status: 'submitting',
      progressMessage: 'Initializing Veo 3 neural video synthesis (veo-3.1-fast-generate-preview)...',
      createdAt: Date.now(),
    };
    setJob(newJob);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeTab,
          prompt,
          imageBase64: activeTab === 'image-to-video' ? uploadedImage : undefined,
          aspectRatio,
          resolution,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || 'Failed to start video generation.');
      }

      setJob((prev) => prev ? {
        ...prev,
        operationName: data.operationName,
        status: 'processing',
        progressMessage: 'Simulating gravitational spacetime curvature & relativistic plasma rays...',
      } : null);

      // Start polling
      startPolling(data.operationName);
    } catch (err: any) {
      console.error(err);
      setJob((prev) => prev ? {
        ...prev,
        status: 'failed',
        error: err.message || 'Generation failed',
        progressMessage: 'Error during generation',
      } : null);
    }
  };

  // Poll video status
  const startPolling = (operationName: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    const cosmicStatuses = [
      'Simulating general relativistic accretion physics...',
      'Bending light rays around the event horizon (gravitational lensing)...',
      'Synthesizing Doppler-boosted plasma luminescence...',
      'Rendering ultra-sharp 8K photon ring structures...',
      'Encoding 60fps mobile lock screen MP4 stream...',
      'Finalizing cosmic fluid vortex particles...',
    ];
    let statusIndex = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const data = await res.json();

        if (data.error) {
          clearInterval(pollIntervalRef.current!);
          setJob((prev) => prev ? {
            ...prev,
            status: 'failed',
            error: data.error.message || 'Video generation failed on server',
            progressMessage: 'Generation encountered an error',
          } : null);
          return;
        }

        if (data.done) {
          clearInterval(pollIntervalRef.current!);
          // Fetch video blob for preview
          fetchVideoBlob(operationName);
        } else {
          // Update status message
          statusIndex = (statusIndex + 1) % cosmicStatuses.length;
          setJob((prev) => prev ? {
            ...prev,
            progressMessage: cosmicStatuses[statusIndex],
          } : null);
        }
      } catch (err) {
        console.warn('Status poll retry...', err);
      }
    }, 7000);
  };

  // Fetch video blob
  const fetchVideoBlob = async (operationName: string) => {
    try {
      setJob((prev) => prev ? {
        ...prev,
        progressMessage: 'Downloading synthesized video stream...',
      } : null);

      const res = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!res.ok) throw new Error('Failed to retrieve video stream');

      const blob = await res.blob();
      const videoBlobUrl = URL.createObjectURL(blob);

      setJob((prev) => prev ? {
        ...prev,
        status: 'done',
        videoBlobUrl,
        progressMessage: 'Generation Complete! Ready to preview & download.',
      } : null);
    } catch (err: any) {
      setJob((prev) => prev ? {
        ...prev,
        status: 'failed',
        error: err.message || 'Could not download video',
        progressMessage: 'Download error',
      } : null);
    }
  };

  // Download directly to device
  const handleDownloadMp4 = async () => {
    if (!job?.operationName && !job?.videoBlobUrl) return;

    setDownloading(true);
    try {
      if (job.videoBlobUrl) {
        const a = document.createElement('a');
        a.href = job.videoBlobUrl;
        a.download = `blackhole-8k-live-wallpaper-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await fetch('/api/video-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: job.operationName }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blackhole-8k-live-wallpaper-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      alert('Download error. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const presetPrompts = [
    {
      title: 'Monochrome Singularity (Reference)',
      prompt: 'Mesmerizing black and white 8K black hole with vertical relativistic jet, glowing white photon ring, curved gravitational lensing light warp, deep cosmic star dust, mobile lockscreen 9:16 portrait',
    },
    {
      title: 'Interstellar Gargantua',
      prompt: 'Ultra-realistic supermassive spinning black hole with a flaming golden accretion disk, Einstein gravitational ring bending light above and below, ultra sharp 8K resolution, cinematic camera drift',
    },
    {
      title: 'Cosmic Nebula Collision',
      prompt: 'Hyper-detailed black hole swallowing an ethereal glowing cosmic gas cloud, relativistic Doppler beaming, turbulent swirling plasma vortex, 8K wallpaper',
    },
  ];

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-white shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide">Veo 3 AI Video Generation</h3>
            <p className="text-xs text-neutral-400 font-mono">model: veo-3.1-fast-generate-preview</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('image-to-video')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'image-to-video'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Image-to-Video
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text-to-video')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'text-to-video'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Text-to-Video
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Image to Video Upload Area */}
        {activeTab === 'image-to-video' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
              <span>Source Black Hole Image</span>
              <span className="text-[11px] text-cyan-400">8K Lock Screen Ready</span>
            </label>

            <div className="flex items-center gap-3">
              {uploadedImage ? (
                <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-neutral-700 bg-black flex-shrink-0 group">
                  <img src={uploadedImage} alt="Source" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-white border border-neutral-600"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-28 rounded-xl border-2 border-dashed border-neutral-700 hover:border-cyan-500 bg-neutral-950 flex flex-col items-center justify-center cursor-pointer transition flex-shrink-0 text-center p-2"
                >
                  <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                  <span className="text-[10px] text-neutral-400">Upload Photo</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium border border-neutral-700 flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{uploadedImage ? 'Replace Image' : 'Select or Drop Custom Image'}</span>
                </button>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Upload any photo or celestial black hole capture to turn it into an animated 8K moving wallpaper loop.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aspect Ratio & Resolution selector */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeAspectRatio('9:16')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  aspectRatio === '9:16'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 (Mobile)</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio('16:9')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  aspectRatio === '16:9'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>16:9 (Desktop)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Quality / Resolution
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResolution('720p')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center transition ${
                  resolution === '720p'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                720p Fast
              </button>
              <button
                type="button"
                onClick={() => setResolution('1080p')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center transition ${
                  resolution === '1080p'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                1080p HD
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prompt Directive</span>
            </label>
            <span className="text-[10px] text-neutral-500 font-mono">Veo 3 Engine</span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
            placeholder="Describe the cosmic motion, accretion disk swirl, gravitational lensing, and light warping..."
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presetPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p.prompt)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateVideo}
          disabled={job?.status === 'submitting' || job?.status === 'processing'}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white shadow-lg flex items-center justify-center gap-2 transition"
        >
          {job?.status === 'submitting' || job?.status === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Synthesizing 8K Video with Veo 3...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-cyan-200" />
              <span>Generate 8K Veo Video Wallpaper</span>
            </>
          )}
        </button>

        {/* Job Progress & Preview Area */}
        {job && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Generation Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                job.status === 'done' 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                  : job.status === 'failed'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse'
              }`}>
                {job.status}
              </span>
            </div>

            {/* Status message */}
            <div className="text-xs text-neutral-300 flex items-center gap-2">
              {job.status === 'processing' || job.status === 'submitting' ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
              ) : job.status === 'done' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span className="leading-tight">{job.progressMessage}</span>
            </div>

            {job.error && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[11px] leading-relaxed">
                {job.error}
              </div>
            )}

            {/* Video Player if done */}
            {job.status === 'done' && job.videoBlobUrl && (
              <div className="space-y-3 pt-2">
                <div className={`relative mx-auto rounded-xl overflow-hidden border border-neutral-800 bg-black ${
                  aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'w-full aspect-[16/9]'
                }`}>
                  <video
                    src={job.videoBlobUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Direct Download MP4 button */}
                <button
                  type="button"
                  onClick={handleDownloadMp4}
                  disabled={downloading}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Preparing Download...' : 'Download Veo 3 Video (MP4)'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
