import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Copy,
  Check,
  Edit3,
  ShieldCheck,
  ArrowRight,
  Sun,
  Camera,
  Layers,
  Flame,
  Home,
  RefreshCw,
  Sliders,
  Eye,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';
import { QuickInstantIdea, BrandKit, TargetTool, FramingSettings } from '../types.ts';

interface QuickInstantIdeasCardProps {
  ideas: QuickInstantIdea[];
  activeBrand?: BrandKit | null;
  targetTool: TargetTool;
  framingSettings?: FramingSettings;
  isLoading?: boolean;
  onSelectIdea: (idea: QuickInstantIdea) => void;
  onRefreshIdeas?: () => void;
  onUpdateIdea?: (updatedIdea: QuickInstantIdea) => void;
  onRegenerateIdeaPrompt?: (ideaId: string) => void;
}

export const QuickInstantIdeasCard: React.FC<QuickInstantIdeasCardProps> = ({
  ideas,
  activeBrand,
  targetTool,
  framingSettings,
  isLoading = false,
  onSelectIdea,
  onRefreshIdeas,
  onUpdateIdea,
  onRegenerateIdeaPrompt,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'en' | 'ar'>>({});
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<QuickInstantIdea>>({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'studio':
        return <Camera className="w-4 h-4 text-indigo-600" />;
      case 'nature':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'dramatic':
        return <Flame className="w-4 h-4 text-purple-600" />;
      case 'architectural':
        return <Home className="w-4 h-4 text-emerald-600" />;
      default:
        return <Layers className="w-4 h-4 text-[#4C53DB]" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'studio':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'nature':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'dramatic':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'architectural':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleStartEdit = (idea: QuickInstantIdea) => {
    setEditingIdeaId(idea.id);
    setEditFormData({
      title: idea.title,
      shortDescription: idea.shortDescription,
      backgroundDescription: idea.backgroundDescription,
      lightingDescription: idea.lightingDescription,
      compositionDescription: idea.compositionDescription,
      finalPrompt: idea.finalPrompt,
      arabicPrompt: idea.arabicPrompt,
    });
  };

  const handleSaveEdit = (originalIdea: QuickInstantIdea) => {
    if (onUpdateIdea) {
      onUpdateIdea({
        ...originalIdea,
        ...editFormData,
      });
    }
    setEditingIdeaId(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-7 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4C53DB] to-[#7C3AED] text-white flex items-center justify-center font-bold shadow-md shadow-[#4C53DB]/20 shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                أفكار سريعة للتجربة الفورية
              </h3>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4C53DB] border border-indigo-200/70">
                4 تنويعات للمنتج نفسه
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              تغيير الخلفية والإضاءة والتكوين فقط، مع الحفاظ التام على هوية وتفاصيل المنتج المرجعي
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeBrand && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>هوية: {activeBrand.name}</span>
            </div>
          )}

          {onRefreshIdeas && (
            <button
              onClick={onRefreshIdeas}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'جاري الابتكار...' : 'تجديد الـ 4 أفكار'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Rules Banner (Fidelity Guarantee) */}
      <div className="bg-slate-50/80 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            قواعد صارمة: الحفاظ الكامل على شكل العبوة والشعار والملصق • لا تشويه • لا كتابات عشوائية • ألوان متطابقة
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          المحرك: <strong className="text-slate-800">{targetTool}</strong> | النسبة: <strong className="text-slate-800">{framingSettings?.aspectRatio || '1:1'}</strong>
        </span>
      </div>

      {/* 4 Ideas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {ideas.map((idea, idx) => {
          const isEn = activeTabMap[idea.id] !== 'ar';
          const isEditing = editingIdeaId === idea.id;

          return (
            <div
              key={idea.id || idx}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 relative group"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeColor(
                        idea.category
                      )}`}
                    >
                      {getCategoryIcon(idea.category)}
                      <span>فكرة {idx + 1}: {idea.categoryLabel || idea.category}</span>
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 hidden sm:inline-block">
                      هوية المنتج محمية
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(idea)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="تعديل تفاصيل الفكرة والبرومبت"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(idea.id, idea.finalPrompt)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="نسخ البرومبت النهائي"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Idea Title & Short Description */}
                <div>
                  <h4 className="text-base font-extrabold text-[#111827] leading-snug">
                    {idea.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    {idea.shortDescription}
                  </p>
                </div>
              </div>

              {/* Visual Breakdown Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">🖼️ الخلفية:</span>
                  <p className="text-slate-600 font-medium leading-relaxed line-clamp-2" title={idea.backgroundDescription}>
                    {idea.backgroundDescription}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">💡 الإضاءة:</span>
                  <p className="text-slate-600 font-medium leading-relaxed line-clamp-2" title={idea.lightingDescription}>
                    {idea.lightingDescription}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">📐 التكوين:</span>
                  <p className="text-slate-600 font-medium leading-relaxed line-clamp-2" title={idea.compositionDescription}>
                    {idea.compositionDescription}
                  </p>
                </div>
              </div>

              {/* Brand Vault Connection if present */}
              {idea.brandVaultNote && (
                <div className="bg-indigo-50/50 rounded-xl px-3 py-1.5 border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-medium truncate">{idea.brandVaultNote}</span>
                </div>
              )}

              {/* Inline Edit Mode Form */}
              {isEditing ? (
                <div className="bg-slate-50 rounded-2xl p-3 border border-indigo-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#4C53DB]">
                      تعديل وتخصيص الفكرة والبرومبت
                    </span>
                    <button
                      onClick={() => setEditingIdeaId(null)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        عنوان الفكرة:
                      </label>
                      <input
                        type="text"
                        value={editFormData.title || ''}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, title: e.target.value })
                        }
                        className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#4C53DB]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        البرومبت النهائي بالإنجليزية:
                      </label>
                      <textarea
                        dir="ltr"
                        rows={3}
                        value={editFormData.finalPrompt || ''}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, finalPrompt: e.target.value })
                        }
                        className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#4C53DB] resize-y"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingIdeaId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSaveEdit(idea)}
                        className="px-3.5 py-1 text-xs font-bold bg-[#4C53DB] text-white hover:bg-[#434ac9] rounded-lg transition shadow-xs"
                      >
                        حفظ التعديل
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Prompt Display Box */
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-slate-500">
                      <button
                        onClick={() =>
                          setActiveTabMap({ ...activeTabMap, [idea.id]: 'en' })
                        }
                        className={`px-2 py-0.5 rounded-md transition ${
                          isEn
                            ? 'bg-slate-200 text-slate-800 font-extrabold'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        English Prompt
                      </button>
                      <span>|</span>
                      <button
                        onClick={() =>
                          setActiveTabMap({ ...activeTabMap, [idea.id]: 'ar' })
                        }
                        className={`px-2 py-0.5 rounded-md transition ${
                          !isEn
                            ? 'bg-slate-200 text-slate-800 font-extrabold'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        الشرح بالعربية
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {idea.aspectRatio ? `--ar ${idea.aspectRatio}` : ''}
                    </span>
                  </div>

                  <div
                    dir={isEn ? 'ltr' : 'rtl'}
                    className="bg-[#111827] text-slate-100 rounded-xl p-3 text-xs font-mono leading-relaxed select-all max-h-28 overflow-y-auto border border-slate-800 shadow-inner"
                  >
                    {isEn ? idea.finalPrompt : (idea.arabicPrompt || idea.finalPrompt)}
                  </div>
                </div>
              )}

              {/* Bottom Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => onSelectIdea(idea)}
                  className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#4C53DB] hover:bg-[#434ac9] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <span>اعتماد كبرومبت رئيسي</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy(idea.id, idea.finalPrompt)}
                    className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    {copiedId === idea.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ البرومبت</span>
                      </>
                    )}
                  </button>

                  {onRegenerateIdeaPrompt && (
                    <button
                      onClick={() => onRegenerateIdeaPrompt(idea.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      title="توليد وتحديث برومبت هذه الفكرة"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4C53DB]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
