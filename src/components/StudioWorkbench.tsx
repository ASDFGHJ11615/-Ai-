import React, { useState, useEffect } from 'react';
import {
  Sun,
  Crop,
  Shield,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
  Sparkles,
  Maximize2,
  X,
  Wand2,
} from 'lucide-react';
import {
  FramingSettings,
  CinematicLightingSettings,
  BrandKit,
  CreativeResult,
  TargetTool,
  PromptCrafterState,
} from '../types.ts';
import {
  CINEMATIC_RECIPES,
  CINEMATIC_LIGHTING_STYLES,
  DIMENSION_PRESETS,
} from '../data/presets.ts';
import { DimensionsFramingCard } from './DimensionsFramingCard.tsx';
import { CinematicLightingStudio } from './CinematicLightingStudio.tsx';
import { ToolDistributionCard } from './ToolDistributionCard.tsx';
import { PromptCrafterStudio } from './PromptCrafterStudio.tsx';

export type WorkbenchTab = 'crafter' | 'lighting' | 'framing' | 'analytics' | 'none';

interface StudioWorkbenchProps {
  framingSettings: FramingSettings;
  onUpdateFramingSettings?: (settings: FramingSettings) => void;
  onChangeFramingSettings?: (settings: FramingSettings) => void;
  lightingSettings: CinematicLightingSettings;
  onUpdateLightingSettings?: (settings: CinematicLightingSettings) => void;
  onChangeLightingSettings?: (settings: CinematicLightingSettings) => void;
  onApplyLightingToPrompt?: (snippet: string, arSnippet: string) => void;
  onApplyFramingToPrompt?: () => void;
  activeBrand: BrandKit | null;
  onOpenBrandVault: () => void;
  onDeactivateBrand?: () => void;
  history: CreativeResult[];
  onSelectTool?: (tool: TargetTool) => void;
  targetTool?: TargetTool;
  language?: 'ar' | 'en';
  promptCrafterPrefill?: Partial<PromptCrafterState>;
  onSendCrafterPromptToMain?: (prompt: string, tool: TargetTool, ratio: string) => void;
  activeTabOverride?: WorkbenchTab;
  onTabChange?: (tab: WorkbenchTab) => void;
}

export const StudioWorkbench: React.FC<StudioWorkbenchProps> = ({
  framingSettings,
  onUpdateFramingSettings,
  onChangeFramingSettings,
  lightingSettings,
  onUpdateLightingSettings,
  onChangeLightingSettings,
  onApplyLightingToPrompt,
  onApplyFramingToPrompt,
  activeBrand,
  onOpenBrandVault,
  onDeactivateBrand,
  history,
  onSelectTool,
  targetTool,
  language = 'ar',
  promptCrafterPrefill,
  onSendCrafterPromptToMain,
  activeTabOverride,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<WorkbenchTab>('none');
  const isAr = language === 'ar';

  const activeTab = activeTabOverride !== undefined ? activeTabOverride : internalTab;

  const setActiveTab = (tab: WorkbenchTab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleFramingChange = onUpdateFramingSettings || onChangeFramingSettings || (() => {});
  const handleLightingChange = onUpdateLightingSettings || onChangeLightingSettings || (() => {});

  const activeRecipe = CINEMATIC_RECIPES.find((r) => r.id === lightingSettings.recipeId);
  const activeStyle = CINEMATIC_LIGHTING_STYLES.find((s) => s.id === lightingSettings.styleId);

  const toggleTab = (tab: WorkbenchTab) => {
    setActiveTab(activeTab === tab ? 'none' : tab);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Workbench Header & Tab Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Quick Status Summary */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-[#111827]">
                {isAr ? 'استوديوهات وأدوات الإنتاج المتخصصة' : 'Specialized Production Studios'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                {activeTab === 'none'
                  ? (isAr ? 'مُختصرة' : 'Compact')
                  : (isAr ? 'لوحة نشطة' : 'Active Panel')}
              </span>
            </div>
            {/* Quick configuration chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
              <span>{isAr ? 'المقاس:' : 'Aspect:'} <strong className="text-slate-700 font-mono">{framingSettings.aspectRatio}</strong></span>
              <span>·</span>
              <span>{isAr ? 'الإضاءة:' : 'Lighting:'} <strong className="text-slate-700">{activeRecipe?.title || activeStyle?.name || 'مخصصة'}</strong></span>
              <span>·</span>
              <span>
                {isAr ? 'البراند:' : 'Brand:'}{' '}
                {activeBrand ? (
                  <strong className="text-emerald-700">{activeBrand.name}</strong>
                ) : (
                  <span className="text-slate-400">{isAr ? 'حر' : 'Free'}</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Tab 0: Guided Prompt Crafter Studio */}
          <button
            onClick={() => toggleTab('crafter')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'crafter'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'صياغة البرومبتات' : 'Prompt Crafter'}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                activeTab === 'crafter' ? 'bg-white/20 text-white' : 'bg-accent-light text-accent'
              }`}
            >
              {isAr ? 'موجه' : 'Guided'}
            </span>
          </button>

          {/* Tab 1: Cinematic Lighting Studio */}
          <button
            onClick={() => toggleTab('lighting')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'lighting'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{isAr ? 'الإضاءة السينمائية' : 'Cinematic Lighting'}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                activeTab === 'lighting' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-800'
              }`}
            >
              {activeRecipe?.title.slice(0, 10) || activeStyle?.name.slice(0, 10) || '10 أنماط'}
            </span>
          </button>

          {/* Tab 2: Dimensions & Framing */}
          <button
            onClick={() => toggleTab('framing')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'framing'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>{isAr ? 'المقاسات والتأطير' : 'Dimensions & Framing'}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                activeTab === 'framing' ? 'bg-white/20 text-white' : 'bg-accent-light text-accent'
              }`}
            >
              {framingSettings.aspectRatio}
            </span>
          </button>

          {/* Tab 3: Brand Vault */}
          <button
            onClick={onOpenBrandVault}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeBrand
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 ring-1 ring-emerald-500/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
            title={isAr ? 'إدارة خزانة الهوية البصرية والقواعد' : 'Manage Brand Vault'}
          >
            <Shield className={`w-3.5 h-3.5 ${activeBrand ? 'text-emerald-600' : 'text-accent'}`} />
            <span>{activeBrand ? activeBrand.name : (isAr ? 'خزانة البراند' : 'Brand Vault')}</span>
          </button>

          {/* Tab 4: Analytics */}
          <button
            onClick={() => toggleTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-accent text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'إحصائيات الأدوات' : 'Tool Stats'}</span>
            {history.length > 0 && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                  activeTab === 'analytics' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {history.length}
              </span>
            )}
          </button>

          {/* Toggle Expand/Collapse Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'none' ? 'crafter' : 'none')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title={activeTab === 'none' ? (isAr ? 'فتح الاستوديو' : 'Expand') : (isAr ? 'طي الاستوديو' : 'Collapse')}
            aria-label="Toggle studio panel"
          >
            {activeTab !== 'none' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Active Panel Content */}
      {activeTab !== 'none' && (
        <div className="p-4 sm:p-6 bg-slate-50/40 border-t border-slate-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-600">
              {activeTab === 'crafter' && (isAr ? 'استوديو كتابة وهندسة البرومبتات الاحترافية لأدوات توليد الصور (Midjourney, DALL-E, SD...):' : 'Professional Guided Prompt Crafter Studio:')}
              {activeTab === 'lighting' && (isAr ? 'إعدادات استوديو الإضاءة السينمائية المتقدمة:' : 'Cinematic Lighting Studio Controls:')}
              {activeTab === 'framing' && (isAr ? 'إعدادات المقاسات والتأطير التجاري للمنتج:' : 'Dimensions & Framing Controls:')}
              {activeTab === 'analytics' && (isAr ? 'تحليل توزيع الأدوات ومحركات التوليد:' : 'AI Engine Distribution Analytics:')}
            </span>
            <button
              onClick={() => setActiveTab('none')}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isAr ? 'إغلاق اللوحة' : 'Close Panel'}</span>
            </button>
          </div>

          {activeTab === 'crafter' && (
            <PromptCrafterStudio
              initialState={promptCrafterPrefill}
              onSendToMainStudio={onSendCrafterPromptToMain}
              language={language}
            />
          )}

          {activeTab === 'lighting' && (
            <CinematicLightingStudio
              settings={lightingSettings}
              onChangeSettings={handleLightingChange}
              onApplyToPrompt={onApplyLightingToPrompt}
            />
          )}

          {activeTab === 'framing' && (
            <DimensionsFramingCard
              settings={framingSettings}
              onChangeSettings={handleFramingChange}
              onApplyToPrompt={onApplyFramingToPrompt}
            />
          )}

          {activeTab === 'analytics' && (
            <ToolDistributionCard
              history={history}
              onSelectTool={onSelectTool || (() => {})}
            />
          )}
        </div>
      )}
    </div>
  );
};
