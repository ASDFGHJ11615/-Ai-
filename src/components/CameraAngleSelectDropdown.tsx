import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Sliders,
  X,
  Search,
} from 'lucide-react';
import { CameraAngleId, CameraAngleOption } from '../types.ts';
import {
  CAMERA_ANGLE_CATEGORIES,
  AUTO_CAMERA_ANGLE,
  getCameraAngleById,
} from '../data/cameraAngles.ts';

interface CameraAngleSelectDropdownProps {
  selectedAngleId?: CameraAngleId;
  onSelectAngle: (angleId: CameraAngleId) => void;
  onOpenAnglesTab?: () => void;
  language?: 'ar' | 'en';
  accentColor?: string;
}

export const CameraAngleSelectDropdown: React.FC<CameraAngleSelectDropdownProps> = ({
  selectedAngleId = 'auto',
  onSelectAngle,
  onOpenAnglesTab,
  language = 'ar',
  accentColor = '#4C53DB',
}) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentAngle: CameraAngleOption = getCameraAngleById(selectedAngleId);

  // Manage open/closed state for each of the 6 categories (collapsible accordion)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      basic: true,
      high_low: false,
      three_quarter_variants: false,
      closeups: false,
      wide_perspective: false,
      creative: false,
    };

    if (selectedAngleId !== 'auto') {
      const activeCat = CAMERA_ANGLE_CATEGORIES.find((cat) =>
        cat.angles.some((a) => a.id === selectedAngleId)
      );
      if (activeCat) {
        initial[activeCat.id] = true;
      }
    }

    return initial;
  });

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSelect = (angleId: CameraAngleId) => {
    onSelectAngle(angleId);
    setIsOpen(false);
  };

  // Filter angles if user types in search query
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 border rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer select-none ${
            isOpen
              ? 'border-[#4C53DB] ring-2 ring-[#4C53DB]/20 shadow-xs'
              : 'border-slate-200 text-slate-700'
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          title={isAr ? 'قائمة زوايا التصوير التفاعلية' : 'Camera angles interactive selector'}
        >
          <Camera className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-slate-500 font-medium">
            {isAr ? 'زاوية التصوير:' : 'Camera Angle:'}
          </span>
          <span className="text-[#111827] font-black max-w-[130px] sm:max-w-[160px] truncate">
            {currentAngle.nameAr}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#4C53DB]' : ''
            }`}
          />
        </button>

        {onOpenAnglesTab && (
          <button
            type="button"
            onClick={onOpenAnglesTab}
            className="p-2 text-slate-400 hover:text-[#4C53DB] hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title={isAr ? 'فتح استوديو زوايا التصوير في اللوحة الموسعة' : 'Open Camera Angles Studio Tab'}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Interactive Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute z-50 top-full mt-2 w-[340px] sm:w-[420px] max-w-[90vw] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 right-0"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#111827]">
                  {isAr ? 'قائمة زوايا التصوير والمنظور' : 'Camera Angles & Perspectives'}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {isAr
                    ? 'اختيار زاوية واحدة أو تلقائي مع قوائم قابلة للفتح والإغلاق'
                    : 'Select one angle or Auto. Collapsible categories.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search filter for instant finding */}
          <div className="p-2.5 border-b border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث عن زاوية (مثلاً: ثلاثة أرباع، ماكرو، مائلة...)' : 'Search camera angle...'}
                className="w-full pr-8 pl-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4C53DB]/20 focus:bg-white text-slate-800 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable list of categories and angles */}
          <div className="max-h-[380px] overflow-y-auto p-2.5 space-y-2 divide-y divide-slate-100/80">
            {/* 0. خيار «تلقائي» (Auto AI Selection) */}
            {matchesSearch(AUTO_CAMERA_ANGLE.nameAr) && (
              <div
                onClick={() => handleSelect('auto')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none mb-2 ${
                  selectedAngleId === 'auto'
                    ? 'bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-transparent border-[#4C53DB] ring-1 ring-[#4C53DB]/30 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                        selectedAngleId === 'auto'
                          ? 'bg-[#4C53DB] text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-[#111827]">
                          {AUTO_CAMERA_ANGLE.nameAr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({AUTO_CAMERA_ANGLE.nameEn})
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                          {isAr ? 'موصى به' : 'Recommended'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                        {isAr
                          ? 'يحدد الذكاء الاصطناعي الزاوية الأنسب للمنتج والفكرة الإعلانية تلقائياً.'
                          : 'AI selects the optimal angle for the product and ad concept.'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition ${
                      selectedAngleId === 'auto'
                        ? 'border-[#4C53DB] bg-[#4C53DB] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedAngleId === 'auto' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            )}

            {/* The 6 Collapsible Categories */}
            {CAMERA_ANGLE_CATEGORIES.map((cat) => {
              const filteredAngles = cat.angles.filter(
                (a) =>
                  matchesSearch(a.nameAr) ||
                  matchesSearch(a.nameEn) ||
                  matchesSearch(cat.titleAr)
              );

              if (searchQuery.trim() && filteredAngles.length === 0) {
                return null;
              }

              const isOpenCategory = searchQuery.trim() ? true : Boolean(openCategories[cat.id]);
              const containsSelected = cat.angles.some((a) => a.id === selectedAngleId);

              return (
                <div key={cat.id} className="pt-2 first:pt-0">
                  {/* Category Header (Collapsible / Accordion Button) */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-start transition cursor-pointer select-none ${
                      isOpenCategory
                        ? 'bg-slate-100/80 text-slate-900 font-extrabold'
                        : 'bg-white hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                          containsSelected
                            ? 'bg-[#4C53DB] text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat.number}
                      </span>
                      <span className="text-xs font-black">
                        {cat.titleAr}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({cat.titleEn})
                      </span>
                      {containsSelected && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-[#4C53DB] border border-indigo-200">
                          {isAr ? 'نشط' : 'Active'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="text-[10px] font-mono text-slate-400">
                        {cat.angles.length}
                      </span>
                      {isOpenCategory ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {/* Sub-items list if category is open */}
                  {isOpenCategory && (
                    <div className="mt-1 space-y-1 pr-2 animate-in fade-in duration-150">
                      {filteredAngles.map((angle) => {
                        const isSelected = selectedAngleId === angle.id;

                        return (
                          <div
                            key={angle.id}
                            onClick={() => handleSelect(angle.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                              isSelected
                                ? 'bg-indigo-50/80 border-[#4C53DB] ring-1 ring-[#4C53DB]/30 shadow-2xs'
                                : 'bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center transition ${
                                  isSelected
                                    ? 'border-[#4C53DB] bg-[#4C53DB] text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-extrabold text-[#111827]">
                                    {angle.nameAr}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    ({angle.nameEn})
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-slate-500 font-medium line-clamp-1">
                                  {angle.descriptionAr}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <span className="text-[9px] font-bold text-[#4C53DB] shrink-0">
                                {isAr ? 'مختارة ✓' : 'Selected ✓'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
            <span className="text-[10.5px] text-slate-500 font-medium">
              {isAr ? 'الزاوية الحالية:' : 'Active:'} <strong className="text-[#4C53DB]">{currentAngle.nameAr}</strong>
            </span>

            {onOpenAnglesTab && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAnglesTab();
                }}
                className="text-[11px] font-bold text-[#4C53DB] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>{isAr ? 'فتح اللوحة الموسعة' : 'Expanded Studio'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
