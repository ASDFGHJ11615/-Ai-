import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  History,
  RotateCcw,
  Languages,
  ShieldCheck,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { PERSONAS } from '../data/presets.ts';
import { AccentColorPicker } from './AccentColorPicker.tsx';
import { BrandKit } from '../types.ts';

interface HeaderProps {
  onOpenKnowledge: () => void;
  onOpenHistory: () => void;
  onOpenBrandVault: () => void;
  activeBrandName?: string | null;
  activeBrand?: BrandKit | null;
  onReset: () => void;
  historyCount: number;
  activePersonaFocus: string | null;
  onSelectPersonaFocus: (id: string | null) => void;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  currentAccent: string;
  onAccentChange: (newHex: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenKnowledge,
  onOpenHistory,
  onOpenBrandVault,
  activeBrandName,
  activeBrand,
  onReset,
  historyCount,
  activePersonaFocus,
  onSelectPersonaFocus,
  language,
  onToggleLanguage,
  currentAccent,
  onAccentChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ring-2 ring-black/10 shrink-0 transition-colors duration-200"
            style={{ backgroundColor: currentAccent }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                Creative Studio <span style={{ color: currentAccent }}>AI</span>
              </span>
              <span
                className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors duration-200"
                style={{
                  backgroundColor: `var(--user-accent-light, #EEF2FF)`,
                  color: currentAccent,
                  borderColor: `var(--user-accent-border, rgba(76, 83, 219, 0.35))`,
                }}
              >
                {isAr ? 'استوديو الإبداع' : 'Creative Studio'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              {isAr
                ? 'الإبداع البصري وهندسة البرومبتات الاحترافية'
                : 'Visual Creativity & High-End Prompt Engineering'}
            </p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Accent Color Picker */}
          <AccentColorPicker
            currentAccent={currentAccent}
            onAccentChange={onAccentChange}
            activeBrand={activeBrand}
            language={language}
          />

          {/* Brand Vault Button */}
          <button
            onClick={onOpenBrandVault}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              activeBrandName
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
            title={isAr ? 'خزانة الهوية البصرية للعلامات التجارية' : 'Brand Identity Vault'}
          >
            <Shield className={`w-3.5 h-3.5 ${activeBrandName ? 'text-emerald-600' : ''}`} style={{ color: activeBrandName ? undefined : currentAccent }} />
            <span>{activeBrandName ? `${isAr ? 'درع:' : 'Vault:'} ${activeBrandName}` : (isAr ? 'خزانة البراند' : 'Brand Vault')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
            title={isAr ? 'تبديل اللغة إلى English' : 'Switch Language to Arabic'}
          >
            <Languages className="w-3.5 h-3.5" style={{ color: currentAccent }} />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* Studio Knowledge / Guide */}
          <button
            onClick={onOpenKnowledge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAr ? 'دليل الاستوديو' : 'Studio Guide'}</span>
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer relative"
          >
            <History className="w-3.5 h-3.5" style={{ color: currentAccent }} />
            <span>{isAr ? 'السجل' : 'History'}</span>
            {historyCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                style={{ backgroundColor: currentAccent }}
              >
                {historyCount}
              </span>
            )}
          </button>

          {/* New Session Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition cursor-pointer"
            title={isAr ? 'بدء جلسة إبداعية جديدة' : 'Start Fresh Session'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'جلسة جديدة' : 'New Session'}</span>
          </button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-1">
          {/* Mobile Accent Picker */}
          <AccentColorPicker
            currentAccent={currentAccent}
            onAccentChange={onAccentChange}
            activeBrand={activeBrand}
            language={language}
            compact={true}
          />

          <button
            onClick={onOpenBrandVault}
            className={`p-2 rounded-xl transition ${
              activeBrandName ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Brand Vault"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition relative"
            title="History"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span
                className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                style={{ backgroundColor: currentAccent }}
              >
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={onToggleLanguage}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-bold text-xs"
            title="Language"
          >
            {isAr ? 'EN' : 'ع'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 animate-in fade-in duration-150">
          <button
            onClick={() => {
              onOpenKnowledge();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 text-start"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'دليل وخدمات الاستوديو' : 'Studio Guide & Services'}</span>
          </button>
          <button
            onClick={() => {
              onReset();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 text-start"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة تعيين الجلسة' : 'Reset Session'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
