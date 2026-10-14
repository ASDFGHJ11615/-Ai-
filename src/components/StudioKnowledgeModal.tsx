import React from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  HelpCircle,
  Cpu,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PERSONAS, TARGET_TOOLS } from '../data/presets.ts';

interface StudioKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
}

export const StudioKnowledgeModal: React.FC<StudioKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onAskQuestion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#111827]">
                دليل خدمات استوديو الإبداع (Creative Studio AI)
              </h3>
              <p className="text-xs text-slate-500">
                منهجية العمل، الشخصيات الخمس، وسياسات الاستوديو المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Identity & Core Personas */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4C53DB]" />
            <span>فريق العمل المتكامل (الـ 5 شخصيات):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {PERSONAS.map((p) => (
              <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.englishName}</span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{p.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Delivery Policy Notice (Important constraint!) */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>سياسة الأسعار ومواعيد التسليم:</span>
          </div>
          <p className="text-amber-800 leading-relaxed font-medium">
            تعتمد تكاليف الإنتاج الإبداعي ومواعيد التسليم على نطاق كل مشروع ومتطلباته المخصصة
            (Custom Scope). استوديو الإبداع لا يضع أسعاراً أو وعوداً زمنية جزافية غير معتمدة.
            للحصول على تسعيرة رسمية أو عقود تجارية، يُرجى التواصل مباشرة مع إدارة الاستوديو.
          </p>
        </div>

        {/* Supported Generation Engines */}
        <div className="space-y-2">
          <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-600" />
            <span>محركات التوليد المدعومة بهندسة برومبتات متخصصة:</span>
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {TARGET_TOOLS.map((t) => (
              <div key={t.id} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900">{t.name}</span>
                <span className="text-slate-400 text-[10px] block">{t.hint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instant FAQ Questions to ask */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 block">
            أسئلة شائعة يمكنك طرحها على الوكيل فوراً:
          </span>
          <div className="flex flex-col gap-2">
            {[
              'كيف أقوم بإعداد برومبت مثالي لزجاجة عطر على Midjourney؟',
              'ما الفرق بين صياغة البرومبت لمحرك Gemini ومحرك ChatGPT Image؟',
              'كيف أحافظ على هوية وملامح المنتج عند التوليد بالذكاء الاصطناعي؟',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onAskQuestion(q);
                  onClose();
                }}
                className="text-right p-2.5 rounded-xl bg-slate-50 hover:bg-[#4C53DB]/10 hover:text-[#4C53DB] border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer flex items-center justify-between"
              >
                <span>💬 {q}</span>
                <span className="text-[10px] text-slate-400">إرسال للمساعد</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
