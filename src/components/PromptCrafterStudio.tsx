import React, { useState, useEffect } from 'react';
import {
  Wand2,
  Terminal,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Layers,
  Camera,
  Sun,
  Palette,
  Eye,
  ShieldAlert,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';
import { PromptCrafterState, EnginePromptVariants, TargetTool } from '../types.ts';
import { CAMERA_ANGLE_CATEGORIES } from '../data/cameraAngles.ts';

interface PromptCrafterStudioProps {
  initialState?: Partial<PromptCrafterState>;
  onSendToMainStudio?: (promptText: string, tool: TargetTool, ratio: string) => void;
  language?: 'ar' | 'en';
}

const DEFAULT_STATE: PromptCrafterState = {
  subject: 'Luxury perfume bottle with cut crystal facets and golden cap',
  environment: 'Minimalist polished black marble pedestal, soft reflective surface',
  composition: 'Commercial hero center shot, eye-level angle, balanced negative space',
  aspectRatio: '16:9',
  lighting: 'Dramatic cinematic chiaroscuro with warm golden rim backlight and subtle side fill',
  colorMood: 'Deep obsidian black, warm champagne gold, subtle amber glow',
  artisticStyle: 'Commercial luxury advertising photography, Vogue editorial',
  realismLevel: 'Hyper-realistic 8k, tactile authentic glass refractions, crisp razor-sharp details',
  cameraLens: 'Hasselblad 100mm f/2.2 lens, shallow depth of field, creamy bokeh',
  negativeElements: 'blurry, distorted, oversaturated, amateur, text watermark, plastic look, low resolution',
};

// Preset Inspiration Chips for Quick Selection
const SUBJECT_CHIPS = [
  'عطر فاخر بزجاج كريستالي وغطاء ذهبي',
  'ساعة يد سويسرية ميكانيكية فاخرة',
  'سيارة كهربائية رياضية فائقة بتصميم مستقبلي',
  'مستحضر عناية طبيعي عضوي مع أوراق صبار وقطرات ندى',
  'كوب قهوة مختصة سيراميكي مع بخار متصاعد',
  'حذاء سنيكرز عصري مع خامات نسيجية بارزة',
  'سماعات رأس لاسلكية مريحة بتصميم تيتانيوم مطفي',
];

const ENVIRONMENT_CHIPS = [
  'منصة استوديو رخامية مينيمالية مع انعكاس ناعم',
  'صخور بازلتية بركانية سوداء مع رذاذ ماء خفيف',
  'بيئة معمارية حديثة مع نوافذ زجاجية عملاقة وضوء نهار',
  'كثبان رملية صحراوية دافئة عند الغروب',
  'شوارع طوكيو ليلية مع أضواء نيون سايبربانك وضباب مطر',
  'طبيعة غابات اسكندنافية مع طحالب خضراء وأشعة شمس',
];

const COMPOSITION_CHIPS = [
  { label: 'توسيط تجاري Hero Center', value: 'Hero centered commercial product placement' },
  { label: 'زاوية منخفضة درامية Low Angle', value: 'Dynamic low camera angle, empowering monumental perspective' },
  { label: 'عين الطائر مسقط رأسي Top-Down', value: 'Flat-lay top-down bird eye composition, graphic layout' },
  { label: 'ماكرو مقرب جداً Macro Close-up', value: 'Extreme macro close-up highlighting intricate micro textures' },
  { label: 'ثلث سفلي مع فضاء واسع Lower-Third', value: 'Lower-third composition with generous negative breathing space' },
];

const RATIO_OPTIONS = ['16:9', '1:1', '9:16', '4:5', '2:3', '21:9'];

const LIGHTING_CHIPS = [
  'إضاءة كياروسكورو سينمائية مع تباين حاد وظلال ناعمة',
  'إضاءة سوفت بوكس استوديو تجارية ناعمة ومتوازنة',
  'إضاءة حافة نيون متوهجة مزدوجة Dual Rim Lighting',
  'ضوء الساعة الذهبية الدافئ مع توهج خلفي طبيعي',
  'إضاءة حجمية درامية مع أشعة ضوئية تخترق الضباب',
];

const STYLE_CHIPS = [
  'تصوير تجاري وإعلاني واقعي Commercial Advertising Photography',
  'لقطة سينمائية فيلمية 35mm Cinematic Film Still',
  'افتتاحية مجلات أزياء فاخرة High-Fashion Editorial',
  'رندر ثلاثي الأبعاد ثلاثي الخامات 3D Octane Render',
  'فن مفهومي رقمي دقيق Digital Concept Art',
];

const REALISM_CHIPS = [
  'واقعية فوتوغرافية فائقة 8K مع ملامس خامات دقيقة',
  'عدسة 85mm f/1.4 مع عمق سطحي للمجال وعزل ناعم',
  'انعكاسات زجاجية وفيزيائية واقعية Raytraced Caustics',
  'تفاصيل مادية نقية بدون أي شوائب أو تشوهات',
];

export const PromptCrafterStudio: React.FC<PromptCrafterStudioProps> = ({
  initialState,
  onSendToMainStudio,
  language = 'ar',
}) => {
  const [form, setForm] = useState<PromptCrafterState>({ ...DEFAULT_STATE, ...initialState });
  const [activeEngineTab, setActiveEngineTab] = useState<'midjourney' | 'dalle' | 'stableDiffusion' | 'gemini' | 'firefly'>('midjourney');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [aiEnhancedVariants, setAiEnhancedVariants] = useState<EnginePromptVariants | null>(null);
  const [arabicSummary, setArabicSummary] = useState<string>('');
  const isAr = language === 'ar';

  // Synchronize when initialState changes (e.g. from VisualAnalysisCard)
  useEffect(() => {
    if (initialState) {
      setForm((prev) => ({ ...prev, ...initialState }));
    }
  }, [initialState]);

  const updateField = (field: keyof PromptCrafterState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Local algorithmic prompt assembler (instant preview)
  const assembleLocalVariants = (): EnginePromptVariants => {
    const ratio = form.aspectRatio || '16:9';
    const sub = form.subject.trim();
    const env = form.environment.trim();
    const comp = form.composition.trim();
    const light = form.lighting.trim();
    const mood = form.colorMood.trim();
    const style = form.artisticStyle.trim();
    const realism = form.realismLevel.trim();
    const lens = form.cameraLens.trim();
    const neg = form.negativeElements.trim();

    // 1. Midjourney v6.1 formula: Comma-separated stylistic tokens + parameters
    const mjTokens = [
      sub,
      env ? `in ${env}` : '',
      comp,
      light,
      mood ? `color palette of ${mood}` : '',
      style,
      lens,
      realism,
    ]
      .filter(Boolean)
      .join(', ');
    const mjParams = `--ar ${ratio} --v 6.1 --style raw --c 5`;

    // 2. DALL-E 3 (ChatGPT Image) formula: Flowing descriptive natural prose
    const dalleText = `A stunning high-end photograph of ${sub}. The scene is set in ${env || 'a clean commercial studio environment'}. The camera angle is ${comp || 'centered at eye-level'}. The lighting is ${light || 'soft and balanced'}, creating an atmosphere with ${mood || 'rich visual harmony'}. The aesthetic follows a ${style || 'commercial editorial'} style, captured with ${lens || 'an 85mm portrait lens'}, featuring ${realism || 'pristine details and tactile textures'}. Pristine presentation, balanced composition.`;

    // 3. Stable Diffusion (SDXL / Flux) formula: Positive booster tokens + Negative prompt
    const sdPositive = `masterpiece, 8k uhd, photorealistic, commercial photography, ${sub}, ${env ? `situated in ${env}` : ''}, ${comp}, ${light}, ${mood}, ${style}, ${lens}, ${realism}, sharp focus, intricate materials, raytracing`;
    const sdNegative = neg || 'blurry, out of focus, malformed, low quality, artifacts, watermark, bad anatomy, deformed, cartoon, low resolution';

    // 4. Google Gemini / Nano Banana formula: High-fidelity realistic instruction
    const geminiText = `High-resolution studio photograph capturing ${sub}. Environment: ${env || 'clean studio backdrop'}. Lighting: ${light}. Composition: ${comp}. Mood & Colors: ${mood}. Style: ${style}. Camera: ${lens}. Realism: ${realism}. Preserve realistic proportions, authentic materials, and commercial grade clarity. Aspect ratio: ${ratio}.`;

    // 5. Adobe Firefly formula: Commercial product studio tags
    const fireflyText = `Commercial product photography of ${sub}, ${env}, ${comp}, ${light}, ${style}, ${lens}, 8k resolution, depth of field, advertising still`;

    return {
      midjourney: {
        prompt: mjTokens,
        params: mjParams,
        full: `${mjTokens} ${mjParams}`,
      },
      dalle: {
        prompt: dalleText,
        full: dalleText,
      },
      stableDiffusion: {
        positivePrompt: sdPositive,
        negativePrompt: sdNegative,
        full: sdPositive,
      },
      gemini: {
        prompt: geminiText,
        full: geminiText,
      },
      firefly: {
        prompt: fireflyText,
        full: fireflyText,
      },
    };
  };

  const variants = aiEnhancedVariants || assembleLocalVariants();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // AI Prompt Magic Polish: calls backend to synthesize master-grade prompt
  const handleAiPolish = async () => {
    if (!form.subject.trim()) return;
    setIsPolishing(true);
    try {
      const res = await fetch('/api/creative/craft-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setAiEnhancedVariants(json.data);
        if (json.data.arabicSummary) {
          setArabicSummary(json.data.arabicSummary);
        }
      }
    } catch (err) {
      console.warn('AI Polish request failed, retaining local assembled variants', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_STATE);
    setAiEnhancedVariants(null);
    setArabicSummary('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-accent text-white flex items-center justify-center font-bold shadow-md shadow-accent/20 shrink-0">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                {isAr ? 'استوديو كتابة وهندسة البرومبتات الموجه' : 'Guided Prompt Crafter Studio'}
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent-light text-accent border border-accent/20">
                {isAr ? 'متعدد المحركات' : 'Multi-Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'بناء البرومبت بدقة خطوة بخطوة مع توليد صياغات مخصصة لمحركات Midjourney، DALL-E، و Stable Diffusion'
                : 'Step-by-step guided prompt builder with engine-specific syntax for Midjourney, DALL-E, & SD'}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title={isAr ? 'إعادة تعيين الحقول' : 'Reset Fields'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleAiPolish}
            disabled={isPolishing || !form.subject.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-violet-600 text-white text-xs font-extrabold shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isPolishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'جاري التحسين الذكي...' : 'Polishing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحسين وصقل بالذكاء الاصطناعي' : 'AI Magic Polish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Builder Grid: Left = Steps & Controls, Right = Live Engine Formulations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Step-by-Step Prompt Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: Main Subject */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>{isAr ? 'الموضوع الرئيسي والعنصر البطل (Main Subject):' : 'Main Subject & Hero Element:'}</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder={isAr ? 'صف العنصر الأساسي للمشهد بدقة...' : 'Describe the main subject in detail...'}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-y font-medium"
            />
            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {SUBJECT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateField('subject', chip)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 hover:border-accent hover:text-accent transition font-medium cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Environment & Setting */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>{isAr ? 'البيئة والمشهد المحيط (Environment & Setting):' : 'Environment & Backdrop:'}</span>
            </label>
            <textarea
              rows={2}
              value={form.environment}
              onChange={(e) => updateField('environment', e.target.value)}
              placeholder={isAr ? 'صف خلفية المشهد والبيئة المحيطة...' : 'Describe setting, backdrop, and atmosphere...'}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-y font-medium"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {ENVIRONMENT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateField('environment', chip)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 hover:border-accent hover:text-accent transition font-medium cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Composition, Framing & Aspect Ratio */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">3</span>
                <span>{isAr ? 'التكوين وزاوية الكاميرا ونسبة الأبعاد:' : 'Composition, Camera Angle & Aspect Ratio:'}</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-accent bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {form.aspectRatio}
              </span>
            </div>

            {/* Ratio Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 ms-1">{isAr ? 'المقاس:' : 'Ratio:'}</span>
              {RATIO_OPTIONS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => updateField('aspectRatio', ratio)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                    form.aspectRatio === ratio
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Composition Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {COMPOSITION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateField('composition', chip.value)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-accent hover:text-accent transition font-medium cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={form.composition}
              onChange={(e) => updateField('composition', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
            />
          </div>

          {/* Step 4: Lighting Style & Color Palette */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span>{isAr ? 'أسلوب الإضاءة والظلال ولوحة الألوان:' : 'Lighting Style & Color Palette:'}</span>
            </label>
            <input
              type="text"
              value={form.lighting}
              onChange={(e) => updateField('lighting', e.target.value)}
              placeholder="مثال: إضاءة سينمائية جانبية كياروسكورو..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {LIGHTING_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateField('lighting', chip)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 hover:border-accent hover:text-accent transition font-medium cursor-pointer"
                >
                  + {chip}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.colorMood}
              onChange={(e) => updateField('colorMood', e.target.value)}
              placeholder={isAr ? 'مزاج الألوان، مثلاً: ألوان ترابية دافئة، نيون سايبربانك...' : 'Color palette description...'}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium mt-1"
            />
          </div>

          {/* Step 5: Artistic Style & Realism / Lens */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <span>{isAr ? 'الأسلوب الفني ومستوى الواقعية والعدسة:' : 'Artistic Style, Realism & Lens:'}</span>
            </label>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {STYLE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateField('artisticStyle', chip)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-accent hover:text-accent transition font-medium cursor-pointer"
                >
                  {chip.split(' ')[0]} {chip.split(' ')[1]}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.artisticStyle}
              onChange={(e) => updateField('artisticStyle', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <input
                type="text"
                value={form.realismLevel}
                onChange={(e) => updateField('realismLevel', e.target.value)}
                placeholder="الخامات ومستوى الواقعية (مثال: 8k hyper-realistic)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
              />
              <input
                type="text"
                value={form.cameraLens}
                onChange={(e) => updateField('cameraLens', e.target.value)}
                placeholder="العدسة وعمق المجال (مثال: 85mm f/1.4 lens)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
              />
            </div>
          </div>

          {/* Step 6: Negative Elements */}
          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/70 space-y-2">
            <label className="text-xs font-black text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{isAr ? 'عناصر مستبعدة من التوليد (Negative Prompt):' : 'Negative Elements (Strict Exclusion):'}</span>
            </label>
            <input
              type="text"
              value={form.negativeElements}
              onChange={(e) => updateField('negativeElements', e.target.value)}
              placeholder="blurry, distorted, oversaturated, text watermark..."
              className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono"
              dir="ltr"
            />
          </div>
        </div>

        {/* Right Output: Multi-Engine Formulations & Ready Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent-light" />
                <h4 className="text-sm font-black text-white">
                  {isAr ? 'صياغات البرومبت الجاهزة للنسخ' : 'Engine-Tailored Formulations'}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {isAr ? 'توليد تلقائي فوري' : 'Live Assembled'}
              </span>
            </div>

            {/* Engine Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveEngineTab('midjourney')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEngineTab === 'midjourney'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                Midjourney
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab('dalle')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEngineTab === 'dalle'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                DALL-E 3
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab('stableDiffusion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEngineTab === 'stableDiffusion'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                Stable Diffusion
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab('gemini')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEngineTab === 'gemini'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                Gemini
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab('firefly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEngineTab === 'firefly'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                Firefly
              </button>
            </div>

            {/* Active Engine Prompt Content Display */}
            <div className="space-y-3">
              {/* Midjourney view */}
              {activeEngineTab === 'midjourney' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">صياغة Midjourney v6.1:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(variants.midjourney.full, 'mj')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-white font-bold hover:opacity-90 transition cursor-pointer text-xs"
                    >
                      {copiedKey === 'mj' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ البرومبت مع البارامترات' : 'Copy Prompt'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-64 overflow-y-auto"
                    dir="ltr"
                  >
                    {variants.midjourney.full}
                  </div>
                </div>
              )}

              {/* DALL-E 3 view */}
              {activeEngineTab === 'dalle' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">صياغة DALL-E 3 السردية (ChatGPT Image):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(variants.dalle.full, 'dalle')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-white font-bold hover:opacity-90 transition cursor-pointer text-xs"
                    >
                      {copiedKey === 'dalle' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ النص السردي' : 'Copy Narrative'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-64 overflow-y-auto"
                    dir="ltr"
                  >
                    {variants.dalle.full}
                  </div>
                </div>
              )}

              {/* Stable Diffusion view */}
              {activeEngineTab === 'stableDiffusion' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-bold">البرومبت الإيجابي (Positive Prompt):</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(variants.stableDiffusion.positivePrompt, 'sd_pos')}
                        className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                      >
                        {copiedKey === 'sd_pos' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isAr ? 'نسخ الإيجابي' : 'Copy Positive'}</span>
                      </button>
                    </div>
                    <div
                      className="p-3 rounded-xl bg-black/60 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-36 overflow-y-auto"
                      dir="ltr"
                    >
                      {variants.stableDiffusion.positivePrompt}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-rose-400 font-bold">البرومبت السلبي (Negative Prompt):</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(variants.stableDiffusion.negativePrompt, 'sd_neg')}
                        className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                      >
                        {copiedKey === 'sd_neg' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isAr ? 'نسخ السلبي' : 'Copy Negative'}</span>
                      </button>
                    </div>
                    <div
                      className="p-2.5 rounded-xl bg-black/60 border border-rose-950 text-xs text-rose-300 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-24 overflow-y-auto"
                      dir="ltr"
                    >
                      {variants.stableDiffusion.negativePrompt}
                    </div>
                  </div>
                </div>
              )}

              {/* Gemini view */}
              {activeEngineTab === 'gemini' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">صياغة Google Gemini / Nano Banana:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(variants.gemini.full, 'gem')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-white font-bold hover:opacity-90 transition cursor-pointer text-xs"
                    >
                      {copiedKey === 'gem' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-64 overflow-y-auto"
                    dir="ltr"
                  >
                    {variants.gemini.full}
                  </div>
                </div>
              )}

              {/* Firefly view */}
              {activeEngineTab === 'firefly' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">صياغة Adobe Firefly الإعلانية:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(variants.firefly.full, 'ff')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-white font-bold hover:opacity-90 transition cursor-pointer text-xs"
                    >
                      {copiedKey === 'ff' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ البرومبت' : 'Copy Prompt'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed select-all whitespace-pre-wrap break-words max-h-64 overflow-y-auto"
                    dir="ltr"
                  >
                    {variants.firefly.full}
                  </div>
                </div>
              )}
            </div>

            {/* Send to Main Studio button if supported */}
            {onSendToMainStudio && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const activePrompt =
                      activeEngineTab === 'midjourney'
                        ? variants.midjourney.full
                        : activeEngineTab === 'dalle'
                        ? variants.dalle.full
                        : activeEngineTab === 'stableDiffusion'
                        ? variants.stableDiffusion.positivePrompt
                        : activeEngineTab === 'gemini'
                        ? variants.gemini.full
                        : variants.firefly.full;

                    const toolMap: Record<string, TargetTool> = {
                      midjourney: 'midjourney',
                      dalle: 'chatgpt',
                      stableDiffusion: 'universal',
                      gemini: 'gemini',
                      firefly: 'firefly',
                    };
                    onSendToMainStudio(activePrompt, toolMap[activeEngineTab] || 'universal', form.aspectRatio);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5 text-accent" />
                  <span>{isAr ? 'نقل البرومبت ومعالجته في الاستوديو الرئيسي' : 'Use in Creative Studio Canvas'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
