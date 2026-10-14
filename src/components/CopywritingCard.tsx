import React, { useState } from 'react';
import { PenTool, Copy, Check, MessageSquare, Tag, Bookmark } from 'lucide-react';
import { CopywritingElements } from '../types.ts';

interface CopywritingCardProps {
  copywriting: CopywritingElements;
}

export const CopywritingCard: React.FC<CopywritingCardProps> = ({ copywriting }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyItem = (key: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <PenTool className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-[#111827]">
            الكتابة الإعلانية والنصوص المصاحبة
          </h3>
          <p className="text-xs text-slate-500">
            عناوين وشعارات رنانة متوافقة تماماً مع الروح البصرية للتصميم
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Headline */}
        {copywriting.headline && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#4C53DB]" />
                العنوان الرئيسي (Headline):
              </span>
              <button
                onClick={() => copyItem('headline', copywriting.headline)}
                className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'headline' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>نسخ</span>
              </button>
            </div>
            <p className="text-sm font-extrabold text-[#111827] leading-relaxed">
              «{copywriting.headline}»
            </p>
          </div>
        )}

        {/* Tagline / Slogan */}
        {copywriting.tagline && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-violet-600" />
                الشعار التسويقي (Tagline):
              </span>
              <button
                onClick={() => copyItem('tagline', copywriting.tagline)}
                className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'tagline' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>نسخ</span>
              </button>
            </div>
            <p className="text-sm font-bold text-violet-900 leading-relaxed">
              «{copywriting.tagline}»
            </p>
          </div>
        )}

        {/* Subhead */}
        {copywriting.subhead && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">العنوان الفرعي (Subhead):</span>
              <button
                onClick={() => copyItem('subhead', copywriting.subhead)}
                className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'subhead' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>نسخ</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {copywriting.subhead}
            </p>
          </div>
        )}

        {/* Social Caption */}
        {copywriting.socialCaption && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                نص المنشور الترويجي (Social Caption):
              </span>
              <button
                onClick={() => copyItem('social', copywriting.socialCaption)}
                className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'social' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>نسخ</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
              {copywriting.socialCaption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
