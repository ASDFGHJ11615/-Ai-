import React, { useState } from 'react';
import { BookOpen, Copy, Check, Volume2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer.tsx';

interface StoryCardProps {
  storyOpening: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({ storyOpening }) => {
  const [copied, setCopied] = useState(false);
  const [showAudio, setShowAudio] = useState(true);

  const copyStory = () => {
    navigator.clipboard.writeText(storyOpening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#111827]">
              عالم القصة والفقرة الافتتاحية
            </h3>
            <p className="text-xs text-slate-500">
              فقرة افتتاحية روائية أصلية مستوحاة من الأجواء والمشهد البصري
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAudio(!showAudio)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#4C53DB]" />
            <span>{showAudio ? 'إخفاء الصوت' : 'اقرأ القصة بصوت عالٍ'}</span>
          </button>
          <button
            onClick={copyStory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>نسخ النص</span>
          </button>
        </div>
      </div>

      {showAudio && (
        <AudioPlayer
          textToRead={storyOpening}
          title="قراءة القصة الروائية"
          language="ar"
        />
      )}

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-100 rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <p className="text-sm sm:text-base leading-loose font-serif font-normal italic tracking-wide">
          «{storyOpening}»
        </p>
      </div>
    </div>
  );
};
