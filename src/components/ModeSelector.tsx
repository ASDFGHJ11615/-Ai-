import React from 'react';
import {
  Wand2,
  Scan,
  FileCode2,
  Sparkles,
  Package,
  Layers,
  PenTool,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { CreativeMode } from '../types.ts';
import { WORK_MODES } from '../data/presets.ts';

interface ModeSelectorProps {
  currentMode: CreativeMode;
  onSelectMode: (mode: CreativeMode) => void;
  language?: 'ar' | 'en';
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Wand2: <Wand2 className="w-3.5 h-3.5" />,
  Scan: <Scan className="w-3.5 h-3.5" />,
  FileCode2: <FileCode2 className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Package: <Package className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
  PenTool: <PenTool className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  HelpCircle: <HelpCircle className="w-3.5 h-3.5" />,
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-700 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{isAr ? 'أوضاع العمل الإبداعية المتخصصة' : 'Creative Studio Work Modes'}</span>
        </span>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {isAr ? 'اختر المهمة لضبط هندسة البرومبت والمخرجات بدقة' : 'Select a mode to tailor prompts and outputs'}
        </span>
      </div>

      {/* Horizontal smooth scrolling bar on mobile, crisp responsive grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        {WORK_MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`group flex-shrink-0 sm:flex-shrink flex flex-col items-start p-2.5 sm:p-3 rounded-2xl border text-start transition-all duration-200 cursor-pointer min-w-[130px] sm:min-w-0 relative overflow-hidden ${
                isActive
                  ? 'bg-white border-accent shadow-xs ring-2 ring-accent/20'
                  : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-700'
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-accent" />
              )}

              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-accent text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-accent-light group-hover:text-accent'
                  }`}
                >
                  {ICONS_MAP[mode.icon]}
                </div>
                {mode.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-accent-light text-accent'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {mode.badge}
                  </span>
                )}
              </div>

              <div className="w-full">
                <h4
                  className={`text-xs font-bold leading-tight line-clamp-1 ${
                    isActive ? 'text-[#111827]' : 'text-slate-800'
                  }`}
                >
                  {mode.title}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                  {mode.shortDesc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
