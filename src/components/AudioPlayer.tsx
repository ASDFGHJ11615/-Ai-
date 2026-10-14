import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RefreshCw,
  AlertCircle,
  Radio,
  Sliders,
} from 'lucide-react';

interface AudioPlayerProps {
  textToRead: string;
  title?: string;
  language?: 'ar' | 'en';
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToRead,
  title = 'القراءة الصوتية الإبداعية',
  language = 'ar',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voice, setVoice] = useState('Kore');
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Cleanup on unmount or when text changes
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [textToRead]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handleFetchAndPlay = async () => {
    if (!textToRead) return;

    setError(null);

    // If audio already loaded and just paused, resume it
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // If already playing, toggle pause
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
        return;
      } else if (window.speechSynthesis) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
        setIsPaused(true);
        return;
      }
    }

    // Otherwise, generate audio from Gemini TTS
    setIsLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRead,
          voice,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.audioBase64) {
        throw new Error(json.error || 'فشل في استلام الصوت من محرك الذكاء الاصطناعي');
      }

      // Convert base64 WAV to Blob URL
      const byteCharacters = atob(json.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: json.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        throw new Error('حدث خطأ أثناء تشغيل الملف الصوتي');
      };

      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      setUsingFallback(false);
    } catch (err: any) {
      console.warn('Gemini TTS failed, activating Web Speech API fallback:', err);
      // Graceful fallback to Web Speech API
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;

          utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            setUsingFallback(true);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
          };

          utterance.onerror = (e) => {
            setError('تعذر تشغيل الصوت حتى عبر المحرك المحلي المتصفح.');
            setIsPlaying(false);
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (synthErr: any) {
          setError(err.message || 'تعذر تشغيل الصوت');
        }
      } else {
        setError(err.message || 'خدمة النطق الصوتي غير متاحة حالياً');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    } else if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
    setIsPaused(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title and Voice selector */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4C53DB]/20 border border-[#4C53DB]/40 flex items-center justify-center text-[#A78BFA] shrink-0">
            {isPlaying ? (
              <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">{title}</span>
              {usingFallback && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-medium border border-amber-500/30">
                  صوت محلي احتياطي
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              بصوت الذكاء الاصطناعي التعبيري (Gemini TTS)
            </p>
          </div>
        </div>

        {/* Voice Select & Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Voice selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl text-xs text-slate-300 border border-slate-700">
            <Sliders className="w-3 h-3 text-slate-400" />
            <select
              aria-label="اختيار الصوت"
              value={voice}
              onChange={(e) => {
                setVoice(e.target.value);
                stopAudio();
              }}
              disabled={isPlaying}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Kore" className="bg-slate-900 text-white">صوت Kore (هادئ ووقور)</option>
              <option value="Zephyr" className="bg-slate-900 text-white">صوت Zephyr (عميق ومسرحي)</option>
              <option value="Puck" className="bg-slate-900 text-white">صوت Puck (حيوي ومشرق)</option>
              <option value="Fenrir" className="bg-slate-900 text-white">صوت Fenrir (واثق وقوي)</option>
            </select>
          </div>

          {/* Action buttons */}
          <button
            onClick={isPlaying ? handlePause : handleFetchAndPlay}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4C53DB] hover:bg-[#434ac9] text-white text-xs font-bold transition shadow-md shadow-[#4C53DB]/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>جاري تحضير الصوت...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>إيقاف مؤقت</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>استكمال</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>اقرأ بصوت عالٍ</span>
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              onClick={stopAudio}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition"
              title="إيقاف كلي"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Waveform indicator */}
      {(isPlaying || isPaused || duration > 0) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-3">
          <span className="text-[10px] text-slate-400 tabular-nums">
            {formatTime(currentTime)}
          </span>

          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-[#4C53DB] to-[#A78BFA] h-full rounded-full transition-all duration-150"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '50%',
              }}
            />
          </div>

          <span className="text-[10px] text-slate-400 tabular-nums">
            {formatTime(duration)}
          </span>

          {/* Animated sound bars */}
          {isPlaying && (
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-[#A78BFA] animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-3 bg-[#4C53DB] animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-1.5 bg-[#A78BFA] animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-2.5 bg-emerald-400 animate-bounce [animation-delay:100ms]" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 p-2 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
