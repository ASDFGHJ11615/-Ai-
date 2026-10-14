import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Copy,
  Check,
  Volume2,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';
import { CreativeConcept } from '../types.ts';
import { AudioPlayer } from './AudioPlayer.tsx';

interface ConceptsCardProps {
  concepts: CreativeConcept[];
  onSelectConcept: (concept: CreativeConcept) => void;
}

export const ConceptsCard: React.FC<ConceptsCardProps> = ({
  concepts,
  onSelectConcept,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeAudioConcept, setActiveAudioConcept] = useState<number | null>(null);

  const copyConcept = (c: CreativeConcept, index: number) => {
    const text = `المفهوم: ${c.name}\nالفكرة الإعلانية: ${c.adIdea}\nالرسالة: ${c.message}\nالمشهد البصري: ${c.visualScene}\nسر التميز: ${c.whyUnique}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#111827]">
                المفاهيم الإعلانية المبتكرة ({concepts.length} خيارات غير تقليدية)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              ابتكارات المدير الإبداعي المرتبطة بجوهر المنتج ورسالته بعيداً عن القوالب المكررة
            </p>
          </div>
        </div>
      </div>

      {/* Audio player if concept selected */}
      {activeAudioConcept !== null && concepts[activeAudioConcept] && (
        <AudioPlayer
          textToRead={`مفهوم ${concepts[activeAudioConcept].name}. الفكرة الإعلانية: ${concepts[activeAudioConcept].adIdea}. الرسالة: ${concepts[activeAudioConcept].message}. المشهد البصري: ${concepts[activeAudioConcept].visualScene}. سر التميز: ${concepts[activeAudioConcept].whyUnique}`}
          title={`قراءة مفهوم: ${concepts[activeAudioConcept].name}`}
          language="ar"
        />
      )}

      {/* Concepts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {concepts.map((concept, idx) => {
          const isRec = concept.isRecommended;
          return (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 relative ${
                isRec
                  ? 'bg-gradient-to-b from-[#4C53DB]/5 via-white to-white border-[#4C53DB] shadow-md ring-2 ring-[#4C53DB]/15'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-3">
                {isRec ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#4C53DB] text-white shadow-xs">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>المفهوم الموصى به (الأقوى)</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    مفهوم بديل {idx + 1}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveAudioConcept(activeAudioConcept === idx ? null : idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#4C53DB] hover:bg-slate-100 transition"
                    title="استمع للمفهوم"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => copyConcept(concept, idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    title="نسخ المفهوم"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title & Core Details */}
              <div className="space-y-3 mb-4">
                <h4 className="text-base font-extrabold text-[#111827] leading-snug">
                  {concept.name}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">
                      الفكرة الإعلانية:
                    </span>
                    <p className="text-slate-800 font-semibold leading-relaxed">
                      {concept.adIdea}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">
                      الرسالة التي يوصلها:
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {concept.message}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                    <span className="font-bold text-slate-800 block mb-1">
                      التصور البصري للمشهد:
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {concept.visualScene}
                    </p>
                  </div>

                  <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-200/60">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      لماذا يتميز عن الإعلانات التقليدية؟
                    </span>
                    <p className="text-amber-800 font-medium leading-relaxed">
                      {concept.whyUnique}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom selection action */}
              <button
                onClick={() => onSelectConcept(concept)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  isRec
                    ? 'bg-[#4C53DB] hover:bg-[#434ac9] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>اعتمد هذا المفهوم للبرومبت</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
