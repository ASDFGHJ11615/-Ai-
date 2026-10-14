import React from 'react';
import {
  Sparkles,
  Palette,
  ScanEye,
  Terminal,
  Lightbulb,
  Users,
  Check,
  ChevronRight,
} from 'lucide-react';
import { PersonaInfo } from '../types.ts';
import { PERSONAS } from '../data/presets.ts';

interface CreativeTeamBarProps {
  activePersonaFocus: string | null;
  onSelectPersonaFocus: (id: string | null) => void;
  language?: 'ar' | 'en';
}

const PERSONA_ICONS: Record<string, React.ReactNode> = {
  director: <Sparkles className="w-4 h-4 text-indigo-500" />,
  art_director: <Palette className="w-4 h-4 text-violet-500" />,
  analyst: <ScanEye className="w-4 h-4 text-emerald-500" />,
  prompt_engineer: <Terminal className="w-4 h-4 text-amber-500" />,
  consultant: <Lightbulb className="w-4 h-4 text-sky-500" />,
};

export const CreativeTeamBar: React.FC<CreativeTeamBarProps> = ({
  activePersonaFocus,
  onSelectPersonaFocus,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-light text-accent flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#111827]">
                {isAr ? 'فريق العمل الإبداعي المتخصص' : 'Specialized Creative Team'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-light text-accent border border-accent/20">
                {activePersonaFocus === null
                  ? (isAr ? 'فريق متكامل (5 خبراء)' : 'Full Team (5 Experts)')
                  : (isAr ? 'تركيز موجه' : 'Focused Role')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isAr
                ? 'انقر لتوجيه تركيز الوكيل نحو خبير محدد، أو اتركها لفريق العمل المتكامل'
                : 'Click to direct the agent focus to a specific expert, or keep all roles active'}
            </p>
          </div>
        </div>

        {/* Quick Reset to All */}
        {activePersonaFocus !== null && (
          <button
            onClick={() => onSelectPersonaFocus(null)}
            className="self-start sm:self-auto text-xs font-bold text-accent hover:underline flex items-center gap-1 transition cursor-pointer"
          >
            <span>{isAr ? 'إعادة تعيين لكامل الفريق' : 'Reset to Full Team'}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Responsive Horizontal Grid of Personas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Full Team Option */}
        <button
          onClick={() => onSelectPersonaFocus(null)}
          className={`flex flex-col items-start p-2.5 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden ${
            activePersonaFocus === null
              ? 'bg-accent-light/50 border-accent shadow-2xs ring-1 ring-accent/30'
              : 'bg-slate-50/70 hover:bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="w-6 h-6 rounded-md bg-accent text-white flex items-center justify-center shadow-2xs">
              <Users className="w-3.5 h-3.5" />
            </div>
            {activePersonaFocus === null && (
              <span className="text-[9px] font-extrabold text-accent bg-white px-1.5 py-0.5 rounded-md border border-accent/20">
                {isAr ? 'الافتراضي' : 'Default'}
              </span>
            )}
          </div>
          <span className="text-xs font-black text-[#111827] line-clamp-1">
            {isAr ? 'فريق متكامل' : 'Full Team'}
          </span>
          <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
            {isAr ? 'تعاون جماعي يجمع الرؤية والتكوين والبرومبت' : 'All 5 creative personas collaborating'}
          </span>
        </button>

        {/* 5 Individual Personas */}
        {PERSONAS.map((persona) => {
          const isSelected = activePersonaFocus === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersonaFocus(persona.id)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-start transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-accent-light/50 border-accent shadow-2xs ring-1 ring-accent/30'
                  : 'bg-slate-50/70 hover:bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {PERSONA_ICONS[persona.id] || <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-accent text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-xs font-black text-[#111827] line-clamp-1">
                {persona.name}
              </span>
              <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                {persona.role}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
