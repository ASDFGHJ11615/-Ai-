import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, RotateCcw, Shield, ChevronDown } from 'lucide-react';
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT_HEX,
  applyAccentColor,
  hexToRgb,
} from '../utils/accentColor.ts';
import { BrandKit } from '../types.ts';

interface AccentColorPickerProps {
  currentAccent: string;
  onAccentChange: (newHex: string) => void;
  activeBrand?: BrandKit | null;
  language?: 'ar' | 'en';
  compact?: boolean;
}

export const AccentColorPicker: React.FC<AccentColorPickerProps> = ({
  currentAccent,
  onAccentChange,
  activeBrand,
  language = 'ar',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(currentAccent);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = language === 'ar';

  // Synchronize internal custom input when currentAccent changes externally
  useEffect(() => {
    setCustomHexInput(currentAccent);
  }, [currentAccent]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (hex: string) => {
    onAccentChange(hex);
    applyAccentColor(hex);
    setCustomHexInput(hex);
  };

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHexInput(val);
    if (hexToRgb(val)) {
      onAccentChange(val);
      applyAccentColor(val);
    }
  };

  const handleResetDefault = () => {
    handleSelectPreset(DEFAULT_ACCENT_HEX);
  };

  const handleSyncWithActiveBrand = () => {
    if (activeBrand && activeBrand.colors && activeBrand.colors.length > 0) {
      const brandColor = activeBrand.colors[0].hex;
      handleSelectPreset(brandColor);
    }
  };

  const activePreset = ACCENT_PRESETS.find(
    (p) => p.hex.toLowerCase() === currentAccent.toLowerCase()
  );

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border transition cursor-pointer select-none ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white hover:bg-slate-50 border-slate-200'
            : 'px-3 py-1.5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
        }`}
        title={isAr ? 'تغيير لون التمييز وهوية الاستوديو' : 'Change Studio Accent Color'}
        aria-label="Accent Color Picker"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0 ring-1 ring-black/15 transition-transform duration-200"
          style={{ backgroundColor: currentAccent }}
        />
        <span className="hidden sm:inline font-semibold">
          {isAr ? 'لون التمييز' : 'Accent'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-80 rounded-2xl bg-white p-4 shadow-xl border border-slate-200/90 text-[#111827] animate-in fade-in zoom-in-95 duration-150 ${
            isAr ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: currentAccent }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isAr ? 'لون التمييز (Accent Color)' : 'Studio Accent Color'}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {isAr ? 'تخصيص ألوان الأزرار والهوية في التطبيق' : 'Dynamically retheme buttons & branding'}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetDefault}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition p-1 rounded-md hover:bg-slate-50 cursor-pointer"
              title={isAr ? 'استعادة اللون الافتراضي' : 'Reset default'}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Sync with Active Brand Kit (if available) */}
          {activeBrand && activeBrand.colors && activeBrand.colors.length > 0 && (
            <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-800 truncate">
                    {isAr ? 'براند نشط:' : 'Active Brand:'} {activeBrand.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    {activeBrand.colors[0].name}: {activeBrand.colors[0].hex}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSyncWithActiveBrand}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-white shrink-0 shadow-xs cursor-pointer transition hover:opacity-90"
                style={{ backgroundColor: activeBrand.colors[0].hex }}
              >
                {isAr ? 'مزامنة' : 'Sync'}
              </button>
            </div>
          )}

          {/* Presets Grid */}
          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              {isAr ? 'لوحات ألوان احترافية جاهزة' : 'Curated Designer Palettes'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = preset.hex.toLowerCase() === currentAccent.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.hex)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-start transition cursor-pointer relative ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/10'
                        : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title={isAr ? preset.descriptionAr : preset.descriptionEn}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-black/10 flex items-center justify-center"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 truncate">
                      {isAr ? preset.nameAr.split(' ')[0] : preset.nameEn.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Wheel & Hex Input */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              {isAr ? 'أو اختر كود لون مخصص بدقة' : 'Or Custom Hex Color'}
            </span>
            <div className="flex items-center gap-2">
              {/* Native color picker */}
              <label className="relative w-9 h-9 rounded-xl border border-slate-200 overflow-hidden shrink-0 cursor-pointer shadow-xs hover:border-slate-400 transition">
                <input
                  type="color"
                  value={hexToRgb(customHexInput) ? customHexInput : currentAccent}
                  onChange={(e) => {
                    const newHex = e.target.value.toUpperCase();
                    setCustomHexInput(newHex);
                    onAccentChange(newHex);
                    applyAccentColor(newHex);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span
                  className="w-full h-full block"
                  style={{ backgroundColor: customHexInput }}
                />
              </label>

              {/* Hex Text input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  maxLength={7}
                  value={customHexInput}
                  onChange={handleCustomHexChange}
                  placeholder="#4C53DB"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  dir="ltr"
                />
              </div>

              {/* Status Dot */}
              <span
                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: currentAccent }}
                title={activePreset ? (isAr ? activePreset.nameAr : activePreset.nameEn) : currentAccent}
              />
            </div>
          </div>

          {/* Footer Active Summary */}
          <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-50">
            <span>
              {isAr ? 'اللون الفعال:' : 'Active Accent:'}{' '}
              <strong className="text-slate-700 font-mono">{currentAccent.toUpperCase()}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isAr ? 'مُحدّث في Tailwind' : 'Live in Tailwind'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
