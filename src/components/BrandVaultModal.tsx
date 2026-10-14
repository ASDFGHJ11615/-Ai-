import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  Palette,
  PowerOff,
  Sparkles,
} from 'lucide-react';
import { BrandKit, ColorSwatch } from '../types.ts';

interface BrandVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandKits: BrandKit[];
  activeBrandId: string | null;
  onSelectActiveBrand: (id: string | null) => void;
  onSaveBrandKit: (kit: BrandKit) => void;
  onDeleteBrandKit: (id: string) => void;
  onResetDefaults: () => void;
  onSetStudioAccent?: (hex: string) => void;
}

export const BrandVaultModal: React.FC<BrandVaultModalProps> = ({
  isOpen,
  onClose,
  brandKits,
  activeBrandId,
  onSelectActiveBrand,
  onSaveBrandKit,
  onDeleteBrandKit,
  onResetDefaults,
  onSetStudioAccent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Simplified Form State
  const [formName, setFormName] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formColors, setFormColors] = useState<ColorSwatch[]>([
    { name: 'اللون الرئيسي', hex: '#4C53DB' },
    { name: 'اللون الداكن', hex: '#111827' },
  ]);

  // Optional details toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formProductPackaging, setFormProductPackaging] = useState('');
  const [formNegativeRules, setFormNegativeRules] = useState('');

  // New color input state
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#4C53DB');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormName('');
    setFormIndustry('');
    setFormProductPackaging('');
    setFormNegativeRules('');
    setShowAdvanced(false);
    setFormColors([
      { name: 'اللون الرئيسي', hex: '#4C53DB' },
      { name: 'اللون المساعد', hex: '#111827' },
    ]);
  };

  const handleStartEdit = (kit: BrandKit) => {
    setIsEditing(true);
    setEditingId(kit.id);
    setFormName(kit.name);
    setFormIndustry(kit.industry || '');
    setFormProductPackaging(kit.productPackaging || '');
    setFormNegativeRules(kit.negativeRules || '');
    setShowAdvanced(Boolean(kit.productPackaging || kit.negativeRules));
    setFormColors(
      kit.colors && kit.colors.length > 0
        ? kit.colors
        : [{ name: 'اللون الرئيسي', hex: '#4C53DB' }]
    );
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormColors([...formColors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setFormColors(formColors.filter((_, idx) => idx !== index));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      return;
    }

    const newKit: BrandKit = {
      id: editingId || `brand-${Date.now()}`,
      name: formName.trim(),
      industry: formIndustry.trim() || 'عام',
      colors: formColors.length > 0 ? formColors : [{ name: 'اللون الأساسي', hex: '#4C53DB' }],
      productPackaging:
        formProductPackaging.trim() ||
        `منتج تجاري رسمي من ${formName.trim()} يحافظ بدقة على ألوان وشكل وخامات العبوة الأصلية دون تشويه`,
      negativeRules:
        formNegativeRules.trim() ||
        'blurry, distorted text, off-brand colors, amateur lighting, cheap plastic',
      aestheticStyle: 'تصوير تجاري سينمائي عالي الجودة يعكس فخامة وهوية العلامة',
      createdAt: editingId
        ? brandKits.find((b) => b.id === editingId)?.createdAt || Date.now()
        : Date.now(),
    };

    onSaveBrandKit(newKit);
    setIsEditing(false);
  };

  const activeKit = brandKits.find((b) => b.id === activeBrandId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-right">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#4C53DB] text-white flex items-center justify-center font-bold shadow-md shadow-[#4C53DB]/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#111827]">
                  خزانة الهوية البصرية (Brand Vault)
                </h3>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  درع الهوية البصرية
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                احفظ اسم البراند ومجاله وألوانه الرسمية لدمجها تلقائياً وحماية شكل المنتج في كل برومبت
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

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Active Brand Shield Status Bar with Temporary Disable button */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              activeKit
                ? 'bg-gradient-to-r from-emerald-500/10 via-white to-emerald-500/5 border-emerald-500/30'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeKit ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {activeKit ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">حالة الدرع الإبداعي:</span>
                    <span className={`text-xs font-black ${activeKit ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {activeKit ? `مُفعّل على علامة: ${activeKit.name}` : 'غير مفعّل (توليد حر عام)'}
                    </span>
                  </div>
                  {activeKit && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500">الألوان المحمية:</span>
                      <div className="flex items-center gap-1.5">
                        {activeKit.colors.map((c, i) => (
                          <div key={i} className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-[10px] font-bold text-slate-700">{c.name}</span>
                            <span className="text-[9px] font-mono text-slate-400">{c.hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {activeKit ? (
                <button
                  type="button"
                  onClick={() => onSelectActiveBrand(null)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-extrabold transition cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>تعطيل الدرع مؤقتاً</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">
                  اختر علامة تجارية أدناه لتفعيل درعها وحماية ألوانها في كل برومبت
                </span>
              )}
            </div>
          </div>

          {/* Simplified Form View (Create or Edit) */}
          {isEditing ? (
            <form onSubmit={handleSaveForm} className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#4C53DB]" />
                  <span>{editingId ? 'تعديل هوية العلامة التجارية' : 'إضافة علامة تجارية جديدة'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>

              {/* 1. Brand Name & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم العلامة التجارية (Brand Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: سلطان العود، نيكسوس تك..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#4C53DB] shadow-2xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مجال ونشاط العلامة (Industry)
                  </label>
                  <input
                    type="text"
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    placeholder="مثال: عطور فاخرة، ساعات ذكية، أزياء، قهوة..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#4C53DB] shadow-2xs font-semibold"
                  />
                </div>
              </div>

              {/* 2. Official Brand Colors with HEX and preview swatch */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#4C53DB]" />
                    <span>الألوان الرسمية للهوية (اسم اللون ورمز HEX وعينة لونية):</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formColors.length} ألوان محددة
                  </span>
                </div>

                {/* Display Current Swatches */}
                <div className="flex flex-wrap gap-2 items-center">
                  {formColors.map((col, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="font-bold text-slate-800">{col.name}</span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{col.hex}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-slate-400 hover:text-rose-600 font-black ml-1 text-sm p-0.5"
                        title="إزالة اللون"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Color Row */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                      title="اختر درجة اللون"
                    />
                    <input
                      type="text"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-700 uppercase"
                      placeholder="#HEX"
                    />
                  </div>

                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="اسم اللون (مثل: ذهبي ملكي، أسود داكن...)"
                    className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#4C53DB]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleAddColor}
                    disabled={!newColorName.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4C53DB] hover:bg-[#434ac9] text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                  >
                    + إضافة اللون
                  </button>
                </div>
              </div>

              {/* Optional Advanced Details Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-[11px] font-bold text-[#4C53DB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAdvanced ? '− إخفاء تفاصيل العبوة والمستبعدات' : '+ تخصيص شكل العبوة والكلمات المستبعدة (اختياري)'}</span>
                </button>

                {showAdvanced && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-slate-200/80 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        مواصفات شكل العبوة والمنتج (Product Packaging):
                      </label>
                      <input
                        type="text"
                        value={formProductPackaging}
                        onChange={(e) => setFormProductPackaging(e.target.value)}
                        placeholder="مثال: زجاجة عطر سداسية من الكريستال الأسود غير اللامع بغطاء ذهبي ثقيل..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#4C53DB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الكلمات والعناصر المستبعدة دائماً (Negative Rules):
                      </label>
                      <input
                        type="text"
                        value={formNegativeRules}
                        onChange={(e) => setFormNegativeRules(e.target.value)}
                        placeholder="مثال: نيون ساطع، ألوان فاقعة رخيصة، تشويه الحروف..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#4C53DB]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons: Save, Cancel, Temporarily Disable Shield */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
                {activeKit ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectActiveBrand(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>تعطيل الدرع مؤقتاً</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#4C53DB] hover:bg-[#434ac9] text-white text-xs font-extrabold transition shadow-md shadow-[#4C53DB]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ العلامة في الخزانة</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Action bar to add new brand */
            <div className="flex items-center justify-between">
              <button
                onClick={handleStartCreate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#4C53DB] hover:bg-[#434ac9] text-white text-xs font-extrabold transition shadow-md shadow-[#4C53DB]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة علامة تجارية جديدة</span>
              </button>

              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#4C53DB] font-semibold transition cursor-pointer"
                title="استعادة النماذج الجاهزة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة نماذج البراندات الجاهزة</span>
              </button>
            </div>
          )}

          {/* List of Saved Brand Kits */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 block">
              العلامات التجارية المحفوظة في الخزانة ({brandKits.length}):
            </span>

            {brandKits.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#4C53DB]" />
                <p className="font-bold text-slate-600">لا توجد علامات تجارية محفوظة بعد</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  انقر على الزر أعلاه لإضافة علامتك وتحديد ألوانها الرسمية.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandKits.map((kit) => {
                  const isActive = kit.id === activeBrandId;
                  return (
                    <div
                      key={kit.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between text-right relative ${
                        isActive
                          ? 'bg-gradient-to-b from-indigo-50/60 via-white to-white border-[#4C53DB] shadow-md ring-2 ring-[#4C53DB]/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Brand Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#111827] truncate max-w-[180px]">
                              {kit.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {kit.industry || 'عام'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(kit)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#4C53DB] hover:bg-slate-100 transition cursor-pointer"
                              title="تعديل البراند"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteBrandKit(kit.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="حذف البراند"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Colors Swatches with HEX preview */}
                        {kit.colors && kit.colors.length > 0 && (
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 block">
                                الألوان الرسمية:
                              </span>
                              {onSetStudioAccent && (
                                <button
                                  type="button"
                                  onClick={() => onSetStudioAccent(kit.colors[0].hex)}
                                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                                  title="تطبيق هذا اللون كلون تمييز للاستوديو"
                                >
                                  <Palette className="w-3 h-3" />
                                  <span>تطبيق كلون تمييز</span>
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {kit.colors.map((c, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px]"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/10 shrink-0 shadow-2xs"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  <span className="font-bold text-slate-700">{c.name}</span>
                                  <span className="font-mono text-[9px] text-slate-400">{c.hex}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Packaging or details snippet */}
                        {kit.productPackaging && (
                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 mb-3 text-[11px]">
                            <p className="text-slate-600 font-medium line-clamp-2 leading-relaxed">
                              {kit.productPackaging}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Activation / Disable Button */}
                      <button
                        onClick={() => onSelectActiveBrand(isActive ? null : kit.id)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-[#4C53DB] hover:text-white text-slate-800'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>الدرع مُفعّل حالياً (انقر لإلغاء التفعيل)</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            <span>تفعيل درع هذا البراند في التوليد</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {activeKit && (
              <button
                type="button"
                onClick={() => onSelectActiveBrand(null)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>تعطيل الدرع مؤقتاً</span>
              </button>
            )}
            <span className="text-slate-500 hidden sm:inline">
              خزانة الهوية البصرية تحفظ ألوان وهوية براندك في التوليد
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 transition cursor-pointer"
          >
            إغلاق الخزانة
          </button>
        </div>
      </div>
    </div>
  );
};
