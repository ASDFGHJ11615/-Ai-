import React, { useState } from 'react';
import {
  Scan,
  Eye,
  Lightbulb,
  Palette,
  Camera,
  Sun,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Volume2,
  ArrowRight,
  Sliders,
  Compass,
  FileText,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { VisualAnalysis, PromptCrafterState } from '../types.ts';
import { AudioPlayer } from './AudioPlayer.tsx';

interface VisualAnalysisCardProps {
  analysis: VisualAnalysis;
  onUseEvolutionIdea: (idea: string) => void;
  onSendToPromptCrafter?: (prefill: Partial<PromptCrafterState>) => void;
  language?: 'ar' | 'en';
}

export const VisualAnalysisCard: React.FC<VisualAnalysisCardProps> = ({
  analysis,
  onUseEvolutionIdea,
  onSendToPromptCrafter,
  language = 'ar',
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const isAr = language === 'ar';

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyFullReport = () => {
    const reportText = `[تقرير التحليل البصري للصورة المرجعية - استوديو الإبداع]
1. الموضوع الرئيسي: ${analysis.subject || 'غير محدد'}
2. الحالة المزاجية: ${analysis.mood || 'غير محدد'}
3. الفكرة البصرية: ${analysis.concept || 'غير محدد'}
4. التكوين وتوزيع الفراغ: ${analysis.composition || 'غير محدد'}
5. زاوية الكاميرا والمنظور: ${analysis.perspective || 'غير محدد'}
6. الإضاءة والظلال: ${analysis.lighting || 'غير محدد'}
7. لوحة الألوان: ${(analysis.colorPalette || []).map((c) => `${c.name} (${c.hex})`).join(', ')}
8. الخامات والواقعية: ${analysis.textures || 'غير محدد'}
9. البيئة والخلفية: ${analysis.environment || 'غير محدد'}
10. ما يظهر يقيناً مقابل الاستنتاج: ${analysis.observedVsInferred || 'غير محدد'}
11. العناصر المستنتجة غير الظاهرة: ${analysis.inferredElements || 'غير محدد'}
12. مقترحات التطبيق في تصاميم جديدة: ${(analysis.newDesignApplications || []).join(' | ')}
13. التصور التطويري: ${analysis.evolutionIdea || 'غير محدد'}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const getFullAnalysisText = () => {
    return `تحليل الصورة المرجعية من استوديو الإبداع. الموضوع الرئيسي: ${analysis.subject || ''}. التكوين وتوزيع الفراغ: ${analysis.composition || ''}. أسلوب الإضاءة: ${analysis.lighting || ''}. المزاج العام: ${analysis.mood || ''}. الاستنتاجات غير الظاهرة: ${analysis.inferredElements || analysis.observedVsInferred || ''}. التصور الإبداعي المقترح: ${analysis.evolutionIdea || ''}`;
  };

  const handleSendToPromptCrafter = () => {
    if (!onSendToPromptCrafter) return;
    const paletteString = (analysis.colorPalette || []).map((c) => `${c.name} (${c.hex})`).join(', ');
    onSendToPromptCrafter({
      subject: analysis.subject || '',
      environment: analysis.environment || '',
      composition: analysis.composition || '',
      lighting: analysis.lighting || '',
      colorMood: `${analysis.mood || ''} ${paletteString ? `[الباليت: ${paletteString}]` : ''}`.trim(),
      artisticStyle: analysis.style || 'Commercial studio photography',
      realismLevel: analysis.textures || 'Ultra-realistic 8k, authentic materials',
      cameraLens: analysis.perspective || '85mm commercial lens',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                {isAr ? 'التحليل البصري الاحترافي للصورة المرجعية' : 'Professional Reference Image Visual Analysis'}
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {isAr ? 'محلل الصور + المخرج الفني' : 'Vision Analyst + Art Director'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'استخلاص تفصيلي للموضوع، الألوان، الإضاءة، التكوين، والمزاج مع استنتاج العناصر غير الظاهرة'
                : 'Detailed extraction of subject, palette, lighting, framing, mood & inferred elements'}
            </p>
          </div>
        </div>

        {/* Action Header Tools */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onSendToPromptCrafter && (
            <button
              onClick={handleSendToPromptCrafter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-bold transition shadow-xs hover:opacity-90 cursor-pointer"
              title={isAr ? 'تصدير هذه المعايير مباشرة إلى منشئ البرومبتات' : 'Export to Prompt Crafter'}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'صياغة برومبت من هذه الصورة' : 'Craft Prompt from Image'}</span>
            </button>
          )}

          <button
            onClick={copyFullReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            title={isAr ? 'نسخ تقرير التحليل الكامل كملخص نصي' : 'Copy Full Report'}
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAr ? 'نسخ التقرير' : 'Copy Report'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAudio(!showAudio)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-accent" />
            <span>{showAudio ? (isAr ? 'إخفاء الصوت' : 'Hide Voice') : (isAr ? 'سماع التحليل' : 'Listen')}</span>
          </button>
        </div>
      </div>

      {/* Audio player if toggled */}
      {showAudio && (
        <AudioPlayer
          textToRead={getFullAnalysisText()}
          title={isAr ? 'قراءة التحليل البصري بالذكاء الاصطناعي' : 'AI Visual Analysis Audio Narration'}
          language="ar"
        />
      )}

      {/* 1. Core Visual Attributes Grid: Subject, Mood, Concept */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject & Elements */}
        {analysis.subject && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-accent text-xs font-extrabold">
              <Eye className="w-4 h-4" />
              <span>{isAr ? '1. الموضوع الرئيسي والعناصر البصرية' : '1. Subject & Core Entities'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.subject}
            </p>
          </div>
        )}

        {/* Mood & Atmosphere */}
        {analysis.mood && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-violet-600 text-xs font-extrabold">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? '2. المزاج العام والأجواء (Mood & Vibe)' : '2. General Mood & Atmosphere'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.mood}
            </p>
          </div>
        )}

        {/* Concept & Message */}
        {analysis.concept && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-indigo-600 text-xs font-extrabold">
              <Lightbulb className="w-4 h-4" />
              <span>{isAr ? '3. الفكرة البصرية والرسالة الإعلانية' : '3. Concept & Visual Message'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.concept}
            </p>
          </div>
        )}
      </div>

      {/* 2. Photographic Anatomy: Lighting, Composition, Perspective */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lighting & Shadows */}
        {analysis.lighting && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-amber-500 text-xs font-extrabold">
              <Sun className="w-4 h-4" />
              <span>{isAr ? 'أسلوب الإضاءة والظلال (Lighting Style)' : 'Lighting Style & Shadow Ratio'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.lighting}
            </p>
          </div>
        )}

        {/* Composition & Framing */}
        {analysis.composition && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-sky-600 text-xs font-extrabold">
              <Layers className="w-4 h-4" />
              <span>{isAr ? 'التكوين وتوزيع الفراغ (Composition)' : 'Composition & Framing'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.composition}
            </p>
          </div>
        )}

        {/* Camera & Angle */}
        {analysis.perspective && (
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 text-xs font-extrabold">
              <Camera className="w-4 h-4" />
              <span>{isAr ? 'زاوية الكاميرا والمنظور (Camera Angle)' : 'Perspective & Angle of View'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.perspective}
            </p>
          </div>
        )}
      </div>

      {/* 3. Extracted Color Palette Section */}
      {analysis.colorPalette && analysis.colorPalette.length > 0 && (
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'لوحة الألوان المستخرجة بدقة (Color Palette):' : 'Extracted Color Palette:'}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {isAr ? 'انقر على أي كود لنسخه فورياً أو استخدمه في التصميم' : 'Click to copy exact HEX code'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {analysis.colorPalette.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => copyToClipboard(color.hex)}
                className="group flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 shadow-2xs hover:shadow-xs transition text-start cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-inner shrink-0 border border-black/10 ring-1 ring-black/5"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="overflow-hidden min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 truncate">
                    {color.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <span>{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Textures, Realism & Environment Backdrop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {analysis.textures && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              {isAr ? 'الخامات والأنسجة ومستوى الواقعية (Textures & Materials):' : 'Textures, Materials & Realism:'}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {analysis.textures}
            </p>
          </div>
        )}

        {analysis.environment && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              {isAr ? 'الخلفية والبيئة المحيطة (Setting & Backdrop):' : 'Environment & Setting:'}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {analysis.environment}
            </p>
          </div>
        )}
      </div>

      {/* 5. Inferred Elements & Subconscious Vision (استنتاج العناصر غير الواضحة بصرياً) */}
      {(analysis.inferredElements || analysis.observedVsInferred) && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
            <Compass className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isAr
                ? 'استنتاج وسيميائية العناصر غير الواضحة بصرياً (Inferred & Hidden Context):'
                : 'Inferred Elements & Subconscious Context:'}
            </span>
          </div>

          {analysis.inferredElements && (
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {analysis.inferredElements}
            </p>
          )}

          {analysis.observedVsInferred && (
            <div className="pt-2 border-t border-amber-200/70">
              <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
                {isAr ? 'التفريق المنهجي (ما يظهر يقيناً مقابل الاستنتاج الإبداعي):' : 'Observed Facts vs Creative Inferences:'}
              </span>
              <p className="text-xs text-amber-800 leading-relaxed font-normal">
                {analysis.observedVsInferred}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 6. Creative Adaptation in New Designs (اقتراحات تطبيق هذه العناصر في تصاميم جديدة) */}
      {analysis.newDesignApplications && analysis.newDesignApplications.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
              <Wand2 className="w-4 h-4 text-indigo-600" />
              <span>
                {isAr
                  ? 'اقتراحات تطبيق هذه العناصر في مفاهيم وتصاميم جديدة (Application in New Designs):'
                  : 'How to Apply These Elements in New Designs:'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {isAr ? 'أفكار ابتكارية' : 'Creative Ideas'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {analysis.newDesignApplications.map((appIdea, i) => (
              <div
                key={i}
                className="bg-white/90 p-3.5 rounded-xl border border-indigo-100 shadow-2xs text-xs space-y-1.5"
              >
                <div className="flex items-center gap-1.5 font-bold text-indigo-800 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{isAr ? `تطبيق إبداعي ${i + 1}` : `Concept Application ${i + 1}`}</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {appIdea}
                </p>
                {onSendToPromptCrafter && (
                  <button
                    type="button"
                    onClick={() => {
                      onSendToPromptCrafter({
                        subject: appIdea,
                        environment: analysis.environment || '',
                        lighting: analysis.lighting || '',
                        artisticStyle: analysis.style || 'Commercial Photography',
                      });
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>{isAr ? 'استخدم هذه الفكرة في البرومبت' : 'Use in Prompt Crafter'}</span>
                    <ArrowRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Strengths & Improvements */}
      {(analysis.strengths || analysis.improvements) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.strengths && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'نقاط القوة البصرية القابلة للتطوير:' : 'Visual Strengths to Retain:'}</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-medium">
                {analysis.strengths}
              </p>
            </div>
          )}

          {analysis.improvements && (
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs">
              <div className="flex items-center gap-2 text-sky-800 font-bold mb-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{isAr ? 'توصيات التحسين وإعادة الابتكار:' : 'Improvement Recommendations:'}</span>
              </div>
              <p className="text-sky-900 leading-relaxed font-medium">
                {analysis.improvements}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 8. Creative Evolution Idea (التصور الإبداعي المقترح لتطوير الصورة) */}
      {analysis.evolutionIdea && (
        <div className="bg-gradient-to-br from-accent/10 via-violet-500/5 to-transparent rounded-2xl p-5 border border-accent/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-[#111827]">
                {isAr ? 'التصور الإبداعي المقترح لتطوير الصورة المرجعية:' : 'Proposed Creative Evolution Vision:'}
              </h4>
            </div>
            <button
              onClick={() => onUseEvolutionIdea(analysis.evolutionIdea!)}
              className="px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer hover:opacity-90"
            >
              {isAr ? 'حوّل هذا التصور إلى برومبت جديد' : 'Convert to New Prompt'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {analysis.evolutionIdea}
          </p>
        </div>
      )}
    </div>
  );
};
