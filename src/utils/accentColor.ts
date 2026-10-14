/**
 * Accent Color Manager for Creative Studio AI
 * Provides dynamic brand customization with reactive Tailwind integration,
 * localStorage persistence, and color harmony calculations.
 */

export interface AccentColorPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  hoverHex: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const ACCENT_PRESETS: AccentColorPreset[] = [
  {
    id: 'studio_indigo',
    nameAr: 'أزرق الاستوديو الكلاسيكي',
    nameEn: 'Studio Classic Indigo',
    hex: '#4C53DB',
    hoverHex: '#3D42B0',
    descriptionAr: 'اللون الرسمي المعتمد لاستوديو الإبداع',
    descriptionEn: 'Official default Creative Studio AI color',
  },
  {
    id: 'royal_violet',
    nameAr: 'بنفسجي إبداعي فاخر',
    nameEn: 'Royal Creative Violet',
    hex: '#7C3AED',
    hoverHex: '#6D28D9',
    descriptionAr: 'طابع فني ملهم لصناع المحتوى والمصممين',
    descriptionEn: 'Inspiring artistic shade for creators',
  },
  {
    id: 'growth_emerald',
    nameAr: 'أخضر نمو وزمردي تجاري',
    nameEn: 'Growth Emerald',
    hex: '#059669',
    hoverHex: '#047857',
    descriptionAr: 'يناسب العلامات التجارية الحيوية والتسويقية',
    descriptionEn: 'Great for energetic marketing & growth brands',
  },
  {
    id: 'electric_blue',
    nameAr: 'أزرق تقني واثق',
    nameEn: 'Electric Tech Blue',
    hex: '#2563EB',
    hoverHex: '#1D4ED8',
    descriptionAr: 'مناسب للتقنية والأعمال والبرمجيات',
    descriptionEn: 'Ideal for tech, enterprise, and digital products',
  },
  {
    id: 'luxury_amber',
    nameAr: 'عنبري ذهبي فاخر',
    nameEn: 'Luxury Amber Gold',
    hex: '#D97706',
    hoverHex: '#B45309',
    descriptionAr: 'للعلامات التجارية الفاخرة والعطور والمجوهرات',
    descriptionEn: 'Tailored for luxury, jewelry, and hospitality',
  },
  {
    id: 'bold_rose',
    nameAr: 'وردي جريء وعصري',
    nameEn: 'Bold Fashion Rose',
    hex: '#E11D48',
    hoverHex: '#BE123C',
    descriptionAr: 'مناسب لقطاعات الموضة والجمال والمؤثرين',
    descriptionEn: 'Vibrant punch for fashion and lifestyle',
  },
  {
    id: 'cyber_cyan',
    nameAr: 'سيان سيبراني حديث',
    nameEn: 'Cyber Cyan',
    hex: '#0891B2',
    hoverHex: '#0E7490',
    descriptionAr: 'مستقبلي ومشرق للإعلانات الرقمية والابتكار',
    descriptionEn: 'Futuristic and clean for digital campaigns',
  },
  {
    id: 'sunset_orange',
    nameAr: 'برتقالي غروب دافئ',
    nameEn: 'Warm Sunset Orange',
    hex: '#EA580C',
    hoverHex: '#C2410C',
    descriptionAr: 'شغف وحيوية لافتة للانتباه في الإعلانات',
    descriptionEn: 'Warm and inviting high-conversion energy',
  },
  {
    id: 'midnight_slate',
    nameAr: 'رمادي مسائي أنيق',
    nameEn: 'Midnight Slate',
    hex: '#334155',
    hoverHex: '#1E293B',
    descriptionAr: 'طابع رسمي، مينيمالي وفائق الأناقة',
    descriptionEn: 'Minimalist, sleek, and executive aesthetic',
  },
];

export const ACCENT_STORAGE_KEY = 'creative_studio_accent_color_v1';
export const DEFAULT_ACCENT_HEX = '#4C53DB';

// Helper: Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: Calculate hover shade (15% darker)
export function calculateHoverColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, Math.floor(rgb.r * 0.85));
  const g = Math.max(0, Math.floor(rgb.g * 0.85));
  const b = Math.max(0, Math.floor(rgb.b * 0.85));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Helper: Calculate light surface tint (92% tint with white)
export function calculateLightColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#F5F7FF';
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * 0.92));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * 0.92));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * 0.92));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Applies the accent color dynamically to Tailwind via document root CSS variables,
 * updating all buttons, borders, badges, focus rings, and glowing highlights across the app.
 */
export function applyAccentColor(hex: string): void {
  if (typeof document === 'undefined') return;

  const validRgb = hexToRgb(hex);
  const safeHex = validRgb ? hex : DEFAULT_ACCENT_HEX;
  const rgb = validRgb || hexToRgb(DEFAULT_ACCENT_HEX)!;
  const hoverHex = calculateHoverColor(safeHex);
  const lightHex = calculateLightColor(safeHex);

  const root = document.documentElement;
  root.style.setProperty('--user-accent', safeHex);
  root.style.setProperty('--user-accent-hover', hoverHex);
  root.style.setProperty('--user-accent-light', lightHex);
  root.style.setProperty('--user-accent-surface', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`);
  root.style.setProperty('--user-accent-ring', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
  root.style.setProperty('--user-accent-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);

  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, safeHex);
  } catch (e) {
    console.warn('Failed to save accent color to localStorage', e);
  }
}

/**
 * Loads the saved accent color from localStorage or falls back to default.
 */
export function getSavedAccentColor(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_ACCENT_HEX;
  try {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (saved && hexToRgb(saved)) {
      return saved;
    }
  } catch (e) {}
  return DEFAULT_ACCENT_HEX;
}
