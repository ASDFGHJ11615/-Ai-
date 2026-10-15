import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Copy,
  Check,
  ArrowRight,
  Target,
  Zap,
  RefreshCw,
  Palette,
  Sun,
  Camera,
  Layers,
  AlertCircle,
  Edit3,
  Sliders,
  CheckCircle2,
  Wand2,
  ExternalLink,
} from 'lucide-react';
import { AdvertisingDirection, BrandKit, FramingSettings, CinematicLightingSettings, TargetTool, CameraAngleId } from '../types.ts';

const SELECTED_DIRECTION_STORAGE_KEY = 'creative_studio_selected_direction_id';

interface AdvertisingDirectionsCardProps {
  directions: AdvertisingDirection[];
  referenceImage?: { data: string; mimeType: string; name?: string } | null;
  activeBrand?: BrandKit | null;
  framingSettings?: FramingSettings;
  lightingSettings?: CinematicLightingSettings;
  cameraAngle?: CameraAngleId;
  targetTool?: TargetTool;
  onApplyPromptToStudio?: (prompt: string, tool: TargetTool, ratio?: string) => void;
  language?: 'ar' | 'en';
}

interface DevelopedPromptResult {
  title: string;
  directionId: string;
  targetTool: string;
  englishPrompt: string;
  arabicPrompt?: string;
  aspectRatio?: string;
  parameters?: string;
  negativePrompt?: string;
  breakdown?: {
    subject?: string;
    environment?: string;
    lighting?: string;
    composition?: string;
    materials?: string;
  };
}

export const AdvertisingDirectionsCard: React.FC<AdvertisingDirectionsCardProps> = ({
  directions,
  referenceImage,
  activeBrand,
  framingSettings,
  lightingSettings,
  cameraAngle = 'auto',
  targetTool = 'midjourney',
  onApplyPromptToStudio,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  // Restore previous user selection from localStorage or pick the best candidate
  const [selectedId, setSelectedId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SELECTED_DIRECTION_STORAGE_KEY);
      if (saved && directions.some((d) => d.id === saved)) {
        return saved;
      }
    } catch (e) {}
    const best = directions.find((d) => d.isBestCandidate);
    return best ? best.id : directions[0]?.id || '';
  });

  // Loading, error, and development states
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [developmentError, setDevelopmentError] = useState<string | null>(null);
  const [developedPrompt, setDevelopedPrompt] = useState<DevelopedPromptResult | null>(null);
  const [editablePromptText, setEditablePromptText] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedIdeaIndex, setCopiedIdeaIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'breakdown' | 'arabic'>('prompt');

  // Sync selectedId with storage
  useEffect(() => {
    if (selectedId) {
      try {
        localStorage.setItem(SELECTED_DIRECTION_STORAGE_KEY, selectedId);
      } catch (e) {}
    }
  }, [selectedId]);

  // Select Direction Handler
  const handleSelectDirection = (id: string) => {
    setSelectedId(id);
    // If a prompt was previously developed for a different direction, clear error
    if (developmentError) {
      setDevelopmentError(null);
    }
  };

  // Develop Direction into Professional Prompt
  const handleDevelopPrompt = async (directionToDevelop?: AdvertisingDirection) => {
    // Prevent duplicate rapid calls
    if (isDeveloping) return;

    const targetDirection =
      directionToDevelop || directions.find((d) => d.id === selectedId) || directions[0];

    if (!targetDirection) return;

    setIsDeveloping(true);
    setDevelopmentError(null);

    try {
      const response = await fetch('/api/creative/develop-direction-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: targetDirection,
          image: referenceImage ? referenceImage.data : undefined,
          brandKit: activeBrand || undefined,
          framingSettings: framingSettings || undefined,
          lightingSettings: lightingSettings || undefined,
          cameraAngle: cameraAngle || 'auto',
          targetTool,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.promptData) {
        throw new Error(data.error || 'تعذر تطوير الاتجاه الإعلاني إلى برومبت.');
      }

      setDevelopedPrompt(data.promptData);
      setEditablePromptText(data.promptData.englishPrompt || '');
      setSelectedId(targetDirection.id);

      // Smooth scroll to developed prompt area
      setTimeout(() => {
        const el = document.getElementById('developed-direction-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Error developing direction prompt:', err);
      setDevelopmentError(
        err.message || 'فشل في استكمال تطوير البرومبت. يرجى إعادة المحاولة.'
      );
    } finally {
      setIsDeveloping(false);
    }
  };

  const handleCopyPrompt = () => {
    const textToCopy = editablePromptText || developedPrompt?.englishPrompt || '';
    if (!textToCopy) return;

    let fullWithParams = textToCopy;
    if (developedPrompt?.parameters && !textToCopy.includes(developedPrompt.parameters)) {
      fullWithParams = `${textToCopy} ${developedPrompt.parameters}`.trim();
    }

    navigator.clipboard.writeText(fullWithParams);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCardDetails = (dir: AdvertisingDirection, index: number) => {
    const text = `[اتجاه إعلاني: ${dir.title}]
1. الفكرة الإبداعية: ${dir.creativeIdea}
2. التصور البصري: ${dir.visualConception}
3. النمط: ${dir.style}
4. الإضاءة والألوان: ${dir.lightingAndColors}`;

    navigator.clipboard.writeText(text);
    setCopiedIdeaIndex(index);
    setTimeout(() => setCopiedIdeaIndex(null), 2000);
  };

  const selectedDirectionObj = directions.find((d) => d.id === selectedId) || directions[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold shadow-xs">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                {isAr ? 'اتجاهات إعلانية مقترحة' : 'Suggested Advertising Directions'}
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4C53DB] border border-indigo-200/80">
                {isAr ? '3 أفكار مخصصة لصورة المنتج المرجعية' : '3 Tailored Reference Concepts'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {isAr
                ? 'مفاهيم إعلانية مبتكرة مخصصة للمنتج، مع تحديد المرشح الأفضل وإمكانية التطوير لبرومبت مباشر'
                : 'Creative concepts tailored to your product photo with a top candidate highlight & prompt conversion'}
            </p>
          </div>
        </div>

        {/* Global CTA button for currently active idea */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            disabled={isDeveloping}
            onClick={() => handleDevelopPrompt(selectedDirectionObj)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:opacity-95 text-white text-xs font-black shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeveloping ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'جاري التطوير بالذكاء الاصطناعي...' : 'Developing with AI...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تطوير الفكرة المحددة لبرومبت' : 'Develop Selected to Prompt'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Directions Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {directions.map((direction, idx) => {
          const isSelected = selectedId === direction.id;
          const isBest = direction.isBestCandidate;

          return (
            <div
              key={direction.id || idx}
              onClick={() => handleSelectDirection(direction.id)}
              className={`flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-gradient-to-b from-[#4C53DB]/6 via-white to-white border-[#4C53DB] shadow-md ring-2 ring-[#4C53DB]/25 -translate-y-0.5'
                  : isBest
                  ? 'bg-amber-50/20 border-amber-300 hover:border-[#4C53DB]/60 hover:shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Card Header & Badges */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isBest ? (
                    <span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المرشح الأفضل (الأعلى تأثيراً)' : 'Best Candidate (Top Pick)'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {isAr ? `اتجاه بديل ${idx + 1}` : `Direction ${idx + 1}`}
                    </span>
                  )}

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'محدد حالياً' : 'Selected'}</span>
                    </span>
                  )}
                </div>

                {/* Quick Copy Card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCardDetails(direction, idx);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title={isAr ? 'نسخ تفاصيل هذا الاتجاه' : 'Copy details'}
                >
                  {copiedIdeaIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title */}
              <div className="space-y-3.5 mb-5">
                <h4 className="text-base font-black text-[#111827] leading-snug">
                  {direction.title}
                </h4>

                {/* 1. الفكرة الإبداعية */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#4C53DB] mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isAr ? '1. الفكرة الإبداعية (Creative Idea):' : '1. Creative Idea:'}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {direction.creativeIdea}
                  </p>
                </div>

                {/* 2. التصور البصري */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-black text-violet-700 mb-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isAr ? '2. التصور البصري (Visual Conception):' : '2. Visual Conception:'}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {direction.visualConception}
                  </p>
                </div>

                {/* 3. النمط & 4. الإضاءة والألوان */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* النمط */}
                  <div className="bg-slate-50/60 rounded-xl p-2.5 border border-slate-200/50">
                    <div className="flex items-center gap-1 font-bold text-slate-500 text-[11px] mb-0.5">
                      <Layers className="w-3 h-3 text-[#4C53DB]" />
                      <span>{isAr ? '3. النمط:' : '3. Style:'}</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-[11.5px] leading-snug">
                      {direction.style}
                    </p>
                  </div>

                  {/* الإضاءة والألوان */}
                  <div className="bg-slate-50/60 rounded-xl p-2.5 border border-slate-200/50">
                    <div className="flex items-center gap-1 font-bold text-slate-500 text-[11px] mb-0.5">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>{isAr ? '4. الإضاءة والألوان:' : '4. Lighting & Colors:'}</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-[11.5px] leading-snug">
                      {direction.lightingAndColors}
                    </p>
                  </div>
                </div>

                {/* Why Best Badge if candidate */}
                {direction.reasonForBest && (
                  <div className="bg-amber-50/90 rounded-xl p-2.5 border border-amber-200 text-[11px] text-amber-900 font-medium">
                    <span className="font-extrabold block text-amber-800 mb-0.5">
                      {isAr ? '✨ سر ترشيح هذا الاتجاه كأفضل فكرة:' : '✨ Why this is the top candidate:'}
                    </span>
                    {direction.reasonForBest}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {/* 1. اختيار الفكرة */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDirection(direction.id);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الفكرة المختارة' : 'Selected'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'اختيار الفكرة' : 'Select Concept'}</span>
                  )}
                </button>

                {/* 2. تطوير إلى برومبت */}
                <button
                  type="button"
                  disabled={isDeveloping}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDirection(direction.id);
                    handleDevelopPrompt(direction);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#4C53DB] hover:bg-[#3D42B0] text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تطوير إلى برومبت' : 'Develop to Prompt'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading Feedback State */}
      {isDeveloping && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-[#4C53DB]/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-xl bg-[#4C53DB] text-white flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs sm:text-sm font-black text-[#111827]">
              {isAr
                ? 'جاري تطوير الفكرة المحددة وصورة المنتج إلى برومبت احترافي...'
                : 'Developing selected direction and reference product into a professional prompt...'}
            </h5>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              {isAr
                ? 'مهندس البرومبتات والمخرج الفني يحللان تكامل المنتج مع الإضاءة، الكاميرا، والأبعاد بدقة...'
                : 'Synthesizing commercial product fidelity with camera lens, lighting parameters & style...'}
            </p>
          </div>
        </div>
      )}

      {/* Error Feedback with Retry Option */}
      {developmentError && !isDeveloping && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 text-rose-900 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <h5 className="font-extrabold text-rose-800">
                {isAr ? 'تعذر إتمام تطوير البرومبت:' : 'Prompt development error:'}
              </h5>
              <p className="font-medium text-rose-700">{developmentError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDevelopPrompt()}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* Developed Prompt Result Showcase */}
      {developedPrompt && !isDeveloping && (
        <div
          id="developed-direction-result"
          className="bg-slate-900 text-slate-100 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-4 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-white">
                    {developedPrompt.title || (isAr ? 'البرومبت الاحترافي المطور' : 'Developed Prompt')}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {developedPrompt.targetTool.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isAr
                    ? 'جاهز للنسخ المباشر أو التعديل الفوري لمطابقة رؤيتك'
                    : 'Ready to copy or customize directly for your workflow'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
                  </>
                )}
              </button>

              {onApplyPromptToStudio && (
                <button
                  type="button"
                  onClick={() =>
                    onApplyPromptToStudio(
                      editablePromptText || developedPrompt.englishPrompt,
                      (developedPrompt.targetTool as TargetTool) || targetTool,
                      developedPrompt.aspectRatio
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اعتماده في الاستوديو الرئيسي' : 'Use in Main Studio'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Prompt / Breakdown / Arabic) */}
          <div className="flex items-center gap-2 text-xs border-b border-slate-800/80 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeTab === 'prompt'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isAr ? 'البرومبت الإنجليزي (قابل للتحرير)' : 'English Prompt (Editable)'}
            </button>
            {developedPrompt.breakdown && (
              <button
                type="button"
                onClick={() => setActiveTab('breakdown')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'breakdown'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'تشريح العناصر (Breakdown)' : 'Prompt Breakdown'}
              </button>
            )}
            {developedPrompt.arabicPrompt && (
              <button
                type="button"
                onClick={() => setActiveTab('arabic')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'arabic'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isAr ? 'الشرح العربي للمصمم' : 'Arabic Designer Notes'}
              </button>
            )}
          </div>

          {/* Tab 1: Editable English Prompt */}
          {activeTab === 'prompt' && (
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={editablePromptText}
                  onChange={(e) => setEditablePromptText(e.target.value)}
                  dir="ltr"
                  rows={4}
                  className="w-full bg-slate-950 text-slate-100 rounded-xl p-3.5 text-xs sm:text-sm font-mono border border-slate-700/80 focus:outline-hidden focus:border-accent resize-y leading-relaxed"
                  placeholder="English prompt text..."
                />
              </div>

              {developedPrompt.parameters && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">{isAr ? 'البارامترات:' : 'Params:'}</span>
                  <span>{developedPrompt.parameters}</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Breakdown */}
          {activeTab === 'breakdown' && developedPrompt.breakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              {developedPrompt.breakdown.subject && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-[#A78BFA] block mb-0.5">{isAr ? 'الموضوع والمنتج:' : 'Subject:'}</span>
                  <p>{developedPrompt.breakdown.subject}</p>
                </div>
              )}
              {developedPrompt.breakdown.environment && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">{isAr ? 'البيئة والخلفية:' : 'Environment:'}</span>
                  <p>{developedPrompt.breakdown.environment}</p>
                </div>
              )}
              {developedPrompt.breakdown.lighting && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-0.5">{isAr ? 'الإضاءة والظلال:' : 'Lighting:'}</span>
                  <p>{developedPrompt.breakdown.lighting}</p>
                </div>
              )}
              {developedPrompt.breakdown.composition && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-sky-400 block mb-0.5">{isAr ? 'التكوين والمنظور:' : 'Composition:'}</span>
                  <p>{developedPrompt.breakdown.composition}</p>
                </div>
              )}
              {developedPrompt.breakdown.materials && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="font-bold text-rose-400 block mb-0.5">{isAr ? 'الخامات والواقعية:' : 'Materials:'}</span>
                  <p>{developedPrompt.breakdown.materials}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Arabic Explanation */}
          {activeTab === 'arabic' && developedPrompt.arabicPrompt && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              <p>{developedPrompt.arabicPrompt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
