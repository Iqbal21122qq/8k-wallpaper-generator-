import React, { useState } from 'react';
import { Brain, Sparkles, Send, Loader2, BookOpen, Wand2, Check, ArrowRight } from 'lucide-react';

interface Props {
  onApplyPrompt?: (prompt: string) => void;
}

export const GeminiThinkingPanel: React.FC<Props> = ({ onApplyPrompt }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const presetQuestions = [
    {
      label: '8K Wallpaper Prompt Architect',
      prompt: 'Architect an ultra-unique, eye-catching 8K black hole mobile lock screen wallpaper prompt for Veo 3 with relativistic accretion vortex, glowing photon ring, and stark monochrome cosmic dust.',
    },
    {
      label: 'Relativistic Doppler Physics',
      prompt: 'Explain why one side of the accretion disk looks much brighter (relativistic Doppler beaming) and how gravitational lensing curves light from behind the black hole.',
    },
    {
      label: 'How to set Video Wallpaper on Android/iOS',
      prompt: 'Provide concise instructions on how to set a downloaded 8K MP4 video or 8K image as a live lock screen wallpaper on Android and iPhone iOS.',
    },
    {
      label: 'Bengali Setup Guide',
      prompt: 'Provide complete instructions in clear Bengali on how to set this 8K moving black hole video as an animated lock screen wallpaper on Android and iOS.',
    },
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    setApplied(false);

    try {
      const res = await fetch('/api/gemini/think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode: 'prompt_architect',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reason with gemini-4-argon');
      }

      setResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setResponse(`Error executing high thinking query: ${err.message || 'Server error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Extract prompt section if available
  const extractPrompt = (text: string): string | null => {
    const match = text.match(/OPTIMIZED VEO 3 VIDEO PROMPT[:\s*]*([\s\S]+?)(?:$|\n\n[A-Z])/i);
    if (match && match[1]) {
      return match[1].replace(/["`]/g, '').trim();
    }
    return null;
  };

  const detectedPrompt = response ? extractPrompt(response) : null;

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 text-white shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-lg">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm tracking-wide">Cosmic Intelligence & Physics Engine</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                gemini-4-argon
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">ThinkingLevel: HIGH • Deep Astrophysics Reasoning</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Quick query chips */}
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(q.prompt);
                handleSend(q.prompt);
              }}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition flex items-center gap-1.5 text-left"
            >
              <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
            placeholder="Ask about general relativity, accretion disk physics, or request 8K wallpaper styling advice..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none font-sans pr-12"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="absolute right-2.5 bottom-3.5 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition shadow-md"
            title="Reason with Gemini 4 Argon"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* Thinking indicator */}
        {loading && (
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 flex items-center gap-3 text-xs text-purple-200">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <div className="space-y-0.5">
              <div className="font-semibold tracking-wide">Gemini 4 Argon High Thinking in progress...</div>
              <div className="text-[11px] text-purple-300/80">
                Reasoning through general relativity, gravitational lensing mathematics, photon geodesics, and 8K visual synthesis...
              </div>
            </div>
          </div>
        )}

        {/* Response Box */}
        {response && (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
              <span className="font-mono text-purple-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Deep Reasoning Output</span>
              </span>
              <span className="text-[10px]">ThinkingLevel.HIGH</span>
            </div>

            <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans max-h-72 overflow-y-auto pr-1">
              {response}
            </div>

            {/* Quick Action: Apply extracted prompt */}
            {detectedPrompt && onApplyPrompt && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyPrompt(detectedPrompt);
                    setApplied(true);
                    setTimeout(() => setApplied(false), 3000);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-medium text-white flex items-center justify-center gap-2 shadow-md transition"
                >
                  {applied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Applied to Veo 3 Studio!</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Apply Optimized 8K Prompt to Veo 3</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
