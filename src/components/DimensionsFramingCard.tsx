import React, { useState } from 'react';
import {
  Crop,
  Maximize2,
  Sliders,
  Check,
  Smartphone,
  Square,
  Tv,
  Layers,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import {
  FramingSettings,
  DimensionPreset,
  ProductPlacement,
  ProductScale,
  MarginOption,
  BackgroundStyleOption,
} from '../types.ts';
import { DIMENSION_PRESETS, DEFAULT_FRAMING_SETTINGS } from '../data/presets.ts';

interface DimensionsFramingCardProps {
  settings: FramingSettings;
  onChangeSettings: (newSettings: FramingSettings) => void;
  onApplyToPrompt?: () => void;
  isCompact?: boolean;
}

export const DimensionsFramingCard: React.FC<DimensionsFramingCardProps> = ({
  settings,
  onChangeSettings,
  onApplyToPrompt,
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isCompact);
  const [customWidth, setCustomWidth] = useState(settings.customWidth || 1200);
  const [customHeight, setCustomHeight] = useState(settings.customHeight || 1200);

  const selectedPreset =
    DIMENSION_PRESETS.find((p) => p.id === settings.dimensionId) ||
    DIMENSION_PRESETS[4]; // Default 1:1

  const handleSelectPreset = (preset: DimensionPreset) => {
    if (preset.id === 'custom') {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(customWidth, customHeight);
      const ratio = `${Math.round(customWidth / divisor)}:${Math.round(customHeight / divisor)}`;
      onChangeSettings({
        ...settings,
        dimensionId: 'custom',
        aspectRatio: ratio,
        width: customWidth,
        height: customHeight,
        customWidth,
        customHeight,
      });
    } else {
      onChangeSettings({
        ...settings,
        dimensionId: preset.id,
        aspectRatio: preset.ratio,
        width: preset.width,
        height: preset.height,
      });
    }
  };

  const handleCustomChange = (widthVal: number, heightVal: number) => {
    const w = Math.max(256, Math.min(4096, widthVal || 1024));
    const h = Math.max(256, Math.min(4096, heightVal || 1024));
    setCustomWidth(w);
    setCustomHeight(h);
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(w, h);
    const ratio = `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;
    onChangeSettings({
      ...settings,
      dimensionId: 'custom',
      aspectRatio: ratio,
      width: w,
      height: h,
      customWidth: w,
      customHeight: h,
    });
  };

  const getPlacementIconPos = (placement: ProductPlacement) => {
    switch (placement) {
      case 'center':
        return 'items-center justify-center';
      case 'lower_third':
        return 'items-end justify-center pb-4';
      case 'floating':
        return 'items-center justify-center -translate-y-2';
      case 'dynamic_angle':
        return 'items-center justify-center rotate-6 scale-95';
      default:
        return 'items-center justify-center';
    }
  };

  const getScaleClass = (scale: ProductScale) => {
    switch (scale) {
      case 'standard':
        return 'w-16 h-16 sm:w-20 sm:h-20';
      case 'dominant':
        return 'w-20 h-20 sm:w-28 sm:h-28';
      case 'minimal':
        return 'w-12 h-12 sm:w-14 sm:h-14';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-right transition-all">
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition border-b border-slate-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4C53DB]/10 text-[#4C53DB] flex items-center justify-center font-bold shadow-xs">
            <Crop className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#111827]">
                قسم المقاسات والأبعاد والتأطير التجاري
              </h3>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#4C53DB]/10 text-[#4C53DB] font-mono">
                {settings.aspectRatio} • {settings.width}×{settings.height}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              توسيط المنتج بنسبة 28% هوامش، منطقة آمنة 50%، واستخراج ألوان الخلفية من المرجع
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyToPrompt && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApplyToPrompt();
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-[#4C53DB] hover:bg-indigo-100 transition"
            >
              تحديث البرومبت بالمقاس
            </button>
          )}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-150">
          {/* 1. Presets Grid (All 9 requested dimensions) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#4C53DB]" />
                <span>المقاسات والأبعاد المتاحة (Dimensions & Aspect Ratios):</span>
              </span>
              <span className="text-[11px] text-slate-400">
                اختر المقاس المناسب لمنصتك الإعلانية
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {DIMENSION_PRESETS.map((preset) => {
                const isSelected = settings.dimensionId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-50/80 to-white border-[#4C53DB] shadow-md ring-2 ring-[#4C53DB]/20 text-[#111827]'
                        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#4C53DB] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="text-[11px] font-mono font-bold text-slate-500 dir-ltr text-left">
                        {preset.tag}
                      </span>
                      <span className="text-[10px] font-semibold text-[#4C53DB]">
                        {preset.ratio}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Dimensions input row if custom is selected */}
            {settings.dimensionId === 'custom' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700">تحديد المقاس المخصص (بكسل):</span>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-500">العرض:</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => handleCustomChange(Number(e.target.value), customHeight)}
                    className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900"
                    min={256}
                    max={4096}
                    step={64}
                  />
                  <span className="text-slate-400 font-bold">×</span>
                  <label className="text-[11px] text-slate-500">الارتفاع:</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => handleCustomChange(customWidth, Number(e.target.value))}
                    className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900"
                    min={256}
                    max={4096}
                    step={64}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#4C53DB] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  النسبة المحسوبة: {settings.aspectRatio}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Framing Preview Box & Product Placement Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3 border-t border-slate-100">
            {/* Visual Canvas Framing Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[220px]">
              <div className="absolute top-2 right-3 left-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>معاينة التأطير البصري التجاري</span>
                <span className="text-emerald-400 font-bold">{settings.aspectRatio}</span>
              </div>

              {/* Aspect box representation */}
              <div
                className="relative rounded-xl border-2 border-indigo-400/50 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col shadow-2xl transition-all duration-300 overflow-hidden"
                style={{
                  width:
                    settings.aspectRatio === '9:16'
                      ? '120px'
                      : settings.aspectRatio === '16:9'
                      ? '210px'
                      : settings.aspectRatio === '3:4' || settings.aspectRatio === '2:3' || settings.aspectRatio === '4:5'
                      ? '150px'
                      : '170px',
                  height:
                    settings.aspectRatio === '9:16'
                      ? '190px'
                      : settings.aspectRatio === '16:9'
                      ? '120px'
                      : settings.aspectRatio === '3:4' || settings.aspectRatio === '2:3' || settings.aspectRatio === '4:5'
                      ? '190px'
                      : '170px',
                }}
              >
                {/* 28% Margin guides (Negative Space) */}
                <div className="absolute inset-[14%] border border-dashed border-indigo-500/30 rounded-lg pointer-events-none" />

                {/* 50% Central Safe Zone Box */}
                {settings.safeZone && (
                  <div className="absolute inset-[25%] border border-dashed border-emerald-400/60 rounded-md pointer-events-none flex items-start justify-end p-0.5">
                    <span className="text-[8px] font-mono text-emerald-400/80 bg-slate-900/80 px-1 rounded scale-90">
                      50% Safe
                    </span>
                  </div>
                )}

                {/* Simulated product element in frame */}
                <div className={`w-full h-full flex ${getPlacementIconPos(settings.productPlacement)} p-2 z-10`}>
                  <div
                    className={`${getScaleClass(
                      settings.productScale
                    )} rounded-xl bg-gradient-to-tr from-[#4C53DB] to-violet-500 text-white flex flex-col items-center justify-center shadow-lg border border-white/20 transition-all duration-200`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span className="text-[9px] font-black mt-0.5 tracking-tight">المنتج</span>
                  </div>
                </div>

                {/* Bottom guide labels */}
                <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between text-[8px] text-slate-400/70 font-mono">
                  <span>هوامش 28%</span>
                  <span>توسيط تجاري</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> منطقة آمنة 50%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" /> هوامش فارغة 28%
                </span>
              </div>
            </div>

            {/* Detailed Commercial Settings (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Placement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  موضع المنتج في الكادر (Product Placement):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'center', label: 'توسيط المنتج', desc: 'وسط متقن دون تشويه' },
                    { id: 'lower_third', label: 'ثلث سفلي', desc: 'مساحة علوية هادئة' },
                    { id: 'floating', label: 'عائم بالهواء', desc: 'انسيابية وظلال ناعمة' },
                    { id: 'dynamic_angle', label: 'زاوية 45°', desc: 'منظور ديناميكي للخامة' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        onChangeSettings({
                          ...settings,
                          productPlacement: p.id as ProductPlacement,
                        })
                      }
                      className={`p-2 rounded-xl border text-right transition cursor-pointer ${
                        settings.productPlacement === p.id
                          ? 'bg-[#4C53DB] text-white border-[#4C53DB] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-xs font-bold">{p.label}</span>
                      <span
                        className={`block text-[10px] mt-0.5 line-clamp-1 ${
                          settings.productPlacement === p.id ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Scale & Breathing Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Scale */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    حجم المنتج في الكادر (Scale):
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'standard', label: 'قياسي (60%)' },
                      { id: 'dominant', label: 'بارز (75%)' },
                      { id: 'minimal', label: 'هادئ (40%)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            productScale: s.id as ProductScale,
                          })
                        }
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          settings.productScale === s.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الهوامش الفارغة (Negative Space):
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'balanced', label: 'متوازن ~28%' },
                      { id: 'tight', label: 'ضيق 15%' },
                      { id: 'spacious', label: 'رحب 40%' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            margin: m.id as MarginOption,
                          })
                        }
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          settings.margin === m.id
                            ? 'bg-[#4C53DB] text-white border-[#4C53DB] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Style and Safe Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Background tone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    لون ونمط الخلفية (Background Tone):
                  </label>
                  <select
                    value={settings.backgroundStyle}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        backgroundStyle: e.target.value as BackgroundStyleOption,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#4C53DB]"
                  >
                    <option value="extracted_complementary">
                      استخراج ألوان متناسقة من المنتج المرجعي
                    </option>
                    <option value="neutral_studio">ستوديو هادئ ومحايد (Cyclorama)</option>
                    <option value="gradient_vignette">تدرج إضاءة ناعم (Vignette)</option>
                    <option value="contextual">بيئة سياقية حقيقية واقعية</option>
                    <option value="minimalist_solid">أحادي صلب مينيمالي نقي</option>
                  </select>
                </div>

                {/* Safe zone toggle & fidelity */}
                <div className="flex flex-col justify-end space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer hover:bg-slate-100/70">
                    <input
                      type="checkbox"
                      checked={settings.safeZone}
                      onChange={(e) =>
                        onChangeSettings({
                          ...settings,
                          safeZone: e.target.checked,
                        })
                      }
                      className="rounded text-[#4C53DB] focus:ring-[#4C53DB]"
                    />
                    <span>منطقة آمنة مركزية بنسبة 50%</span>
                  </label>
                </div>
              </div>

              {/* Product preservation highlight */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px] leading-relaxed">
                  <strong>حفظ هوية المنتج:</strong> توسيط هندسي دون قص، تثبيت ألوان وخامات العبوة الأصلية، واقعية تجارية عالية الجودة مع منع اختلاق تفاصيل مخالفة.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
