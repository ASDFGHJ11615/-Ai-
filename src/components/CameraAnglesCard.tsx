import React, { useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Sliders,
  Layers,
  Wand2,
  Eye,
  Info,
  Maximize2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { CameraAngleId, CameraAngleOption } from '../types.ts';
import {
  CAMERA_ANGLE_CATEGORIES,
  AUTO_CAMERA_ANGLE,
  getCameraAngleById,
} from '../data/cameraAngles.ts';

interface CameraAnglesCardProps {
  selectedAngleId: CameraAngleId;
  onSelectAngle: (angleId: CameraAngleId) => void;
  onApplyToPrompt?: (snippet: string, arSnippet: string) => void;
  isCompact?: boolean;
  language?: 'ar' | 'en';
}

export const CameraAnglesCard: React.FC<CameraAnglesCardProps> = ({
  selectedAngleId,
  onSelectAngle,
  onApplyToPrompt,
  isCompact = false,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const currentAngle = getCameraAngleById(selectedAngleId);

  // Manage open/close state for each of the 6 categories (Accordion behavior)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    // By default, open the category containing the selected angle, or the first category if 'auto'
    const initial: Record<string, boolean> = {
      basic: true,
      high_low: false,
      three_quarter_variants: false,
      closeups: false,
      wide_perspective: false,
      creative: false,
    };

    if (selectedAngleId !== 'auto') {
      const activeCat = CAMERA_ANGLE_CATEGORIES.find((cat) =>
        cat.angles.some((a) => a.id === selectedAngleId)
      );
      if (activeCat) {
        initial[activeCat.id] = true;
      }
    }

    return initial;
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    CAMERA_ANGLE_CATEGORIES.forEach((cat) => {
      allOpen[cat.id] = true;
    });
    setOpenCategories(allOpen);
  };

  const handleCollapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    CAMERA_ANGLE_CATEGORIES.forEach((cat) => {
      allClosed[cat.id] = false;
    });
    setOpenCategories(allClosed);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold shadow-xs">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                {isAr ? 'زوايا التصوير والمنظور البصري' : 'Camera Angles & Perspectives'}
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4C53DB] border border-indigo-200/80">
                {isAr ? '6 فئات منظمة + خيار تلقائي' : '6 Categories + Auto AI'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {isAr
                ? 'تحديد زاوية الكاميرا ومنظور الالتقاط لربطها بالبرومبت النهائي ووصف الكاميرا والتكوين'
                : 'Define camera angle and viewpoint to bind directly to final prompt composition & camera breakdown'}
            </p>
          </div>
        </div>

        {/* Top Control Badges & Expand/Collapse */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 font-bold flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">{isAr ? 'الزاوية الحالية:' : 'Active:'}</span>
            <span className="text-[#4C53DB] font-extrabold">{currentAngle.nameAr}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              {isAr ? 'فتح الكل' : 'Expand All'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              {isAr ? 'طي الكل' : 'Collapse All'}
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Option: «تلقائي» (Auto AI Selection) */}
      <div
        onClick={() => onSelectAngle('auto')}
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
          selectedAngleId === 'auto'
            ? 'bg-gradient-to-r from-[#4C53DB]/8 via-purple-500/5 to-transparent border-[#4C53DB] ring-2 ring-[#4C53DB]/20 shadow-xs'
            : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 transition ${
                selectedAngleId === 'auto'
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-black text-[#111827]">
                  {AUTO_CAMERA_ANGLE.nameAr}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  ({AUTO_CAMERA_ANGLE.nameEn})
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {isAr ? 'الخيار الذكي الموصى به' : 'Recommended Smart Option'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {isAr
                  ? 'عند اختيار «تلقائي»، يحلل الذكاء الاصطناعي هوية المنتج وطبيعته (زجاج، عطور، ساعات، أطعمة...) ويحدد الزاوية الأكثر جاذبية وتأثيراً للمشهد الإعلاني تلقائياً.'
                  : 'When selecting Auto, AI detects product aesthetics and automatically selects the most compelling perspective for maximum advertising appeal.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                selectedAngleId === 'auto'
                  ? 'border-accent bg-accent text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedAngleId === 'auto' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Categorized Accordion Sections */}
      <div className="space-y-3.5">
        {CAMERA_ANGLE_CATEGORIES.map((cat) => {
          const isOpen = Boolean(openCategories[cat.id]);
          const containsSelected = cat.angles.some((a) => a.id === selectedAngleId);

          return (
            <div
              key={cat.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                containsSelected
                  ? 'border-[#4C53DB]/50 shadow-2xs'
                  : 'border-slate-200/80 bg-white'
              }`}
            >
              {/* Accordion Header (Click to Open / Close) */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`w-full p-3.5 sm:p-4 flex items-center justify-between text-start transition cursor-pointer select-none ${
                  isOpen
                    ? 'bg-slate-50/90 border-b border-slate-200/70'
                    : 'bg-white hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      containsSelected
                        ? 'bg-accent text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.number}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#111827]">
                        {cat.titleAr}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({cat.titleEn})
                      </span>
                      {containsSelected && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-[#4C53DB] border border-indigo-200">
                          {isAr ? 'زاوية مختارة هنا' : 'Active angle here'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                    {cat.angles.length} {isAr ? 'زوايا' : 'angles'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100/70 flex items-center justify-center text-slate-600">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Content (List of Angles in Category) */}
              {isOpen && (
                <div className="p-3.5 sm:p-4 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  {cat.angles.map((angle) => {
                    const isSelected = selectedAngleId === angle.id;

                    return (
                      <div
                        key={angle.id}
                        onClick={() => onSelectAngle(angle.id)}
                        className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between text-start relative group ${
                          isSelected
                            ? 'bg-[#4C53DB]/5 border-[#4C53DB] ring-2 ring-[#4C53DB]/20 shadow-2xs'
                            : 'bg-slate-50/50 border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-2xs'
                        }`}
                      >
                        {/* Top: Name & Radio Button */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-black text-[#111827]">
                                {angle.nameAr}
                              </h4>
                              <span className="text-[11px] text-slate-500 font-mono font-medium">
                                ({angle.nameEn})
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition ${
                              isSelected
                                ? 'border-accent bg-accent text-white'
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed mb-2.5">
                          {angle.descriptionAr}
                        </p>

                        {/* Prompt Snippet Chip */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                          <span className="font-mono text-slate-400 truncate max-w-[200px]" dir="ltr">
                            {angle.nameEn}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-black text-[#4C53DB]">
                              {isAr ? 'مُعتمدة للبرومبت ✓' : 'Applied ✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Angle Prompt Summary & Action */}
      {selectedAngleId !== 'auto' && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  {isAr ? 'الزاوية المربوطة حالياً بالبرومبت النهائي والتكوين:' : 'Active Bound Camera Angle:'}
                </span>
                <span className="text-sm font-black text-white">
                  {currentAngle.nameAr} ({currentAngle.nameEn})
                </span>
              </div>
            </div>

            {onApplyToPrompt && (
              <button
                type="button"
                onClick={() =>
                  onApplyToPrompt(currentAngle.promptSnippet, currentAngle.compositionSnippet)
                }
                className="px-3.5 py-1.5 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تطبيق الزاوية على البرومبت الحالي' : 'Apply Angle to Prompt'}</span>
              </button>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed" dir="ltr">
            <span className="text-amber-400 font-bold block mb-1" dir="rtl">
              {isAr ? 'صيغة الكاميرا المطبقة في البرومبت (Prompt Instruction):' : 'Applied Camera Prompt Snippet:'}
            </span>
            Camera Angle & Perspective: {currentAngle.promptSnippet}
          </div>
        </div>
      )}
    </div>
  );
};
