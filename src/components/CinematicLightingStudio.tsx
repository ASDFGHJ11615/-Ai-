import React, { useState } from 'react';
import {
  Sun,
  Flame,
  Moon,
  Sparkles,
  Sliders,
  Eye,
  Check,
  Copy,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Camera,
  Film,
  Zap,
  Maximize2,
  Minimize2,
  Info,
  Palette,
  Compass,
} from 'lucide-react';
import {
  CinematicLightingSettings,
  CinematicLightingStyleId,
  LightingRecipeId,
  CinematicPaletteId,
  KeyLightDirection,
  KeyLightHeight,
  LightSoftness,
  BeamSpread,
  ContrastRatioLevel,
  RimLightPower,
  VolumetricHazeLevel,
  ShadowDepthType,
  ReflectionStyle,
  BloomGlowStyle,
  LightingRatio,
} from '../types.ts';
import {
  CINEMATIC_LIGHTING_STYLES,
  CINEMATIC_PALETTES,
  CINEMATIC_RECIPES,
  DEFAULT_LIGHTING_SETTINGS,
  buildCinematicLightingPromptSnippet,
  buildCinematicLightingArabicSnippet,
} from '../data/presets.ts';

interface CinematicLightingStudioProps {
  settings: CinematicLightingSettings;
  onChangeSettings: (newSettings: CinematicLightingSettings) => void;
  onApplyToPrompt?: (promptSnippet: string, arabicSnippet: string) => void;
  isCompact?: boolean;
}

export const CinematicLightingStudio: React.FC<CinematicLightingStudioProps> = ({
  settings,
  onChangeSettings,
  onApplyToPrompt,
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isCompact);
  const [activeTab, setActiveTab] = useState<'recipes' | 'styles' | 'controls' | 'palettes'>('recipes');
  const [copiedSnippet, setCopiedSnippet] = useState<'en' | 'ar' | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const activeRecipe = CINEMATIC_RECIPES.find((r) => r.id === settings.recipeId);
  const activeStyle = CINEMATIC_LIGHTING_STYLES.find((s) => s.id === settings.styleId);
  const activePalette = CINEMATIC_PALETTES.find((p) => p.id === settings.palette);

  const englishSnippet = buildCinematicLightingPromptSnippet(settings);
  const arabicSnippet = buildCinematicLightingArabicSnippet(settings);

  const handleSelectRecipe = (recipeId: LightingRecipeId) => {
    const recipe = CINEMATIC_RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return;

    onChangeSettings({
      ...settings,
      ...recipe.settings,
      recipeId,
    });
  };

  const handleSelectStyle = (styleId: CinematicLightingStyleId) => {
    onChangeSettings({
      ...settings,
      styleId,
      recipeId: 'custom',
    });
  };

  const handleSelectPalette = (paletteId: CinematicPaletteId) => {
    onChangeSettings({
      ...settings,
      palette: paletteId,
      recipeId: 'custom',
    });
  };

  const handleReset = () => {
    onChangeSettings(DEFAULT_LIGHTING_SETTINGS);
  };

  const copyToClipboard = (text: string, type: 'en' | 'ar') => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(type);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleApply = () => {
    if (onApplyToPrompt) {
      onApplyToPrompt(englishSnippet, arabicSnippet);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  // Color temperature to approximate RGB color for visualizer
  const getKelvinColor = (kelvin: number): string => {
    if (kelvin < 3000) return '#F59E0B'; // Warm amber
    if (kelvin < 4000) return '#FBBF24'; // Warm yellow
    if (kelvin < 5500) return '#FEF3C7'; // Warm studio white
    if (kelvin < 6500) return '#E0F2FE'; // Clean daylight
    return '#93C5FD'; // Cool blue
  };

  const kelvinHex = getKelvinColor(settings.colorTemperatureK);

  // Calculate Key light coordinate in 200x200 visualizer circle
  const visualAngleRad = ((settings.keyLightAngle - 90) * Math.PI) / 180;
  const orbRadius = 70;
  const orbX = 100 + orbRadius * Math.cos(visualAngleRad);
  const orbY = 100 + orbRadius * Math.sin(visualAngleRad);

  return (
    <div className="bg-white rounded-3xl border-2 border-[#4C53DB]/20 shadow-md p-5 sm:p-7 space-y-6 relative overflow-hidden transition-all">
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#4C53DB] to-cyan-500" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#4C53DB]/15 to-cyan-500/15 text-[#4C53DB] flex items-center justify-center shrink-0 shadow-xs border border-[#4C53DB]/15">
            <Sun className="w-6 h-6 text-amber-600 animate-spin-slow" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                استوديو الإضاءة السينمائية المتقدمة
              </h3>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#4C53DB]/10 text-[#4C53DB] border border-[#4C53DB]/20">
                Cinematic Lighting Studio
              </span>
              {activeRecipe && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  وصفة: {activeRecipe.title}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              هندسة مصادر الضوء، الزوايا، التباين، حرارة اللون (Kelvin)، والانعكاسات مع الحفاظ التام على أصل المنتج
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onApplyToPrompt && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4C53DB] to-[#7C3AED] hover:from-[#434ac9] hover:to-[#6d28d9] text-white text-xs font-black transition shadow-xs cursor-pointer active:scale-95"
              title="تطبيق وصف الإضاءة فوراً على البرومبت النهائي"
            >
              {appliedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>تم التطبيق على البرومبت!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>تطبيق على البرومبت النهائي</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
            title="إعادة ضبط إعدادات الإضاءة إلى الوضع الافتراضي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إعادة ضبط</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
            aria-label={isOpen ? 'طي قسم الإضاءة' : 'توسيع قسم الإضاءة'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Interactive Lighting Visualizer Stage & Telemetry Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-inner overflow-hidden relative">
            {/* Atmospheric background glow from color temp and palette */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
              style={{
                background: `radial-gradient(circle at ${orbX}% ${orbY}%, ${kelvinHex} 0%, transparent 60%)`,
              }}
            />

            {/* Visualizer Stage (Left / Col 5) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 relative">
              <span className="text-[11px] font-extrabold text-slate-400 mb-2 flex items-center gap-1.5 self-start">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>محاكي استوديو الإضاءة التفاعلي (Live 360° Studio Simulator)</span>
              </span>

              {/* 2D/3D Stage SVG */}
              <div className="relative w-56 h-56 flex items-center justify-center select-none">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Orbit Guide Rings */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="45" fill="none" stroke="#1E293B" strokeWidth="1" />

                  {/* Volumetric Haze & Rays if enabled */}
                  {settings.volumetricHaze !== 'none' && (
                    <g opacity={settings.volumetricHaze === 'god_rays' ? '0.35' : '0.18'}>
                      <polygon
                        points={`${orbX},${orbY} 70,120 130,120`}
                        fill={`url(#rayGradient)`}
                      />
                      <defs>
                        <linearGradient id="rayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={kelvinHex} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={kelvinHex} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </g>
                  )}

                  {/* Floor Pedestal & Drop Shadow (Cast opposite to key light) */}
                  <ellipse
                    cx={100 - (settings.keyLightAngle / 90) * 16}
                    cy={130}
                    rx={28 + (settings.intensity / 100) * 6}
                    ry={9}
                    fill="#000000"
                    opacity={
                      settings.shadowDepth === 'deep_black'
                        ? '0.85'
                        : settings.shadowDepth === 'crisp'
                        ? '0.7'
                        : settings.shadowDepth === 'feathered'
                        ? '0.45'
                        : '0.25'
                    }
                  />

                  {/* Pedestal Cylinder */}
                  <ellipse cx="100" cy="120" rx="36" ry="10" fill="#1E293B" stroke="#475569" strokeWidth="1" />

                  {/* Product Silhouette / Hero representation */}
                  <g className="transition-all duration-300">
                    <rect
                      x="87"
                      y="70"
                      width="26"
                      height="46"
                      rx="6"
                      fill="#0F172A"
                      stroke={settings.rimLightPower !== 'off' ? kelvinHex : '#64748B'}
                      strokeWidth={settings.rimLightPower === 'intense' || settings.rimLightPower === 'halo' ? '2.5' : '1.5'}
                    />
                    {/* Glass/metal shine highlight */}
                    {settings.reflections === 'specular_glossy' && (
                      <path
                        d="M91 74 L94 110"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.75"
                      />
                    )}
                    {/* Safe Zone indicator box */}
                    <rect
                      x="82"
                      y="64"
                      width="36"
                      height="58"
                      rx="3"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                  </g>

                  {/* Key Light Beam Line from Orb to Product */}
                  <line
                    x1={orbX}
                    y1={orbY}
                    x2="100"
                    y2="95"
                    stroke={kelvinHex}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.8"
                  />

                  {/* Key Light Lamp Orb */}
                  <circle
                    cx={orbX}
                    cy={orbY}
                    r={7 + (settings.intensity / 100) * 3}
                    fill={kelvinHex}
                    filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))"
                    className="cursor-pointer transition-all"
                  />
                  <text
                    x={orbX}
                    y={orbY - 10}
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    Key {settings.keyLightAngle}°
                  </text>

                  {/* Fill Light (Soft subtle opposite light) */}
                  <circle cx="45" cy="130" r="4" fill="#64748B" opacity="0.6" />
                  <text x="45" y="142" fill="#94A3B8" fontSize="8" textAnchor="middle">
                    Fill
                  </text>

                  {/* Rim Light icon at back if active */}
                  {settings.rimLightPower !== 'off' && (
                    <circle cx="100" cy="35" r="4.5" fill={kelvinHex} opacity="0.9" />
                  )}
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-0 right-0 left-0 flex items-center justify-between text-[10px] text-slate-400 px-2 font-mono">
                  <span>زاوية الضوء: {settings.keyLightAngle}°</span>
                  <span style={{ color: kelvinHex }}>حرارة اللون: {settings.colorTemperatureK}K</span>
                </div>
              </div>
            </div>

            {/* Telemetry & Quick Highlights (Right / Col 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-r border-slate-800 pt-4 lg:pt-0 lg:pr-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                      معايرة الإضاءة الحالية | Studio Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 border border-slate-700">
                    نسبة التباين: {settings.lightingRatio}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">مصدر الضوء (Key):</span>
                    <span className="font-extrabold text-amber-400 font-mono">
                      {settings.keyLightAngle}° / {settings.keyLightHeight}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">شدة ونعومة:</span>
                    <span className="font-extrabold text-slate-100 font-mono">
                      {settings.intensity}% | {settings.softness === 'hard_direct' ? 'بؤري' : settings.softness === 'ultra_soft_silk' ? 'حريري' : 'مشتت'}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">إضاءة الحواف (Rim):</span>
                    <span className="font-extrabold text-cyan-400 capitalize">
                      {settings.rimLightPower}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">الضباب الحجمي:</span>
                    <span className="font-extrabold text-violet-400 capitalize">
                      {settings.volumetricHaze === 'none' ? 'نقي' : settings.volumetricHaze}
                    </span>
                  </div>
                </div>

                {/* Brand & Product Fidelity Guarantee Badge */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed text-slate-300">
                    <span className="font-bold text-emerald-400">حماية الهوية والخامات: </span>
                    يتم الحفاظ على تفاصيل وشكل وهوية وشعار المنتج 100%، وتكييف انعكاسات الإضاءة السينمائية لتبرز جمالية العبوة وخاماتها دون أي تحوير.
                  </div>
                </div>
              </div>

              {/* Quick Tab Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('recipes')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'recipes'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الوصفات الجاهزة (10)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('styles')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'styles'
                      ? 'bg-[#4C53DB] text-white font-black shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>الأنماط السينمائية (10)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('controls')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'controls'
                      ? 'bg-violet-600 text-white font-black shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>لوحة التحكم الدقيقة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('palettes')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'palettes'
                      ? 'bg-cyan-600 text-white font-black shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>لوحات الألوان (8)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab 1: Ready-made Recipes (10 وصفات إضاءة جاهزة) */}
          {activeTab === 'recipes' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>وصفات إضاءة احترافية مسبقة الإعداد (10 وصفات دقيقة):</span>
                </h4>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  انقر على أي وصفة لتطبيق توزيع الإضاءة والحرارة والظلال فوراً
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CINEMATIC_RECIPES.map((recipe) => {
                  const isSelected = settings.recipeId === recipe.id;
                  return (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => handleSelectRecipe(recipe.id)}
                      className={`text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-slate-50/60 hover:bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {recipe.category}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-800">
                              <Check className="w-3.5 h-3.5 text-amber-600" />
                              <span>مُفعّلة</span>
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs sm:text-sm font-black text-[#111827] group-hover:text-amber-700 transition">
                          {recipe.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{recipe.titleEn}</span>
                        <span className="text-[#4C53DB] font-bold">تطبيق ⚡</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Cinematic Lighting Styles (10 أنماط سينمائية) */}
          {activeTab === 'styles' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#4C53DB]" />
                  <span>أنماط الإضاءة السينمائية (10 أنماط متميزة):</span>
                </h4>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  اختر النمط السينمائي الأساسي لتحديد الطابع الدرامي والجمالي للمشهد
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {CINEMATIC_LIGHTING_STYLES.map((style) => {
                  const isSelected = settings.styleId === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectStyle(style.id)}
                      className={`text-right p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 relative ${
                        isSelected
                          ? 'bg-indigo-50/70 border-[#4C53DB] shadow-md ring-2 ring-[#4C53DB]/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`h-2 rounded-full w-full bg-gradient-to-r ${style.previewGradient}`}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {style.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4C53DB]" />}
                        </div>
                        <h5 className="text-xs font-black text-[#111827] leading-snug">
                          {style.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 line-clamp-2">
                          {style.description}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block" dir="ltr">
                        {style.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Deep Control Panel (لوحة التحكم السينمائية الدقيقة) */}
          {activeTab === 'controls' && (
            <div className="space-y-6 bg-slate-50/70 rounded-2xl p-5 border border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-600" />
                  <span>لوحة التحكم الدقيقة في بارامترات الإضاءة السينمائية:</span>
                </h4>
                <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full">
                  تحكم احترافي يدوي
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {/* 1. Key Light Direction & Angle */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>اتجاه وزاوية الضوء الرئيسي:</span>
                    </label>
                    <span className="font-mono font-bold text-[#4C53DB]">{settings.keyLightAngle}°</span>
                  </div>

                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={settings.keyLightAngle}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        keyLightAngle: Number(e.target.value),
                        recipeId: 'custom',
                      })
                    }
                    className="w-full accent-[#4C53DB] cursor-pointer"
                  />

                  <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                    {(
                      [
                        { id: 'front', label: 'أمامي 0°' },
                        { id: 'side_45', label: 'جانبي 45°' },
                        { id: 'profile_90', label: 'بروفايل 90°' },
                        { id: 'overhead_top', label: 'علوي 90°' },
                        { id: 'low_angle_up', label: 'منخفض 20°' },
                      ] as { id: KeyLightDirection; label: string }[]
                    ).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            keyLightDirection: d.id,
                            keyLightAngle:
                              d.id === 'front'
                                ? 0
                                : d.id === 'side_45'
                                ? 45
                                : d.id === 'profile_90'
                                ? 90
                                : d.id === 'overhead_top'
                                ? 0
                                : 65,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1 px-1 rounded text-center font-bold transition cursor-pointer ${
                          settings.keyLightDirection === d.id
                            ? 'bg-[#4C53DB] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Intensity & Softness */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>شدة الإضاءة ونعومتها:</span>
                    </label>
                    <span className="font-mono font-bold text-amber-600">{settings.intensity}%</span>
                  </div>

                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={settings.intensity}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        intensity: Number(e.target.value),
                        recipeId: 'custom',
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    {(
                      [
                        { id: 'hard_direct', label: 'بؤري حاد (Hard)' },
                        { id: 'medium_diffused', label: 'سوفت بوكس (Medium)' },
                        { id: 'ultra_soft_silk', label: 'حريري ناعم (Silk)' },
                      ] as { id: LightSoftness; label: string }[]
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            softness: s.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`flex-1 py-1 px-1.5 rounded-lg text-center font-bold transition cursor-pointer text-[10px] ${
                          settings.softness === s.id
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Color Temperature (Kelvin) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>حرارة اللون (Color Temperature):</span>
                    </label>
                    <span className="font-mono font-bold" style={{ color: kelvinHex }}>
                      {settings.colorTemperatureK}K
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2700"
                    max="8000"
                    step="100"
                    value={settings.colorTemperatureK}
                    onChange={(e) =>
                      onChangeSettings({
                        ...settings,
                        colorTemperatureK: Number(e.target.value),
                        recipeId: 'custom',
                      })
                    }
                    className="w-full cursor-pointer accent-[#4C53DB]"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>2700K دافئ عنبري</span>
                    <span>5500K نهاري محايد</span>
                    <span>8000K بارد أزرق</span>
                  </div>
                </div>

                {/* 4. Lighting Ratio & Contrast */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">
                    نسبة توزيع الضوء (Lighting Ratio):
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    {(
                      [
                        { id: '1:1', label: '1:1 مسطح ناعم' },
                        { id: '2:1', label: '2:1 طبيعي متوازن' },
                        { id: '4:1', label: '4:1 درامي تجاري' },
                        { id: '8:1', label: '8:1 كياروسكورو' },
                      ] as { id: LightingRatio; label: string }[]
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            lightingRatio: r.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold font-mono transition cursor-pointer text-[10px] ${
                          settings.lightingRatio === r.id
                            ? 'bg-[#111827] text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Rim Light & Backlight Power */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">
                    إضاءة الحواف والخلفية (Rim Light):
                  </label>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {(
                      [
                        { id: 'off', label: 'معطلة' },
                        { id: 'subtle', label: 'خافتة' },
                        { id: 'medium', label: 'متوسطة' },
                        { id: 'intense', label: 'قوية' },
                        { id: 'halo', label: 'هالة 360°' },
                      ] as { id: RimLightPower; label: string }[]
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            rimLightPower: p.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold transition cursor-pointer ${
                          settings.rimLightPower === p.id
                            ? 'bg-cyan-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Volumetric Haze & God Rays */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">
                    الضباب الحجمي والأشعة الظاهرة:
                  </label>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {(
                      [
                        { id: 'none', label: 'هواء نقي' },
                        { id: 'light_mist', label: 'رذاذ خفيف' },
                        { id: 'atmospheric_haze', label: 'ضباب سينمائي' },
                        { id: 'god_rays', label: 'أشعة حجمية' },
                      ] as { id: VolumetricHazeLevel; label: string }[]
                    ).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            volumetricHaze: h.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold transition cursor-pointer ${
                          settings.volumetricHaze === h.id
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Shadow Depth */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">عمق وسلوك الظلال:</label>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {(
                      [
                        { id: 'crisp', label: 'هندسية حادة' },
                        { id: 'feathered', label: 'متدرجة ناعمة' },
                        { id: 'deep_black', label: 'فحمية عميقة' },
                        { id: 'ambient_fill', label: 'مضاءة بالكامل' },
                      ] as { id: ShadowDepthType; label: string }[]
                    ).map((sd) => (
                      <button
                        key={sd.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            shadowDepth: sd.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold transition cursor-pointer ${
                          settings.shadowDepth === sd.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sd.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Reflections */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">نمط الانعكاسات على المنتج:</label>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {(
                      [
                        { id: 'specular_glossy', label: 'بريق عاكس (Gloss)' },
                        { id: 'diffused_matte', label: 'مطفي ناعم (Matte)' },
                        { id: 'anamorphic_glare', label: 'أنامورفيك' },
                        { id: 'wet_surface', label: 'أسطح رطبة' },
                      ] as { id: ReflectionStyle; label: string }[]
                    ).map((rf) => (
                      <button
                        key={rf.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            reflections: rf.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold transition cursor-pointer ${
                          settings.reflections === rf.id
                            ? 'bg-[#4C53DB] text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {rf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 9. Bloom & Optical Glow */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-extrabold text-slate-800 block">التوهج الضوئي والعدسات:</label>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {(
                      [
                        { id: 'none', label: 'بدون توهج' },
                        { id: 'subtle_lens', label: 'وهج خافت' },
                        { id: 'vintage_halation', label: 'هالة فيلمية' },
                        { id: 'anamorphic_streak', label: 'خط أزرق' },
                      ] as { id: BloomGlowStyle; label: string }[]
                    ).map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() =>
                          onChangeSettings({
                            ...settings,
                            bloomGlow: bg.id,
                            recipeId: 'custom',
                          })
                        }
                        className={`py-1.5 px-1 rounded-lg text-center font-bold transition cursor-pointer ${
                          settings.bloomGlow === bg.id
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Cinematic Palettes (8 لوحات ألوان سينمائية) */}
          {activeTab === 'palettes' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-600" />
                  <span>لوحات الألوان السينمائية المتناسقة مع الإضاءة (8 لوحات):</span>
                </h4>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  تنسيق الدرجات اللونية للإضاءة لتلائم طابع وهوية العمل
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CINEMATIC_PALETTES.map((pal) => {
                  const isSelected = settings.palette === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => handleSelectPalette(pal.id)}
                      className={`text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-cyan-50/70 border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-[#111827]">{pal.name}</h5>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {pal.description}
                        </p>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        {pal.colors.map((c, idx) => (
                          <div
                            key={idx}
                            className="h-5 flex-1 rounded-md shadow-2xs border border-black/10"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Smart Prompt Linking Preview Box (الربط الذكي بالبرومبتات) */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                  الصياغة التقنية المخصصة للبرومبت | Cinematic Lighting Prompt Specification
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(englishSnippet, 'en')}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  {copiedSnippet === 'en' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>نسخ الإنجليزي</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(arabicSnippet, 'ar')}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                >
                  {copiedSnippet === 'ar' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>نسخ العربي</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* English snippet preview */}
            <div
              className="bg-black/60 p-3 rounded-xl font-mono text-[11px] sm:text-xs text-amber-200/90 leading-relaxed border border-amber-500/20 text-left select-all overflow-x-auto whitespace-pre-wrap break-words"
              dir="ltr"
            >
              {englishSnippet}
            </div>

            {/* Arabic snippet preview */}
            <div className="bg-slate-800/60 p-3 rounded-xl text-[11px] text-slate-300 leading-relaxed text-right border border-slate-700 select-all">
              {arabicSnippet}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
