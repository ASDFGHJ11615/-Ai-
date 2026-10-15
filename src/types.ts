export type CreativeMode =
  | 'concept'
  | 'analyze'
  | 'scratch'
  | 'refine'
  | 'product'
  | 'branding'
  | 'copywriting'
  | 'story'
  | 'support';

export type TargetTool =
  | 'universal'
  | 'midjourney'
  | 'gemini'
  | 'chatgpt'
  | 'firefly'
  | 'whisk'
  | 'krea';

export interface PersonaInfo {
  id: string;
  name: string;
  englishName: string;
  role: string;
  badgeColor: string;
  icon: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface BrandKit {
  id: string;
  name: string;
  industry: string;
  tagline?: string;
  colors: ColorSwatch[];
  productPackaging?: string;
  negativeRules?: string;
  aestheticStyle?: string;
  logoGuidelines?: string;
  createdAt: number;
}

export type ProductPlacement = 'center' | 'lower_third' | 'floating' | 'dynamic_angle';
export type ProductScale = 'standard' | 'dominant' | 'minimal';
export type MarginOption = 'balanced' | 'tight' | 'spacious';
export type BackgroundStyleOption =
  | 'extracted_complementary'
  | 'neutral_studio'
  | 'gradient_vignette'
  | 'contextual'
  | 'minimalist_solid';

export interface DimensionPreset {
  id: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  orientation: 'vertical' | 'square' | 'horizontal' | 'custom';
  tag: string;
  description: string;
}

export interface FramingSettings {
  dimensionId: string;
  aspectRatio: string;
  width: number;
  height: number;
  customWidth?: number;
  customHeight?: number;
  productPlacement: ProductPlacement;
  productScale: ProductScale;
  margin: MarginOption;
  safeZone: boolean;
  backgroundStyle: BackgroundStyleOption;
  preserveFidelity: boolean;
}

// Camera Angles & Perspectives Types
export type CameraAngleId =
  | 'auto'
  | 'front'
  | 'eye_level'
  | 'side'
  | 'back'
  | 'three_quarter'
  | 'top_down'
  | 'birds_eye'
  | 'high_angle'
  | 'low_angle'
  | 'worms_eye'
  | 'high_three_quarter'
  | 'low_three_quarter'
  | 'rear_three_quarter'
  | 'close_up'
  | 'extreme_close_up'
  | 'macro'
  | 'wide_shot'
  | 'pov'
  | 'over_the_shoulder'
  | 'dutch_angle'
  | 'tilted_side';

export interface CameraAngleOption {
  id: CameraAngleId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  promptSnippet: string;
  compositionSnippet: string;
  category: string;
  tag?: string;
}

export interface CameraAngleCategory {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  angles: CameraAngleOption[];
}

// Cinematic Lighting Studio Types
export type CinematicLightingStyleId =
  | 'dramatic_cinematic'
  | 'low_key'
  | 'high_key'
  | 'chiaroscuro'
  | 'side_lighting'
  | 'backlight_rim'
  | 'volumetric'
  | 'diffused'
  | 'warm_golden_cool_blue'
  | 'anamorphic_luxury';

export type CinematicPaletteId =
  | 'teal_orange'
  | 'amber_obsidian'
  | 'emerald_silver'
  | 'cyberpunk_neon'
  | 'golden_hour'
  | 'monochrome_graphite'
  | 'pastel_highfashion'
  | 'royal_crimson_gold';

export type LightingRecipeId =
  | 'perfume_luxury'
  | 'dark_background'
  | 'gold_metallic'
  | 'glass_reflective'
  | 'smoky_cinematic'
  | 'modern_tech'
  | 'dramatic_luxury'
  | 'beauty_cosmetics'
  | 'sunset_golden'
  | 'commercial_studio'
  | 'custom';

export type KeyLightDirection = 'front' | 'side_45' | 'profile_90' | 'overhead_top' | 'low_angle_up';
export type KeyLightHeight = 'eye_level' | 'high_60' | 'overhead_90' | 'low_20';
export type LightSoftness = 'hard_direct' | 'medium_diffused' | 'ultra_soft_silk';
export type BeamSpread = 'spot_15' | 'medium_45' | 'flood_120';
export type ContrastRatioLevel = 'soft_1_1' | 'natural_2_1' | 'dramatic_4_1' | 'extreme_8_1';
export type RimLightPower = 'off' | 'subtle' | 'medium' | 'intense' | 'halo';
export type VolumetricHazeLevel = 'none' | 'light_mist' | 'atmospheric_haze' | 'god_rays';
export type ShadowDepthType = 'crisp' | 'feathered' | 'deep_black' | 'ambient_fill';
export type ReflectionStyle = 'specular_glossy' | 'diffused_matte' | 'anamorphic_glare' | 'wet_surface';
export type BloomGlowStyle = 'none' | 'subtle_lens' | 'vintage_halation' | 'anamorphic_streak';
export type LightingRatio = '1:1' | '2:1' | '4:1' | '8:1';

export interface CinematicLightingSettings {
  styleId: CinematicLightingStyleId;
  recipeId: LightingRecipeId;
  keyLightDirection: KeyLightDirection;
  keyLightAngle: number; // -90 to +90 degrees
  keyLightHeight: KeyLightHeight;
  intensity: number; // 10 to 100
  softness: LightSoftness;
  beamSpread: BeamSpread;
  contrastRatio: ContrastRatioLevel;
  colorTemperatureK: number; // 2700K to 8000K
  rimLightPower: RimLightPower;
  volumetricHaze: VolumetricHazeLevel;
  shadowDepth: ShadowDepthType;
  reflections: ReflectionStyle;
  bloomGlow: BloomGlowStyle;
  lightingRatio: LightingRatio;
  palette: CinematicPaletteId;
  preserveProductFidelity: boolean;
}

export interface CinematicLightingStyleInfo {
  id: CinematicLightingStyleId;
  name: string;
  nameEn: string;
  description: string;
  badge: string;
  previewGradient: string;
}

export interface CinematicPaletteInfo {
  id: CinematicPaletteId;
  name: string;
  nameEn: string;
  colors: string[];
  description: string;
}

export interface LightingRecipeInfo {
  id: LightingRecipeId;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  settings: Partial<CinematicLightingSettings>;
  promptSnippet: string;
  arabicSnippet: string;
}

export interface VisualAnalysis {
  hasImage?: boolean;
  subject?: string;
  mood?: string;
  concept?: string;
  composition?: string;
  perspective?: string;
  lighting?: string;
  colorPalette?: ColorSwatch[];
  textures?: string;
  environment?: string;
  style?: string;
  strengths?: string;
  improvements?: string;
  observedVsInferred?: string;
  inferredElements?: string;
  newDesignApplications?: string[];
  evolutionIdea?: string;
}

export interface PromptCrafterState {
  subject: string;
  environment: string;
  composition: string;
  aspectRatio: string;
  lighting: string;
  colorMood: string;
  artisticStyle: string;
  realismLevel: string;
  cameraLens: string;
  negativeElements: string;
}

export interface EnginePromptVariants {
  midjourney: {
    prompt: string;
    params: string;
    full: string;
  };
  dalle: {
    prompt: string;
    full: string;
  };
  stableDiffusion: {
    positivePrompt: string;
    negativePrompt: string;
    full: string;
  };
  gemini: {
    prompt: string;
    full: string;
  };
  firefly: {
    prompt: string;
    full: string;
  };
}

export interface QuickInstantIdea {
  id: string;
  title: string;
  category: 'studio' | 'nature' | 'dramatic' | 'architectural' | 'custom';
  categoryLabel: string;
  backgroundDescription: string;
  lightingDescription: string;
  compositionDescription: string;
  shortDescription: string;
  productPreservation: string;
  brandVaultNote?: string;
  finalPrompt: string;
  arabicPrompt?: string;
  aspectRatio?: string;
  parameters?: string;
  negativePrompt?: string;
}

export interface AdvertisingDirection {
  id: string;
  title: string;
  creativeIdea: string; // الفكرة الإبداعية
  visualConception: string; // التصور البصري
  style: string; // النمط
  lightingAndColors: string; // الإضاءة والألوان
  isBestCandidate?: boolean; // المرشح الأفضل
  reasonForBest?: string; // سبب التفضيل والترشيح
}

export interface CreativeConcept {
  name: string;
  adIdea: string;
  message: string;
  visualScene: string;
  whyUnique: string;
  isRecommended?: boolean;
}

export interface PromptBreakdown {
  subject?: string;
  environment?: string;
  composition?: string;
  lighting?: string;
  colors?: string;
  materials?: string;
  aspectRatio?: string;
  negativePrompt?: string;
  toolSpecificNotes?: string;
}

export interface FinalPrompt {
  targetTool: string;
  englishPrompt: string;
  arabicPrompt?: string;
  aspectRatio?: string;
  parameters?: string;
  negativePrompt?: string;
  breakdown?: PromptBreakdown;
}

export interface SuggestedSettings {
  targetTool?: string;
  aspectRatio?: string;
  parameters?: string;
  negativePrompt?: string;
  notes?: string;
}

export interface CopywritingElements {
  headline?: string;
  subhead?: string;
  tagline?: string;
  socialCaption?: string;
}

export interface CreativeResult {
  id: string;
  timestamp: number;
  mode: CreativeMode;
  targetTool: TargetTool;
  userPrompt: string;
  hasImage: boolean;
  title: string;
  summary: string;
  creativeIdea?: string;
  visualConception?: string;
  finalPrompt: FinalPrompt;
  suggestedSettings?: SuggestedSettings;
  isPromptOnly?: boolean;
  brandKitApplied?: {
    name: string;
    colors: ColorSwatch[];
  };
  activePersonas?: { name: string; role: string }[];
  visualAnalysis?: VisualAnalysis;
  concepts?: CreativeConcept[];
  storyOpening?: string;
  copywritingElements?: CopywritingElements;
  creativeAdvice?: string;
  suggestedActions?: string[];
  framingSettings?: FramingSettings;
  lightingSettings?: CinematicLightingSettings;
  quickIdeas?: QuickInstantIdea[];
  advertisingDirections?: AdvertisingDirection[];
  selectedDirectionId?: string;
  cameraAngle?: CameraAngleId;
  rawResponse?: string;
}
