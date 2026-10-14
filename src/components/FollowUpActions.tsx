import React from 'react';
import {
  Sparkles,
  Flame,
  Shuffle,
  Palette,
  Camera,
  Languages,
  Minimize2,
  CopyPlus,
  RefreshCw,
} from 'lucide-react';

interface FollowUpActionsProps {
  onTriggerAction: (actionLabel: string, actionId: string) => void;
  isLoading: boolean;
  activeAction: string | null;
  suggestedActions?: string[];
}

const DEFAULT_ACTIONS = [
  { id: 'develop', label: 'طوّر الفكرة', icon: <Sparkles className="w-3.5 h-3.5 text-[#4C53DB]" />, desc: 'إضافة تفاصيل أعمق للمشهد' },
  { id: 'bold', label: 'اجعلها أكثر جرأة', icon: <Flame className="w-3.5 h-3.5 text-amber-500" />, desc: 'تكوين طليعي ومفاجئ' },
  { id: 'different', label: 'اقترح مفهومًا مختلفًا', icon: <Shuffle className="w-3.5 h-3.5 text-emerald-500" />, desc: 'فكرة إعلانية جديدة كلياً' },
  { id: 'style', label: 'غيّر الأسلوب البصري', icon: <Palette className="w-3.5 h-3.5 text-violet-500" />, desc: 'تحويل النمط الفوتوغرافي أو الفني' },
  { id: 'realistic', label: 'أنشئ نسخة أكثر واقعية', icon: <Camera className="w-3.5 h-3.5 text-sky-500" />, desc: 'إضاءة طبيعية وتصوير واقعي' },
  { id: 'english', label: 'اكتب البرومبت بالإنجليزية فقط', icon: <Languages className="w-3.5 h-3.5 text-indigo-500" />, desc: 'صياغة إنجليزية نقية ومركزة' },
  { id: 'shorten', label: 'اختصر البرومبت', icon: <Minimize2 className="w-3.5 h-3.5 text-rose-500" />, desc: 'إيجاز ذكي دون فقد الجودة' },
  { id: 'variations', label: 'أنشئ بدائل إضافية', icon: <CopyPlus className="w-3.5 h-3.5 text-purple-500" />, desc: 'زوايا وإضاءات بديلة للمنتج' },
];

export const FollowUpActions: React.FC<FollowUpActionsProps> = ({
  onTriggerAction,
  isLoading,
  activeAction,
  suggestedActions,
}) => {
  return (
    <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4C53DB]" />
            <span>خيارات المتابعة والتحسين التكراري</span>
          </h4>
          <p className="text-xs text-slate-500">
            انقر على أي خيار لإعادة صياغة النتيجة وتطويرها في ثوانٍ
          </p>
        </div>
      </div>

      {/* Main follow-up chips grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {DEFAULT_ACTIONS.map((action) => {
          const isCurrentLoading = isLoading && activeAction === action.id;
          return (
            <button
              key={action.id}
              onClick={() => onTriggerAction(action.label, action.id)}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                isCurrentLoading
                  ? 'bg-white border-[#4C53DB] ring-2 ring-[#4C53DB]/20 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700 shadow-2xs'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center">
                  {isCurrentLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#4C53DB]" />
                  ) : (
                    action.icon
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {action.label}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {action.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Suggested contextual actions from the AI result */}
      {suggestedActions && suggestedActions.length > 0 && (
        <div className="pt-2 border-t border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">
            اقتراحات إضافية من المستشار الإبداعي لهذا المشروع:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => onTriggerAction(sugg, `suggested-${idx}`)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <span>💡 {sugg}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
