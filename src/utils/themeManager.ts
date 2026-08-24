export type AppThemeId = 
  | 'dark-obsidian'
  | 'light-daylight'
  | 'ocean-breeze'
  | 'emerald-nature'
  | 'warm-sunset'
  | 'lavender-pastel'
  | 'arctic-frost'
  | 'cozy-mocha';

export type BgEffectType = 'liquid-aura' | 'particles-glow' | 'modern-grid' | 'clean-minimal';
export type FontSizeScale = 'compact' | 'normal' | 'large' | 'xlarge';
export type FontFamilyType = 'sans' | 'serif' | 'rounded' | 'mono';
export type TextContrastType = 'normal' | 'high';

export interface AppThemeConfig {
  id: AppThemeId;
  name: string;
  nameTr: string;
  category: 'dark' | 'light' | 'vibrant' | 'pastel';
  emoji: string;
  description: string;
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  previewTextColor: string;
  isLight: boolean;
}

export interface AppDisplaySettings {
  themeId: AppThemeId;
  bgEffect: BgEffectType;
  fontSize: FontSizeScale;
  fontFamily: FontFamilyType;
  contrast: TextContrastType;
  auraAnimation: boolean;
}

export const APP_THEMES: AppThemeConfig[] = [
  {
    id: 'light-daylight',
    name: 'Aydınlık Gün Işığı',
    nameTr: 'Aydınlık Gün Işığı (İç Açıcı & Ferah)',
    category: 'light',
    emoji: '☀️',
    description: 'Taze, ferah, göz yormayan aydınlık beyaz ve açık gök mavisi zemin',
    previewBg: '#f8fafc',
    previewCard: '#ffffff',
    previewAccent: '#0284c7',
    previewTextColor: '#0f172a',
    isLight: true
  },
  {
    id: 'ocean-breeze',
    name: 'Okyanus Ferahlığı',
    nameTr: 'Okyanus Ferahlığı (Turkuaz & Deniz Mavisi)',
    category: 'vibrant',
    emoji: '🌊',
    description: 'Canlandırıcı turkuaz, gök mavisi ve berrak lagün tonları',
    previewBg: '#082f49',
    previewCard: '#0c4a6e',
    previewAccent: '#06b6d4',
    previewTextColor: '#f0fdfa',
    isLight: false
  },
  {
    id: 'emerald-nature',
    name: 'Zümrüt Doğası & Nane',
    nameTr: 'Zümrüt Doğası & Nane (Huzurlu Doğa)',
    category: 'vibrant',
    emoji: '🌿',
    description: 'Yatıştırıcı nane yeşili, zümrüt ve taze orman tonları',
    previewBg: '#022c22',
    previewCard: '#064e3b',
    previewAccent: '#10b981',
    previewTextColor: '#ecfdf5',
    isLight: false
  },
  {
    id: 'warm-sunset',
    name: 'Altın Günbatımı',
    nameTr: 'Altın Günbatımı (Sıcak Bal & Kehribar)',
    category: 'vibrant',
    emoji: '🌅',
    description: 'Sıcak kehribar, bal sarısı ve şeftali ışıltısı',
    previewBg: '#451a03',
    previewCard: '#78350f',
    previewAccent: '#f59e0b',
    previewTextColor: '#fffbeb',
    isLight: false
  },
  {
    id: 'lavender-pastel',
    name: 'Lavanta Rüyası',
    nameTr: 'Lavanta Rüyası (Pastel Leylak & Lila)',
    category: 'pastel',
    emoji: '🌸',
    description: 'Dingin pastel leylak, lila ve yumuşak mor auralar',
    previewBg: '#2e1065',
    previewCard: '#4c1d95',
    previewAccent: '#c084fc',
    previewTextColor: '#faf5ff',
    isLight: false
  },
  {
    id: 'arctic-frost',
    name: 'Kutup Ferahlığı',
    nameTr: 'Kutup Ferahlığı (Kristal Buz & Açık Mavi)',
    category: 'light',
    emoji: '🏔️',
    description: 'Ultra berrak buz mavisi, pırıl pırıl temiz açık zemin',
    previewBg: '#f0f9ff',
    previewCard: '#ffffff',
    previewAccent: '#0ea5e9',
    previewTextColor: '#0c4a6e',
    isLight: true
  },
  {
    id: 'cozy-mocha',
    name: 'Sıcak Mocha & Karamel',
    nameTr: 'Sıcak Mocha & Karamel (Rahatlatıcı Kahve)',
    category: 'vibrant',
    emoji: '☕',
    description: 'Göz dostu sıcak ahşap, sütlü kahve ve karamel dokusu',
    previewBg: '#271c19',
    previewCard: '#422820',
    previewAccent: '#d97706',
    previewTextColor: '#fef3c7',
    isLight: false
  },
  {
    id: 'dark-obsidian',
    name: 'Gece Safiri',
    nameTr: 'Gece Safiri (Koyu Kristal Cam)',
    category: 'dark',
    emoji: '🌌',
    description: 'Derin koyu obsidian zemin, neon mavi ve kehribar vurgular',
    previewBg: '#030712',
    previewCard: '#0f172a',
    previewAccent: '#38bdf8',
    previewTextColor: '#f8fafc',
    isLight: false
  }
];

export const FONT_SIZES: { id: FontSizeScale; label: string; scale: string; px: string }[] = [
  { id: 'compact', label: 'Kompakt (%90)', scale: '0.9', px: '14px' },
  { id: 'normal', label: 'Standart (%100)', scale: '1.0', px: '16px' },
  { id: 'large', label: 'Büyük (%110 - Kolay Okuma)', scale: '1.1', px: '17.5px' },
  { id: 'xlarge', label: 'Ekstra Büyük (%125)', scale: '1.25', px: '20px' }
];

export const FONT_FAMILIES: { id: FontFamilyType; label: string; sample: string; css: string }[] = [
  { id: 'sans', label: 'Modern Sans', sample: 'Aa Bb Cc (Dinamik & Şık)', css: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'rounded', label: 'Yumuşak & Dost Canlısı', sample: 'Aa Bb Cc (Yuvarlak & Samimi)', css: '"Quicksand", "Nunito", system-ui, sans-serif' },
  { id: 'serif', label: 'Zarif Kitap & Okuma', sample: 'Aa Bb Cc (Kitap Havası)', css: '"Merriweather", "Georgia", serif' },
  { id: 'mono', label: 'Net & Odaklı', sample: 'Aa Bb Cc (Monospace)', css: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }
];

export const BG_EFFECTS: { id: BgEffectType; label: string; icon: string; desc: string }[] = [
  { id: 'liquid-aura', label: 'Sıvı Işık Küreleri', icon: '💫', desc: 'Arka planda hareket eden yumuşak renkli ışık dalgaları' },
  { id: 'particles-glow', label: 'Yıldız & Parıltı', icon: '✨', desc: 'Hafif parıldayan ferahlatıcı ışık zerrecikleri' },
  { id: 'modern-grid', label: 'Modern Matris', icon: '📐', desc: 'Minimal şık teknolojik ızgara deseni' },
  { id: 'clean-minimal', label: 'Sade & Düz Zemin', icon: '🎨', desc: 'Dikkat dağıtmayan arı ve saf zemin' }
];

const STORAGE_KEY = 'glotvia_display_settings_v2';

export const DEFAULT_DISPLAY_SETTINGS: AppDisplaySettings = {
  themeId: 'dark-obsidian',
  bgEffect: 'liquid-aura',
  fontSize: 'normal',
  fontFamily: 'sans',
  contrast: 'normal',
  auraAnimation: true
};

/**
 * Loads stored display settings
 */
export function loadDisplaySettings(): AppDisplaySettings {
  if (typeof window === 'undefined') return DEFAULT_DISPLAY_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DISPLAY_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DISPLAY_SETTINGS,
      ...parsed
    };
  } catch (e) {
    return DEFAULT_DISPLAY_SETTINGS;
  }
}

/**
 * Saves display settings to localStorage and applies immediately
 */
export function saveDisplaySettings(settings: AppDisplaySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyDisplaySettings(settings);
    // Broadcast event for live UI reactivity
    window.dispatchEvent(new CustomEvent('glotvia_theme_changed', { detail: settings }));
  } catch (e) {
    console.error('Failed to save theme settings:', e);
  }
}

/**
 * Applies theme settings to DOM (HTML root attributes, CSS variables)
 */
export function applyDisplaySettings(settings: AppDisplaySettings): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  // 1. Data attributes on root
  root.setAttribute('data-theme', settings.themeId);
  root.setAttribute('data-bg-effect', settings.bgEffect);
  root.setAttribute('data-font-size', settings.fontSize);
  root.setAttribute('data-font-family', settings.fontFamily);
  root.setAttribute('data-contrast', settings.contrast);

  const themeConfig = APP_THEMES.find(t => t.id === settings.themeId) || APP_THEMES[0];
  if (themeConfig.isLight) {
    root.classList.add('theme-light-mode');
    root.classList.remove('theme-dark-mode');
  } else {
    root.classList.add('theme-dark-mode');
    root.classList.remove('theme-light-mode');
  }

  // 2. Font Size Scaling
  const fontObj = FONT_SIZES.find(f => f.id === settings.fontSize) || FONT_SIZES[1];
  root.style.setProperty('--app-font-scale', fontObj.scale);

  // 3. Font Family
  const fontFamObj = FONT_FAMILIES.find(f => f.id === settings.fontFamily) || FONT_FAMILIES[0];
  root.style.setProperty('--app-font-family', fontFamObj.css);

  // 4. Background Color and Theme Accent variables
  root.style.setProperty('--app-bg-color', themeConfig.previewBg);
  root.style.setProperty('--app-card-color', themeConfig.previewCard);
  root.style.setProperty('--app-accent-color', themeConfig.previewAccent);
  root.style.setProperty('--app-text-color', themeConfig.previewTextColor);
}

/**
 * Initialize theme immediately at boot
 */
export function initializeAppTheme(): AppDisplaySettings {
  const current = loadDisplaySettings();
  applyDisplaySettings(current);
  return current;
}
