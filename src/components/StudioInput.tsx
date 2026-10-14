import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  UserCheck,
  RefreshCw,
  SlidersHorizontal,
  Shield,
  ShieldCheck,
  Zap,
  Gauge,
} from 'lucide-react';
import { CreativeMode, TargetTool, BrandKit } from '../types.ts';
import { PRESET_IDEAS, TARGET_TOOLS, PERSONAS } from '../data/presets.ts';
import { optimizeImageFile } from '../utils/imageOptimizer.ts';

interface StudioInputProps {
  mode: CreativeMode;
  targetTool: TargetTool;
  onChangeTargetTool: (tool: TargetTool) => void;
  personaFocus: string | null;
  onChangePersonaFocus: (focus: string | null) => void;
  activeBrand?: BrandKit | null;
  onOpenBrandVault?: () => void;
  onDeactivateBrand?: () => void;
  onSubmit: (prompt: string, image: { data: string; mimeType: string; name?: string } | null) => void;
  onRequestQuickIdeas?: (prompt: string, image: { data: string; mimeType: string; name?: string } | null) => void;
  isLoading: boolean;
  language?: 'ar' | 'en';
  currentAccent?: string;
}

export const StudioInput: React.FC<StudioInputProps> = ({
  mode,
  targetTool,
  onChangeTargetTool,
  personaFocus,
  onChangePersonaFocus,
  activeBrand,
  onOpenBrandVault,
  onDeactivateBrand,
  onSubmit,
  onRequestQuickIdeas,
  isLoading,
  language = 'ar',
  currentAccent = '#4C53DB',
}) => {
  const [promptText, setPromptText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    data: string;
    mimeType: string;
    name: string;
    previewUrl: string;
  } | null>(null);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [imageOptimizationStats, setImageOptimizationStats] = useState<{
    sizeKb: number;
    savedPct: number;
    dimensions: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAr = language === 'ar';

  const getPlaceholder = (currentMode: CreativeMode) => {
    switch (currentMode) {
      case 'concept':
        return isAr
          ? 'اكتب اسم المنتج أو الخدمة، رسالتك الإعلانية، أو فكرة أولية ترغب في ابتكار مفاهيم بصرية استثنائية لها...'
          : 'Enter product name, advertising message, or initial idea for creative concept creation...';
      case 'analyze':
        return isAr
          ? 'ارفع صورة مرجعية أدناه لتحليل تكوينها، ألوانها، وإضاءتها، أو اكتب سؤالاً محدداً ترغب في استخراجه من الصورة...'
          : 'Upload a reference image below to analyze composition, lighting, and palette...';
      case 'scratch':
        return isAr
          ? 'اشرح المشهد البصري الذي تتخيله بالتفصيل: الموضوع، الإضاءة، الأسلوب الفني، والزاوية...'
          : 'Describe the visual scene in detail: subject, lighting, artistic style, and camera angle...';
      case 'refine':
        return isAr
          ? 'الصق البرومبت السابق هنا (مثلاً بالإنجليزية أو العربية) لفحصه وتصحيح نقاط ضعفه وإعادة صياغته باحترافية...'
          : 'Paste existing prompt here to audit, refine, and optimize for target AI engines...';
      case 'product':
        return isAr
          ? 'حدد نوع المنتج (عطر، هاتف، مجوهرات، حقيبة فاخرة...) والخامات وشكل العبوة ونوع المشهد التجاري المرغوب...'
          : 'Specify product type (perfume, tech, jewelry, luxury watch) and commercial scene setting...';
      case 'branding':
        return isAr
          ? 'اشرح طبيعة البراند، الجمهور المستهدف، والقيم التي تريد التعبير عنها في الهوية البصرية ومودبورد الألوان...'
          : 'Describe brand values, target audience, and desired visual identity aesthetic...';
      case 'copywriting':
        return isAr
          ? 'اكتب موضوع الإعلان أو الحملة التسويقية لصياغة عناوين رنانة وشعارات وكابشن ترويجي...'
          : 'Enter ad theme to craft high-converting headlines, slogans, and ad copy...';
      case 'story':
        return isAr
          ? 'ارفع صورة أو اكتب مشهداً لبناء عالم قصصي متكامل وكتابة فقرة روائية افتتاحية مشوقة وقراءتها صوتياً...'
          : 'Describe scene to generate narrative lore, opening storytelling paragraph, and audio narration...';
      case 'support':
        return isAr
          ? 'اطرح أي سؤال حول خدمات الاستوديو، منهجية هندسة البرومبتات، أو نصائح لاختيار أدوات التوليد المناسبة...'
          : 'Ask any question about prompt engineering methods or image generation tools...';
      default:
        return isAr ? 'اشرح فكرتك الإبداعية هنا...' : 'Describe your creative idea here...';
    }
  };

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isAr ? 'الرجاء اختيار ملف صورة صالح (JPEG, PNG, WEBP).' : 'Please upload a valid image file.');
      return;
    }

    // Instant local preview to minimize perceived latency
    const instantUrl = URL.createObjectURL(file);
    setSelectedImage({
      data: '',
      mimeType: file.type,
      name: file.name,
      previewUrl: instantUrl,
    });
    setIsOptimizingImage(true);

    try {
      // High-speed client-side compression & downscaling
      const optimized = await optimizeImageFile(file, 1400, 0.85);
      setSelectedImage({
        data: optimized.data,
        mimeType: optimized.mimeType,
        name: optimized.name,
        previewUrl: optimized.previewUrl,
      });

      setImageOptimizationStats({
        sizeKb: Math.round(optimized.optimizedSizeBytes / 1024),
        savedPct: optimized.compressionRatio,
        dimensions: `${optimized.width}×${optimized.height}`,
      });
    } catch (err) {
      console.warn('Image optimization failed, falling back to FileReader', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setSelectedImage({
          data: dataUri,
          mimeType: file.type,
          name: file.name,
          previewUrl: dataUri,
        });
        setImageOptimizationStats(null);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageOptimizationStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyPreset = (presetPrompt: string, presetTool: TargetTool) => {
    setPromptText(presetPrompt);
    onChangeTargetTool(presetTool);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() && !selectedImage) {
      return;
    }
    // If image is still optimizing, wait
    if (isOptimizingImage) {
      return;
    }
    onSubmit(
      promptText.trim(),
      selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType, name: selectedImage.name } : null
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/90 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Brand Vault Status Banner (if active) */}
        {activeBrand && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-extrabold text-emerald-900">
                  {isAr ? 'درع الهوية البصرية مُفعّل:' : 'Brand Vault Shield Active:'}{' '}
                </span>
                <span className="font-bold text-emerald-800">{activeBrand.name}</span>
                {activeBrand.colors && activeBrand.colors.length > 0 && (
                  <div className="inline-flex items-center gap-1 ms-2">
                    {activeBrand.colors.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name}: ${c.hex}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onOpenBrandVault && (
                <button
                  type="button"
                  onClick={onOpenBrandVault}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  {isAr ? 'تعديل الدرع' : 'Edit Shield'}
                </button>
              )}
              {onDeactivateBrand && (
                <button
                  type="button"
                  onClick={onDeactivateBrand}
                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  {isAr ? 'إلغاء التفعيل' : 'Deactivate'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={getPlaceholder(mode)}
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none transition resize-y leading-relaxed"
            style={{
              borderColor: promptText ? currentAccent : undefined,
            }}
          />
        </div>

        {/* Reference Image Drag & Drop / Upload Section */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: currentAccent }}
                >
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center sm:text-start">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                      {isAr
                        ? 'اسحب وأفلت صورة مرجعية أو للمنتج هنا'
                        : 'Drag and drop product or reference photo here'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {isAr ? 'تسريع مضاعف تلقائي' : 'Auto-Accelerated'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAr
                      ? 'تدعم صور المنتجات، المودبورد، الاسكتشات، ومراجع الإضاءة (يتم ضغطها فورياً لتسريع استجابة الذكاء الاصطناعي)'
                      : 'Supports product photos, moodboards & lighting refs (automatically optimized for instant inference)'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={selectedImage.previewUrl}
                    alt="Reference Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  {isOptimizingImage && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                      {selectedImage.name}
                    </span>
                    {isOptimizingImage ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        {isAr ? 'جاري التحسين الفوري...' : 'Optimizing...'}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {isAr ? 'جاهزة للمعالجة' : 'Ready'}
                      </span>
                    )}

                    {/* Image Optimization Performance Badge */}
                    {imageOptimizationStats && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Zap className="w-3 h-3 text-emerald-600 fill-emerald-500/20" />
                        <span>
                          {isAr
                            ? `${imageOptimizationStats.sizeKb}KB ${imageOptimizationStats.savedPct > 0 ? `(تسريع +${imageOptimizationStats.savedPct}%)` : ''}`
                            : `${imageOptimizationStats.sizeKb}KB ${imageOptimizationStats.savedPct > 0 ? `(+${imageOptimizationStats.savedPct}% faster)` : ''}`}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isAr
                      ? 'سيقوم محلل الصور والمخرج الفني بفحص عناصرها وتكوينها بدقة'
                      : 'Visual Analyst and Art Director will dissect components with high fidelity'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition cursor-pointer"
                >
                  {isAr ? 'استبدال' : 'Replace'}
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title={isAr ? 'حذف الصورة' : 'Remove image'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Inspiration Sparks / Presets */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              {isAr ? 'أفكار مقترحة سريعة للتجربة الفورية:' : 'Quick Inspiration Presets:'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_IDEAS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.prompt, preset.tool)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/70 text-slate-700 transition font-medium text-start cursor-pointer hover:border-slate-300"
              >
                ✨ {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Toolbar: Tool, Persona, and Submit */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Target Generator Dropdown */}
            <div className="relative flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Cpu className="w-3.5 h-3.5" style={{ color: currentAccent }} />
              <label htmlFor="target-tool-select" className="text-xs font-bold text-slate-600">
                {isAr ? 'أداة التوليد:' : 'Target Tool:'}
              </label>
              <select
                id="target-tool-select"
                aria-label="أداة التوليد المستهدفة"
                value={targetTool}
                onChange={(e) => onChangeTargetTool(e.target.value as TargetTool)}
                className="bg-transparent text-xs font-bold text-[#111827] focus:outline-none cursor-pointer pe-1"
              >
                {TARGET_TOOLS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Persona Focus Dropdown */}
            <div className="relative flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <UserCheck className="w-3.5 h-3.5 text-violet-600" />
              <label htmlFor="persona-focus-select" className="text-xs font-bold text-slate-600">
                {isAr ? 'تركيز الوكيل:' : 'Agent Focus:'}
              </label>
              <select
                id="persona-focus-select"
                aria-label="تركيز شخصية الوكيل الإبداعي"
                value={personaFocus || ''}
                onChange={(e) => onChangePersonaFocus(e.target.value ? e.target.value : null)}
                className="bg-transparent text-xs font-bold text-[#111827] focus:outline-none cursor-pointer pe-1"
              >
                <option value="">{isAr ? 'فريق متكامل (الـ 5 شخصيات)' : 'Integrated (All 5 Roles)'}</option>
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.englishName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            {onRequestQuickIdeas && (
              <button
                type="button"
                onClick={() => {
                  onRequestQuickIdeas(
                    promptText.trim(),
                    selectedImage
                      ? {
                          data: selectedImage.data,
                          mimeType: selectedImage.mimeType,
                          name: selectedImage.name,
                        }
                      : null
                  );
                }}
                disabled={isLoading || isOptimizingImage || (!promptText.trim() && !selectedImage)}
                className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs active:scale-[0.99]"
                title={isAr ? 'توليد 4 أفكار إعلانية فورية متنوعة للمنتج نفسه مع تغيير الخلفية والإضاءة والتكوين' : 'Generate 4 quick instant ad concepts with varied setups'}
              >
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500/30" />
                <span>{isAr ? '4 أفكار سريعة فورية' : '4 Quick Ideas'}</span>
              </button>
            )}

            {/* Primary Action Button with Dynamic Brand Accent */}
            <button
              type="submit"
              disabled={isLoading || isOptimizingImage || (!promptText.trim() && !selectedImage)}
              className="px-6 py-2.5 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.99] cursor-pointer"
              style={{
                backgroundColor: currentAccent,
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري المعالجة الإبداعية...' : 'Processing...'}</span>
                </>
              ) : isOptimizingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'تسريع الصورة...' : 'Optimizing Image...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {selectedImage && !promptText.trim()
                      ? (isAr ? 'تحليل الصورة المرجعية' : 'Analyze Reference Image')
                      : (isAr ? 'ابتكار المشهد وصناعة البرومبت' : 'Create Scene & Prompt')}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
