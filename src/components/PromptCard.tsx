import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Languages,
  Layers,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  Settings2,
  Crop,
  Sun,
  Camera,
} from 'lucide-react';
import { FinalPrompt, TargetTool, SuggestedSettings, FramingSettings, CinematicLightingSettings, CameraAngleId } from '../types.ts';
import { TARGET_TOOLS, DIMENSION_PRESETS } from '../data/presets.ts';
import { getCameraAngleById } from '../data/cameraAngles.ts';
import { AudioPlayer } from './AudioPlayer.tsx';

interface PromptCardProps {
  prompt: FinalPrompt;
  currentTargetTool: TargetTool;
  onChangeTool: (tool: TargetTool) => void;
  suggestedSettings?: SuggestedSettings;
  framingSettings?: FramingSettings;
  lightingSettings?: CinematicLightingSettings;
  cameraAngle?: CameraAngleId;
  onChangeAspectRatio?: (ratio: string, presetId: string) => void;
  rawResponse?: string;
  isPromptOnly?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  currentTargetTool,
  onChangeTool,
  suggestedSettings,
  framingSettings,
  lightingSettings,
  cameraAngle,
  onChangeAspectRatio,
  rawResponse,
  isPromptOnly,
}) => {
  const [copiedType, setCopiedType] = useState<'en' | 'ar' | 'params' | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const activeEnglishPrompt = (prompt.englishPrompt || '').trim();
  const activeArabicPrompt = (prompt.arabicPrompt || '').trim();
  const hasPromptText = Boolean(activeEnglishPrompt || activeArabicPrompt);

  const copyToClipboard = (text: string, type: 'en' | 'ar' | 'params') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getAudioText = () => {
    return `البرومبت النهائي المصمم لمحرك ${prompt.targetTool}: ${activeArabicPrompt || activeEnglishPrompt}.`;
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#4C53DB]/20 shadow-md p-5 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#4C53DB] via-[#7C3AED] to-[#A78BFA]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#4C53DB]/10 text-[#4C53DB] flex items-center justify-center font-bold shadow-xs">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-[#111827]">
                البرومبت النهائي | Final Prompt
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                جاهز للنسخ والتوليد
              </span>
              {isPromptOnly && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-[#4C53DB]">
                  وضع البرومبت المباشر
                </span>
              )}
              {lightingSettings && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-600" />
                  <span>إضاءة سينمائية مخصصة</span>
                </span>
              )}
              {cameraAngle && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4C53DB] border border-indigo-200 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#4C53DB]" />
                  <span>زاوية: {getCameraAngleById(cameraAngle).nameAr}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              صياغة دقيقة واحترافية متوافقة مع محرك {prompt.targetTool || currentTargetTool}
            </p>
          </div>
        </div>

        {/* Audio narration button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAudio(!showAudio)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#4C53DB]" />
            <span>{showAudio ? 'إخفاء الصوت' : 'اقرأ البرومبت'}</span>
          </button>
        </div>
      </div>

      {/* Audio player if toggled */}
      {showAudio && (
        <AudioPlayer
          textToRead={getAudioText()}
          title="شرح البرومبت بالصوت"
          language="ar"
        />
      )}

      {/* Target Tool Bar & Quick Switcher */}
      <div className="bg-slate-50 rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#4C53DB]" />
          <span className="text-xs font-bold text-slate-700">المحرك المستهدف:</span>
          <span className="text-xs font-black text-[#4C53DB] bg-[#4C53DB]/10 px-2.5 py-1 rounded-lg border border-[#4C53DB]/20">
            {prompt.targetTool || currentTargetTool}
          </span>
          {prompt.aspectRatio && (
            <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono">
              الأبعاد: {prompt.aspectRatio}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium ml-1">تكييف الصياغة لمحرك آخر:</span>
          {TARGET_TOOLS.slice(0, 5).map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTool(t.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                currentTargetTool === t.id
                  ? 'bg-[#4C53DB] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions & Aspect Ratio Switcher Bar */}
      <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-[#4C53DB]" />
          <span className="text-xs font-bold text-slate-700">تغيير المقاس والأبعاد مباشرة:</span>
          <span className="text-xs font-mono font-black text-[#4C53DB] bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {prompt.aspectRatio || '16:9'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {DIMENSION_PRESETS.slice(0, 8).map((preset) => {
            const isActive = (prompt.aspectRatio || '16:9') === preset.ratio;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeAspectRatio && onChangeAspectRatio(preset.ratio, preset.id)}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold transition cursor-pointer font-mono ${
                  isActive
                    ? 'bg-[#4C53DB] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={`${preset.name} (${preset.tag})`}
              >
                {preset.ratio}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary English Prompt Box */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-extrabold text-slate-900">
              النص الإنجليزي النهائي (English Prompt):
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(activeEnglishPrompt || activeArabicPrompt, 'en')}
            disabled={!hasPromptText}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4C53DB] hover:bg-[#434ac9] active:scale-95 text-white text-xs font-extrabold transition shadow-md shadow-[#4C53DB]/20 cursor-pointer disabled:opacity-50"
          >
            {copiedType === 'en' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>تم نسخ البرومبت بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ البرومبت الكامل (Copy)</span>
              </>
            )}
          </button>
        </div>

        {activeEnglishPrompt ? (
          <div
            className="bg-slate-900 text-slate-50 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 shadow-inner text-left select-all overflow-x-auto whitespace-pre-wrap break-words"
            dir="ltr"
          >
            {activeEnglishPrompt}
          </div>
        ) : activeArabicPrompt ? (
          <div
            className="bg-slate-900 text-slate-50 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 shadow-inner text-right select-all overflow-x-auto whitespace-pre-wrap break-words"
          >
            {activeArabicPrompt}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>تنبيه: لم يتم العثور على نص صريح للبرومبت في استجابة النموذج</span>
            </div>
            {rawResponse && (
              <pre className="bg-white p-3 rounded-xl border border-amber-200 text-[11px] overflow-x-auto max-h-40">
                {rawResponse}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Arabic Translation & Description */}
      {activeArabicPrompt && activeEnglishPrompt && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Languages className="w-4 h-4 text-[#4C53DB]" />
              <span>الترجمة والشرح باللغة العربية:</span>
            </div>
            <button
              onClick={() => copyToClipboard(activeArabicPrompt, 'ar')}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              {copiedType === 'ar' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>نسخ العربي</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
            {activeArabicPrompt}
          </div>
        </div>
      )}

      {/* Suggested Engine Settings Box (Required Section 4) */}
      {(suggestedSettings || prompt.aspectRatio || prompt.parameters || prompt.negativePrompt) && (
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#111827]">
              <Settings2 className="w-4 h-4 text-[#4C53DB]" />
              <span>4. الإعدادات المقترحة لمحرك {prompt.targetTool || currentTargetTool}:</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                أداة التوليد (Target Tool):
              </span>
              <span className="font-extrabold text-[#4C53DB]">
                {suggestedSettings?.targetTool || prompt.targetTool || currentTargetTool}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                نسبة الأبعاد (Aspect Ratio):
              </span>
              <span className="font-extrabold text-slate-900 font-mono">
                {suggestedSettings?.aspectRatio || prompt.aspectRatio || '16:9'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
                البارامترات الإضافية:
              </span>
              <span className="font-mono text-slate-800 font-bold text-[11px] truncate block" dir="ltr">
                {suggestedSettings?.parameters || prompt.parameters || '--v 6.1 --style raw'}
              </span>
            </div>
          </div>

          {(suggestedSettings?.negativePrompt || prompt.negativePrompt) && (
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/60 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>عناصر مستبعدة (Negative Prompt):</span>
              </div>
              <p className="text-rose-900 font-mono text-[11px]" dir="ltr">
                {suggestedSettings?.negativePrompt || prompt.negativePrompt}
              </p>
            </div>
          )}

          {suggestedSettings?.notes && (
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              💡 {suggestedSettings.notes}
            </p>
          )}
        </div>
      )}

      {/* Visual Breakdown Collapsible */}
      {prompt.breakdown && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-xs font-bold text-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4C53DB]" />
              <span>تفكيك المعايير البصرية للبرومبت (Prompt Breakdown)</span>
            </div>
            {showBreakdown ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showBreakdown && (
            <div className="p-4 sm:p-5 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {prompt.breakdown.subject && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-500 block mb-1">الموضوع الأساسي:</span>
                  <p className="text-slate-800 font-medium">{prompt.breakdown.subject}</p>
                </div>
              )}

              {prompt.breakdown.environment && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-500 block mb-1">البيئة والمشهد:</span>
                  <p className="text-slate-800 font-medium">{prompt.breakdown.environment}</p>
                </div>
              )}

              {prompt.breakdown.composition && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500">التكوين والمنظور والكاميرا:</span>
                    {cameraAngle && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#4C53DB] border border-indigo-200">
                        {getCameraAngleById(cameraAngle).nameAr}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">{prompt.breakdown.composition}</p>
                </div>
              )}

              {prompt.breakdown.lighting && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-500 block mb-1">الإضاءة والانعكاسات:</span>
                  <p className="text-slate-800 font-medium">{prompt.breakdown.lighting}</p>
                </div>
              )}

              {prompt.breakdown.materials && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-500 block mb-1">الخامات والأنسجة:</span>
                  <p className="text-slate-800 font-medium">{prompt.breakdown.materials}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
