/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
  ChevronDown,
  Volume2,
  Share2,
  BarChart3,
  Lightbulb,
  Eye,
  Settings2,
  Terminal,
  Shield,
  ShieldCheck,
} from 'lucide-react';

import {
  CreativeMode,
  CreativeResult,
  CreativeConcept,
  TargetTool,
  BrandKit,
  FramingSettings,
  QuickInstantIdea,
  CinematicLightingSettings,
  PromptCrafterState,
} from './types.ts';
import {
  DEFAULT_BRAND_KITS,
  DEFAULT_FRAMING_SETTINGS,
  DEFAULT_LIGHTING_SETTINGS,
  DIMENSION_PRESETS,
  generateDefaultQuickIdeas,
} from './data/presets.ts';
import { Header } from './components/Header.tsx';
import { ModeSelector } from './components/ModeSelector.tsx';
import { CreativeTeamBar } from './components/CreativeTeamBar.tsx';
import { StudioInput } from './components/StudioInput.tsx';
import { StudioWorkbench, WorkbenchTab } from './components/StudioWorkbench.tsx';
import { DimensionsFramingCard } from './components/DimensionsFramingCard.tsx';
import { CinematicLightingStudio } from './components/CinematicLightingStudio.tsx';
import { QuickInstantIdeasCard } from './components/QuickInstantIdeasCard.tsx';
import { ToolDistributionCard } from './components/ToolDistributionCard.tsx';
import { VisualAnalysisCard } from './components/VisualAnalysisCard.tsx';
import { ConceptsCard } from './components/ConceptsCard.tsx';
import { PromptCard } from './components/PromptCard.tsx';
import { CopywritingCard } from './components/CopywritingCard.tsx';
import { StoryCard } from './components/StoryCard.tsx';
import { FollowUpActions } from './components/FollowUpActions.tsx';
import { StudioKnowledgeModal } from './components/StudioKnowledgeModal.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { BrandVaultModal } from './components/BrandVaultModal.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { getSavedAccentColor, applyAccentColor } from './utils/accentColor.ts';

const STORAGE_KEY = 'creative_studio_history_v1';
const BRANDS_STORAGE_KEY = 'creative_studio_brand_kits_v1';
const ACTIVE_BRAND_KEY = 'creative_studio_active_brand_id_v1';
const FRAMING_STORAGE_KEY = 'creative_studio_framing_v1';
const LIGHTING_STORAGE_KEY = 'creative_studio_lighting_v1';

export default function App() {
  const [currentAccent, setCurrentAccent] = useState<string>(getSavedAccentColor);
  const [mode, setMode] = useState<CreativeMode>('concept');
  const [targetTool, setTargetTool] = useState<TargetTool>('universal');
  const [personaFocus, setPersonaFocus] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Brand Vault state
  const [brandKits, setBrandKits] = useState<BrandKit[]>(DEFAULT_BRAND_KITS);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [isBrandVaultOpen, setIsBrandVaultOpen] = useState(false);

  // Dimensions & Framing state
  const [framingSettings, setFramingSettings] = useState<FramingSettings>(DEFAULT_FRAMING_SETTINGS);

  // Cinematic Lighting Studio state
  const [lightingSettings, setLightingSettings] = useState<CinematicLightingSettings>(DEFAULT_LIGHTING_SETTINGS);

  // Quick Instant Ideas state
  const [quickIdeas, setQuickIdeas] = useState<QuickInstantIdea[]>([]);
  const [isQuickIdeasLoading, setIsQuickIdeasLoading] = useState(false);

  // Workbench and Prompt Crafter state
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('none');
  const [promptCrafterPrefill, setPromptCrafterPrefill] = useState<Partial<PromptCrafterState> | undefined>(undefined);

  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState<{
    data: string;
    mimeType: string;
    name?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreativeResult | null>(null);
  const [history, setHistory] = useState<CreativeResult[]>([]);

  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Abort controller ref to cancel stale requests and prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history and brand kits from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }

    try {
      const savedBrands = localStorage.getItem(BRANDS_STORAGE_KEY);
      if (savedBrands) {
        setBrandKits(JSON.parse(savedBrands));
      } else {
        setBrandKits(DEFAULT_BRAND_KITS);
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(DEFAULT_BRAND_KITS));
      }

      const savedActiveBrand = localStorage.getItem(ACTIVE_BRAND_KEY);
      if (savedActiveBrand) {
        setActiveBrandId(savedActiveBrand);
      }
    } catch (e) {
      console.warn('Failed to load brand kits from localStorage', e);
    }

    try {
      const savedFraming = localStorage.getItem(FRAMING_STORAGE_KEY);
      if (savedFraming) {
        setFramingSettings(JSON.parse(savedFraming));
      }
    } catch (e) {
      console.warn('Failed to load framing settings', e);
    }

    try {
      const savedLighting = localStorage.getItem(LIGHTING_STORAGE_KEY);
      if (savedLighting) {
        setLightingSettings(JSON.parse(savedLighting));
      }
    } catch (e) {
      console.warn('Failed to load lighting settings from localStorage', e);
    }
  }, []);

  // Cycle loading step message for engaging persona feedback during generation
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Brand Vault handlers
  const handleSelectActiveBrand = (id: string | null) => {
    setActiveBrandId(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_BRAND_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_BRAND_KEY);
      }
    } catch (e) {}
  };

  const handleSaveBrandKit = (kit: BrandKit) => {
    setBrandKits((prev) => {
      const existingIdx = prev.findIndex((k) => k.id === kit.id);
      let updated: BrandKit[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = kit;
      } else {
        updated = [kit, ...prev];
      }
      try {
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    handleSelectActiveBrand(kit.id);
  };

  const handleDeleteBrandKit = (id: string) => {
    setBrandKits((prev) => {
      const updated = prev.filter((k) => k.id !== id);
      try {
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (activeBrandId === id) {
      handleSelectActiveBrand(null);
    }
  };

  const handleResetBrandKits = () => {
    setBrandKits(DEFAULT_BRAND_KITS);
    try {
      localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(DEFAULT_BRAND_KITS));
    } catch (e) {}
  };

  const handleUpdateFramingSettings = (newSettings: FramingSettings) => {
    setFramingSettings(newSettings);
    try {
      localStorage.setItem(FRAMING_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {}
  };

  const handleAspectRatioChange = (newRatio: string, presetId: string) => {
    const preset = DIMENSION_PRESETS.find((p) => p.id === presetId);
    const updatedFraming: FramingSettings = {
      ...framingSettings,
      dimensionId: presetId,
      aspectRatio: newRatio,
      width: preset ? preset.width : framingSettings.width,
      height: preset ? preset.height : framingSettings.height,
    };
    handleUpdateFramingSettings(updatedFraming);

    if (result) {
      const updatedResult = { ...result };
      const oldRatio = result.finalPrompt.aspectRatio || '16:9';
      updatedResult.finalPrompt = {
        ...result.finalPrompt,
        aspectRatio: newRatio,
      };

      if (result.targetTool === 'midjourney') {
        let params = result.finalPrompt.parameters || '';
        if (params.includes('--ar')) {
          params = params.replace(/--ar\s+[0-9]+:[0-9]+/g, `--ar ${newRatio}`);
        } else {
          params = `--ar ${newRatio} ${params}`.trim();
        }
        updatedResult.finalPrompt.parameters = params;
      }

      let enText = result.finalPrompt.englishPrompt || '';
      if (enText.includes(oldRatio)) {
        enText = enText.replace(new RegExp(oldRatio, 'g'), newRatio);
      }
      if (result.targetTool === 'midjourney' && enText.includes('--ar')) {
        enText = enText.replace(/--ar\s+[0-9]+:[0-9]+/g, `--ar ${newRatio}`);
      }
      updatedResult.finalPrompt.englishPrompt = enText;

      if (updatedResult.suggestedSettings) {
        updatedResult.suggestedSettings.aspectRatio = newRatio;
        if (result.targetTool === 'midjourney') {
          updatedResult.suggestedSettings.parameters = updatedResult.finalPrompt.parameters;
        }
      }

      setResult(updatedResult);
      saveToHistory(updatedResult);
    }
  };

  const activeBrand = brandKits.find((k) => k.id === activeBrandId) || null;

  const handleAccentChange = (newHex: string) => {
    setCurrentAccent(newHex);
    applyAccentColor(newHex);
  };

  const saveToHistory = (item: CreativeResult) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const executeProcess = async (
    promptText: string,
    imageObj: { data: string; mimeType: string; name?: string } | null,
    actionOverride?: { label: string; id: string },
    toolOverride?: TargetTool
  ) => {
    // Prevent duplicate rapid calls
    if (isLoading && !actionOverride && !toolOverride) {
      return;
    }

    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    if (actionOverride) {
      setActiveActionId(actionOverride.id);
    }

    try {
      const activeTool = toolOverride || targetTool;
      const res = await fetch('/api/creative/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          mode,
          prompt: promptText,
          image: imageObj,
          targetTool: activeTool,
          action: actionOverride ? actionOverride.label : undefined,
          personaFocus: personaFocus || undefined,
          language,
          brandKit: activeBrand || undefined,
          framingSettings,
          lightingSettings,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'حدث خطأ أثناء الاتصال باستوديو الإبداع.');
      }

      const generatedData = json.data;

      // Extract and validate prompt
      const finalPromptObj = generatedData.finalPrompt || {};
      const englishPromptText =
        (typeof finalPromptObj === 'string'
          ? finalPromptObj
          : finalPromptObj.englishPrompt ||
            finalPromptObj.prompt ||
            generatedData.englishPrompt ||
            generatedData.prompt ||
            '') || '';

      const newResult: CreativeResult = {
        id: `res-${Date.now()}`,
        timestamp: Date.now(),
        mode,
        targetTool: activeTool,
        userPrompt: promptText,
        hasImage: Boolean(imageObj),
        title: generatedData.title || 'مشروع إبداعي جديد',
        summary: generatedData.summary || generatedData.creativeIdea || '',
        creativeIdea: generatedData.creativeIdea || generatedData.summary || '',
        visualConception: generatedData.visualConception || generatedData.creativeIdea || '',
        isPromptOnly: Boolean(generatedData.isPromptOnly),
        brandKitApplied: generatedData.brandKitApplied || (activeBrand ? { name: activeBrand.name, colors: activeBrand.colors } : undefined),
        finalPrompt: {
          targetTool: finalPromptObj.targetTool || activeTool,
          englishPrompt: englishPromptText,
          arabicPrompt: finalPromptObj.arabicPrompt || generatedData.arabicPrompt || '',
          aspectRatio: finalPromptObj.aspectRatio || generatedData.aspectRatio || '16:9',
          parameters: finalPromptObj.parameters || generatedData.parameters || '',
          negativePrompt: finalPromptObj.negativePrompt || generatedData.negativePrompt || '',
          breakdown: finalPromptObj.breakdown || {},
        },
        suggestedSettings: generatedData.suggestedSettings || {
          targetTool: activeTool,
          aspectRatio: finalPromptObj.aspectRatio || '16:9',
          parameters: finalPromptObj.parameters || '',
          negativePrompt: finalPromptObj.negativePrompt || '',
          notes: `إعدادات مخصصة لمحرك ${activeTool}`,
        },
        activePersonas: generatedData.activePersonas || [],
        visualAnalysis: generatedData.visualAnalysis,
        concepts: generatedData.concepts,
        storyOpening: generatedData.storyOpening,
        copywritingElements: generatedData.copywritingElements,
        creativeAdvice: generatedData.creativeAdvice,
        suggestedActions: generatedData.suggestedActions,
        framingSettings: generatedData.framingSettings || framingSettings,
        lightingSettings: generatedData.lightingSettings || lightingSettings,
        quickIdeas: generatedData.quickIdeas,
        rawResponse: generatedData.rawResponse,
      };

      setResult(newResult);
      saveToHistory(newResult);

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('studio-results-container');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted by a newer request; ignore silently
        return;
      }
      console.error(err);
      setError(
        err.message ||
          'تعذر استكمال العملية الإبداعية. تحقق من إعداد مفتاح GEMINI_API_KEY وحاول مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
      setActiveActionId(null);
    }
  };

  const handleUpdateLightingSettings = (newSettings: CinematicLightingSettings) => {
    setLightingSettings(newSettings);
    try {
      localStorage.setItem(LIGHTING_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {}
  };

  const handleApplyLightingToPrompt = (promptSnippet: string, arabicSnippet: string) => {
    if (!result) return;

    let updatedEnglish = result.finalPrompt.englishPrompt || '';
    if (updatedEnglish.includes('Cinematic Lighting:')) {
      updatedEnglish = updatedEnglish.replace(/Cinematic Lighting:.*?(\.|$)/is, `${promptSnippet}`);
    } else {
      updatedEnglish = `${updatedEnglish.trim()} ${promptSnippet}`;
    }

    let updatedArabic = result.finalPrompt.arabicPrompt || '';
    if (updatedArabic.includes('إضاءة سينمائية')) {
      updatedArabic = updatedArabic.replace(/إضاءة سينمائية.*?(\.|$)/is, `${arabicSnippet}`);
    } else {
      updatedArabic = `${updatedArabic.trim()}\n${arabicSnippet}`;
    }

    const updatedResult: CreativeResult = {
      ...result,
      lightingSettings,
      finalPrompt: {
        ...result.finalPrompt,
        englishPrompt: updatedEnglish,
        arabicPrompt: updatedArabic,
        breakdown: {
          ...result.finalPrompt.breakdown,
          lighting: promptSnippet,
        },
      },
    };

    setResult(updatedResult);
    saveToHistory(updatedResult);
  };

  const handleRequestQuickIdeas = async (
    promptText: string,
    imageObj: { data: string; mimeType: string; name?: string } | null
  ) => {
    setIsQuickIdeasLoading(true);
    try {
      const res = await fetch('/api/creative/quick-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          image: imageObj,
          brandKit: activeBrand,
          framingSettings,
          lightingSettings,
          targetTool,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.quickIdeas && json.data.quickIdeas.length > 0) {
        setQuickIdeas(json.data.quickIdeas);
      } else {
        const fallbacks = generateDefaultQuickIdeas(
          promptText || 'المنتج التجاري الفاخر',
          activeBrand,
          targetTool,
          framingSettings
        );
        setQuickIdeas(fallbacks);
      }
    } catch (e) {
      const fallbacks = generateDefaultQuickIdeas(
        promptText || 'المنتج التجاري الفاخر',
        activeBrand,
        targetTool,
        framingSettings
      );
      setQuickIdeas(fallbacks);
    } finally {
      setIsQuickIdeasLoading(false);
    }
  };

  const handleSelectQuickIdea = (idea: QuickInstantIdea) => {
    setCurrentPrompt(idea.finalPrompt);
    executeProcess(idea.finalPrompt, currentImage);
  };

  const handleUpdateQuickIdea = (updatedIdea: QuickInstantIdea) => {
    setQuickIdeas((prev) => prev.map((item) => (item.id === updatedIdea.id ? updatedIdea : item)));
  };

  const handleInputSubmit = (
    promptText: string,
    imageObj: { data: string; mimeType: string; name?: string } | null
  ) => {
    setCurrentPrompt(promptText);
    setCurrentImage(imageObj);
    executeProcess(promptText, imageObj);
  };

  const handleFollowUpAction = (actionLabel: string, actionId: string) => {
    const basePrompt = currentPrompt || result?.userPrompt || '';
    executeProcess(basePrompt, currentImage, { label: actionLabel, id: actionId });
  };

  const handleToolChange = (newTool: TargetTool) => {
    setTargetTool(newTool);
    if (result) {
      const basePrompt = currentPrompt || result.userPrompt;
      executeProcess(basePrompt, currentImage, undefined, newTool);
    }
  };

  const handleAdoptConcept = (concept: CreativeConcept) => {
    const conceptPrompt = `المفهوم المعتمد: ${concept.name}.\nالفكرة الإعلانية: ${concept.adIdea}.\nالرسالة: ${concept.message}.\nالمشهد البصري: ${concept.visualScene}.\nاكتب البرومبت النهائي المخصص لهذا المفهوم بدقة بالغة.`;
    setCurrentPrompt(conceptPrompt);
    executeProcess(conceptPrompt, currentImage);
  };

  const handleUseEvolutionIdea = (evolutionIdea: string) => {
    const newPrompt = `تطوير الصورة المرجعية بناءً على هذا التصور الإبداعي: ${evolutionIdea}`;
    setCurrentPrompt(newPrompt);
    executeProcess(newPrompt, currentImage);
  };

  const handleAskKnowledgeQuestion = (question: string) => {
    setMode('support');
    setCurrentPrompt(question);
    executeProcess(question, null);
  };

  const handleResetSession = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setResult(null);
    setCurrentPrompt('');
    setCurrentImage(null);
    setError(null);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    document.documentElement.setAttribute('lang', nextLang);
    document.documentElement.setAttribute('dir', nextLang === 'ar' ? 'rtl' : 'ltr');
  };

  const LOADING_STEPS = [
    { title: 'المدير الإبداعي يدرس الفكرة...', desc: 'استبعاد الكليشيهات وابتكار الرسالة البصرية' },
    { title: 'المخرج الفني يحدد التكوين والضوء...', desc: 'دراسة المنظور وزوايا الكاميرا ولوحة الألوان' },
    { title: 'مهندس البرومبتات يصيغ التعليمات...', desc: `تكييف المعايير والبارامترات لأداة ${targetTool}` },
    { title: 'تجهيز البرومبت الإنتاجي...', desc: 'مراجعة خلو البرومبت من الحشو وتجهيزه للنسخ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#111827]">
      {/* Top Studio Header */}
      <Header
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBrandVault={() => setIsBrandVaultOpen(true)}
        activeBrandName={activeBrand?.name || null}
        activeBrand={activeBrand}
        onReset={handleResetSession}
        historyCount={history.length}
        activePersonaFocus={personaFocus}
        onSelectPersonaFocus={setPersonaFocus}
        language={language}
        onToggleLanguage={toggleLanguage}
        currentAccent={currentAccent}
        onAccentChange={handleAccentChange}
      />

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-4 sm:space-y-6">
        {/* Creative Modes Navigation */}
        <ModeSelector currentMode={mode} onSelectMode={setMode} language={language} />

        {/* Specialized Creative Team Bar */}
        <CreativeTeamBar
          activePersonaFocus={personaFocus}
          onSelectPersonaFocus={setPersonaFocus}
          language={language}
        />

        {/* Studio Input Area */}
        <StudioInput
          mode={mode}
          targetTool={targetTool}
          onChangeTargetTool={handleToolChange}
          personaFocus={personaFocus}
          onChangePersonaFocus={setPersonaFocus}
          activeBrand={activeBrand}
          onOpenBrandVault={() => setIsBrandVaultOpen(true)}
          onDeactivateBrand={() => handleSelectActiveBrand(null)}
          onSubmit={handleInputSubmit}
          onRequestQuickIdeas={handleRequestQuickIdeas}
          isLoading={isLoading || isQuickIdeasLoading}
          language={language}
          currentAccent={currentAccent}
        />

        {/* 4 Quick Instant Ideas Card if triggered */}
        {quickIdeas.length > 0 && (
          <QuickInstantIdeasCard
            ideas={quickIdeas}
            activeBrand={activeBrand}
            targetTool={targetTool}
            framingSettings={framingSettings}
            onSelectIdea={handleSelectQuickIdea}
            onUpdateIdea={handleUpdateQuickIdea}
            onRefreshIdeas={() => handleRequestQuickIdeas(currentPrompt, currentImage)}
            isLoading={isQuickIdeasLoading}
          />
        )}

        {/* Unified Specialized Production Studios Workbench */}
        <StudioWorkbench
          framingSettings={framingSettings}
          onChangeFramingSettings={handleUpdateFramingSettings}
          lightingSettings={lightingSettings}
          onChangeLightingSettings={handleUpdateLightingSettings}
          onApplyLightingToPrompt={handleApplyLightingToPrompt}
          onApplyFramingToPrompt={
            result
              ? () => handleAspectRatioChange(framingSettings.aspectRatio, framingSettings.dimensionId)
              : undefined
          }
          activeBrand={activeBrand}
          onOpenBrandVault={() => setIsBrandVaultOpen(true)}
          onDeactivateBrand={() => handleSelectActiveBrand(null)}
          history={history}
          onSelectTool={handleToolChange}
          targetTool={targetTool}
          language={language}
        />

        {/* Loading Spinner & Active Personas Feedback */}
        {isLoading && (
          <div className="w-full bg-white rounded-3xl border border-[#4C53DB]/20 shadow-lg p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4C53DB]/10 text-[#4C53DB] flex items-center justify-center relative">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#111827]">
                {LOADING_STEPS[loadingStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {LOADING_STEPS[loadingStep].desc}
              </p>
            </div>
            <div className="max-w-md mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4C53DB] to-[#A78BFA] h-full rounded-full transition-all duration-300"
                style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <h4 className="font-extrabold text-rose-800 mb-0.5">
                تنبيه من استوديو الإبداع:
              </h4>
              <p className="font-medium text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Output Cards Section - Strictly ordered according to requirements:
            1. الفكرة الإبداعية
            2. التصور البصري
            3. البرومبت النهائي | Final Prompt
            4. الإعدادات المقترحة
            (If isPromptOnly, show Final Prompt directly without extra sections!)
        */}
        {result && (
          <div id="studio-results-container" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Title & Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#111827]">
                    {result.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    الوضع: {result.mode} | المحرك: {result.targetTool}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {result.brandKitApplied && (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>درع الهوية: {result.brandKitApplied.name}</span>
                  </span>
                )}
                {result.isPromptOnly && (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-indigo-50 text-[#4C53DB] border border-indigo-200">
                    ⚡ تم توليد البرومبت المباشر بنجاح
                  </span>
                )}
              </div>
            </div>

            {/* If NOT prompt-only: Render Section 1 (الفكرة الإبداعية) & Section 2 (التصور البصري) */}
            {!result.isPromptOnly && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. الفكرة الإبداعية */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 text-[#4C53DB]">
                    <div className="w-8 h-8 rounded-xl bg-[#4C53DB]/10 flex items-center justify-center font-bold">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#111827]">
                      1. الفكرة الإبداعية (Creative Idea)
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {result.creativeIdea || result.summary}
                  </p>
                </div>

                {/* 2. التصور البصري */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 text-violet-600">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center font-bold">
                      <Eye className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#111827]">
                      2. التصور البصري (Visual Conception)
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {result.visualConception || result.summary}
                  </p>
                </div>
              </div>
            )}

            {/* 3. البرومبت النهائي | Final Prompt & 4. الإعدادات المقترحة */}
            <PromptCard
              prompt={result.finalPrompt}
              currentTargetTool={targetTool}
              onChangeTool={handleToolChange}
              suggestedSettings={result.suggestedSettings}
              framingSettings={framingSettings}
              lightingSettings={result.lightingSettings || lightingSettings}
              onChangeAspectRatio={handleAspectRatioChange}
              rawResponse={result.rawResponse}
              isPromptOnly={result.isPromptOnly}
            />

            {/* Additional contextual sections if available and not prompt-only */}
            {!result.isPromptOnly && (
              <>
                {/* Visual Reference Analysis Card (If image was analyzed) */}
                {result.visualAnalysis?.subject && (
                  <VisualAnalysisCard
                    analysis={result.visualAnalysis}
                    onUseEvolutionIdea={handleUseEvolutionIdea}
                  />
                )}

                {/* 3 Creative Concepts Card (If in concept mode) */}
                {result.concepts && result.concepts.length > 0 && (
                  <ConceptsCard
                    concepts={result.concepts}
                    onSelectConcept={handleAdoptConcept}
                  />
                )}

                {/* Copywriting Elements Card */}
                {result.copywritingElements && (
                  <CopywritingCard copywriting={result.copywritingElements} />
                )}

                {/* Story Opening Card */}
                {result.storyOpening && (
                  <StoryCard storyOpening={result.storyOpening} />
                )}
              </>
            )}

            {/* Interactive Follow-Up Refinements */}
            <FollowUpActions
              onTriggerAction={handleFollowUpAction}
              isLoading={isLoading}
              activeAction={activeActionId}
              suggestedActions={result.suggestedActions}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#111827]">
              Creative Studio <span className="text-[#4C53DB]">AI</span>
            </span>
            <span>| استوديو الإبداع</span>
          </div>
          <p className="text-slate-400">
            مساعدك المتخصص في الإبداع البصري، تحليل المراجع، وهندسة البرومبتات
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBrandVaultOpen(true)}
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>خزانة البراند (Brand Vault)</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsKnowledgeOpen(true)}
              className="text-[#4C53DB] hover:underline font-semibold"
            >
              دليل الخدمات والسياسات
            </button>
          </div>
        </div>
      </footer>

      {/* Studio Knowledge / Client Advisory Modal */}
      <StudioKnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        onAskQuestion={handleAskKnowledgeQuestion}
      />

      {/* Saved History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onOpenAnalytics={() => setShowAnalytics(true)}
        onSelectResult={(selected) => {
          setResult(selected);
          setMode(selected.mode);
          setTargetTool(selected.targetTool);
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Brand Vault Modal */}
      <BrandVaultModal
        isOpen={isBrandVaultOpen}
        onClose={() => setIsBrandVaultOpen(false)}
        brandKits={brandKits}
        activeBrandId={activeBrandId}
        onSelectActiveBrand={handleSelectActiveBrand}
        onSaveBrandKit={handleSaveBrandKit}
        onDeleteBrandKit={handleDeleteBrandKit}
        onResetDefaults={handleResetBrandKits}
        onSetStudioAccent={handleAccentChange}
      />
    </div>
  );
}
