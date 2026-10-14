import React from 'react';
import { X, History, Trash2, ArrowRight, Copy, Check, Calendar, BarChart3 } from 'lucide-react';
import { CreativeResult } from '../types.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CreativeResult[];
  onSelectResult: (item: CreativeResult) => void;
  onClearHistory: () => void;
  onOpenAnalytics?: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onOpenAnalytics,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyPrompt = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4C53DB]/10 text-[#4C53DB] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#111827]">
                سجل الأفكار والبرومبتات ({history.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                جلسات العصف الذهني المحفوظة في استوديو الإبداع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Analytics action */}
        {onOpenAnalytics && (
          <div className="px-4 py-2.5 bg-indigo-50/60 border-b border-indigo-100/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4C53DB]">
              <BarChart3 className="w-4 h-4" />
              <span>مخطط استخدام الأدوات (Recharts)</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAnalytics();
              }}
              className="text-[11px] font-bold text-white bg-[#4C53DB] hover:bg-[#434ac9] px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
            >
              عرض المخطط
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>لا توجد نتائج محفوظة بعد في هذه الجلسة.</p>
              <p className="text-[11px] mt-1 text-slate-400">
                أي فكرة أو برومبت تبتكره سيظهر هنا تلقائياً لسهولة الرجوع إليه.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#4C53DB] hover:bg-slate-50 transition cursor-pointer text-right group relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4C53DB]/10 text-[#4C53DB]">
                    {item.targetTool}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                  {item.title || item.userPrompt}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.finalPrompt.englishPrompt || item.summary}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-slate-500">انقر لعرض النتيجة الكاملة</span>
                  <button
                    onClick={(e) => copyPrompt(item.id, item.finalPrompt.englishPrompt, e)}
                    className="p-1 text-slate-400 hover:text-[#4C53DB] transition flex items-center gap-1 font-semibold"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>نسخ البرومبت</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
            <span className="text-[11px] text-slate-400">
              يُحفظ السجل محلياً في المتصفح
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
