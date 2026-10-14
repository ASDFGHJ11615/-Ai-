import {
  CreativeMode,
  PersonaInfo,
  TargetTool,
  BrandKit,
  DimensionPreset,
  FramingSettings,
  QuickInstantIdea,
  CinematicLightingSettings,
  CinematicLightingStyleInfo,
  CinematicPaletteInfo,
  LightingRecipeInfo,
} from '../types.ts';

export const PERSONAS: PersonaInfo[] = [
  {
    id: 'director',
    name: 'المدير الإبداعي',
    englishName: 'Creative Director',
    role: 'يبتكر الفكرة الإعلانية والرسالة البصرية غير التقليدية بعيداً عن الكليشيهات',
    badgeColor: 'bg-indigo-600 text-white',
    icon: 'Sparkles',
  },
  {
    id: 'art_director',
    name: 'المخرج الفني',
    englishName: 'Art Director',
    role: 'يحدد التكوين، الإضاءة، لوحة الألوان، المنظور، والخامات والمساحات السلبية',
    badgeColor: 'bg-violet-600 text-white',
    icon: 'Palette',
  },
  {
    id: 'analyst',
    name: 'محلل الصور',
    englishName: 'Visual Analyst',
    role: 'يفهم الصور المرجعية ويستخرج عناصرها ويميز الحقائق المرئية عن الاستنتاجات',
    badgeColor: 'bg-emerald-600 text-white',
    icon: 'ScanEye',
  },
  {
    id: 'prompt_engineer',
    name: 'مهندس البرومبتات',
    englishName: 'Prompt Engineer',
    role: 'يحوّل الفكرة إلى تعليمات دقيقة مصممة خصيصاً لكل أداة توليد بالإنجليزية',
    badgeColor: 'bg-amber-600 text-white',
    icon: 'Terminal',
  },
  {
    id: 'consultant',
    name: 'المستشار الإبداعي',
    englishName: 'Creative Consultant',
    role: 'يقترح بدائل غير متوقعة ويطور النتائج ويتنبأ بتحديات التنفيذ',
    badgeColor: 'bg-sky-600 text-white',
    icon: 'Lightbulb',
  },
];

export const WORK_MODES: {
  id: CreativeMode;
  title: string;
  shortDesc: string;
  icon: string;
  badge: string;
}[] = [
  {
    id: 'concept',
    title: 'ابتكار فكرة إعلانية',
    shortDesc: '3 مفاهيم غير تقليدية مع ترشيح الأقوى وبرومبت متكامل',
    icon: 'Wand2',
    badge: 'الأكثر استخداماً',
  },
  {
    id: 'analyze',
    title: 'تحليل صورة مرجعية',
    shortDesc: 'تفكيك شامل للعناصر، الألوان، الإضاءة وتطوير المشهد',
    icon: 'Scan',
    badge: 'تحليل بصري',
  },
  {
    id: 'scratch',
    title: 'كتابة برومبت من الصفر',
    shortDesc: 'صياغة برومبت احترافي متكامل جاهز للمحرك مباشرة',
    icon: 'FileCode2',
    badge: 'هندسة برومبت',
  },
  {
    id: 'refine',
    title: 'تطوير برومبت موجود',
    shortDesc: 'فحص نقاط الضعف وإعادة الصياغة بجودة سينمائية',
    icon: 'Sparkles',
    badge: 'ترقية وتطوير',
  },
  {
    id: 'product',
    title: 'تصوير المنتجات',
    shortDesc: 'عطور، إلكترونيات، مستحضرات، مجوهرات مع ثبات العبوة',
    icon: 'Package',
    badge: 'تصوير تجاري',
  },
  {
    id: 'branding',
    title: 'تصميم الهوية البصرية',
    shortDesc: 'اتجاهات بصرية، لوحات ألوان، تايبوغرافي ومودبورد',
    icon: 'Layers',
    badge: 'هوية وبراند',
  },
  {
    id: 'copywriting',
    title: 'كتابة إعلانية إبداعية',
    shortDesc: 'عناوين رنانة، شعارات، وعبارات تسويقية للتصاميم',
    icon: 'PenTool',
    badge: 'كوبي رايتنج',
  },
  {
    id: 'story',
    title: 'تحويل الصورة إلى قصة',
    shortDesc: 'بناء عالم قصصي مع فقرة افتتاحية روائية وقراءة صوتية',
    icon: 'BookOpen',
    badge: 'سرد قصصي',
  },
  {
    id: 'support',
    title: 'مساعد استوديو الإبداع',
    shortDesc: 'دليل خدمات الاستوديو، منهجية العمل، واستشارات التنفيذ',
    icon: 'HelpCircle',
    badge: 'استشارات',
  },
];

export const TARGET_TOOLS: {
  id: TargetTool;
  name: string;
  tag: string;
  hint: string;
}[] = [
  {
    id: 'universal',
    name: 'برومبت عام (Universal)',
    tag: 'شامل ومحايد',
    hint: 'يعمل بجودة عالية على مختلف منصات ونماذج التوليد',
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6.1',
    tag: '--ar 16:9 --v 6.1',
    hint: 'يشمل معاملات الجودة والنسب والستايل الخام style raw',
  },
  {
    id: 'gemini',
    name: 'Google Gemini / Nano Banana',
    tag: 'الواقعية والتفاصيل',
    hint: 'صياغة طبيعية دقيقة للضوء والواقعية بدون حشو كلمات مكررة',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Image (DALL-E 3)',
    tag: 'سردي وصفي',
    hint: 'وصف تركيبي واضح للمشهد والعناصر وسياق التفاعل',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    tag: 'مصطلحات التصوير',
    hint: 'مصطلحات الكاميرات التجارية وعمق المجال والإضاءة الاستوديو',
  },
  {
    id: 'whisk',
    name: 'Whisk (Google Labs)',
    tag: 'الموضوع والأسلوب',
    hint: 'فصل صريح بين الموضوع الرئيسي والأسلوب والبيئة',
  },
  {
    id: 'krea',
    name: 'Krea AI',
    tag: 'توليد فوري وتحسين',
    hint: 'تركيز على التكوين المباشر ومستوى التفاصيل الواقعية',
  },
];

export const PRESET_IDEAS: {
  title: string;
  prompt: string;
  mode: CreativeMode;
  tool: TargetTool;
}[] = [
  {
    title: 'عطر عود شرقي ملكي',
    prompt: 'تصميم إعلان فاخر لزجاجة عطر عود شرقي فاخر من الكريستال الداكن والذهب، لا أريد دخان ونيون تقليدي، بل فكرة استعارية تربط العطر بأصالة الصحراء والهدوء الملكي قبل الشروق.',
    mode: 'product',
    tool: 'midjourney',
  },
  {
    title: 'سماعات ذكية عازلة للصوت',
    prompt: 'إعلان مبتكر لسماعات رأس لاسلكية خارقة في عزل الضوضاء، ابتكر مفهوماً بصرياً يحول فكرة الصمت التام إلى مشهد سريالي مدهش في وسط مدينة صاخبة.',
    mode: 'concept',
    tool: 'gemini',
  },
  {
    title: 'مشروب طاقة طبيعي من الفواكه',
    prompt: 'إعلان منعش لمشروب طاقة عضوي مصنوع من الحمضيات الاستوائية، يركز على الانتعاش والانفجار الطبيعي للطاقة دون استخدام جزيئات طائرة مبتذلة.',
    mode: 'concept',
    tool: 'universal',
  },
  {
    title: 'هوية بصرية لمطعم نكهات ساحلية',
    prompt: 'اتجاه فني وهوية بصرية لمطعم بحري فاخر حديث يمزج بين الثقافة المتوسطية والبساطة الحديثة (Minimalist luxury)، مع لوحة ألوان مستوحاة من رمال الشاطئ وزرقة الأعماق.',
    mode: 'branding',
    tool: 'firefly',
  },
  {
    title: 'تطوير برومبت ضعيف',
    prompt: 'a futuristic sports car driving on a road, 8k, photorealistic, cinematic lighting, ultra detailed',
    mode: 'refine',
    tool: 'midjourney',
  },
  {
    title: 'قصة عالم ما وراء الضباب',
    prompt: 'بناء عالم قصصي مستوحى من منارة وحيدة على جرف صخري في بحر هائج يغمره ضباب بنفسجي غامض مع سفينة شراعية مضيئة في الأفق.',
    mode: 'story',
    tool: 'universal',
  },
];

export const DEFAULT_BRAND_KITS: BrandKit[] = [
  {
    id: 'brand-royal-oud',
    name: 'سلطان العود | Royal Oud Heritage',
    industry: 'عطور شرقية فاخرة',
    tagline: 'أصالة التراث الملكي برائحة تدوم',
    colors: [
      { name: 'الذهب العتيق', hex: '#D4AF37' },
      { name: 'الأسود الملكي الداكن', hex: '#111827' },
      { name: 'الكهرمان الدافئ', hex: '#B45309' },
    ],
    productPackaging: 'زجاجة عطر سداسية الأضلاع من الكريستال الأسود غير اللامع (Matte Obsidian) مع غطاء معدني ثقيل مطلي بالذهب عيار 24 منقوش بزخارف إسلامية هندسية دقيقة.',
    negativeRules: 'نيون ساطع, ألوان فاقعة رخيصة, دخان أبيض كثيف مشوه, كتابات عشوائية مشوهة, بلاستيك رخيص, عبوات اسطوانية عادية',
    aestheticStyle: 'تصوير إعلاني ملكي فخم (Luxury Royal Minimalist)، إضاءة درامية خافتة مع انعكاسات ذهبية دافئة.',
    logoGuidelines: 'شعار هندسي كاليغرافي دقيق بالذهب على واجهة الزجاجة.',
    createdAt: 1700000000000,
  },
  {
    id: 'brand-nexus-tech',
    name: 'نيكسوس | Nexus Audio Pro',
    industry: 'إلكترونيات وسماعات صوتية ذكية',
    tagline: 'عزل تام لصوت المستقبل',
    colors: [
      { name: 'أزرق الكوبالت السيبراني', hex: '#2563EB' },
      { name: 'التيتانيوم الرمادي', hex: '#475569' },
      { name: 'الفضي اللامع', hex: '#E2E8F0' },
    ],
    productPackaging: 'سماعات رأس لاسلكية فوق الأذن بهيكل من التيتانيوم المصقول الخفيف مع وسائد أذن ميموري فوم مغطاة بجلد نباتي ناعم باللون الرمادي الفلكي، وشريط إضاءة دقيق أزرق.',
    negativeRules: 'تصميم بلاستيكي ضخم, كابلات وأسلاك متدلية, ألوان كرنفالية, خلفيات فوضوية, أجهزة قديمة, مظهر رخيص',
    aestheticStyle: 'تصوير منتجات تجاري مستقبلي نقي (Futuristic Clean Tech)، إضاءة استوديو باردة ونظيفة مع انعكاسات دقيقة.',
    logoGuidelines: 'أيقونة حرف N متصلة ومطبوعة بالليزر على جانبي السماعة.',
    createdAt: 1700000001000,
  },
  {
    id: 'brand-pureflora',
    name: 'بيور فلورا | PureFlora Botanicals',
    industry: 'مستحضرات عناية طبيعية وعضوية',
    tagline: 'نقاء الطبيعة لبشرتك',
    colors: [
      { name: 'أخضر المريمية العضوي', hex: '#059669' },
      { name: 'البيج الرملي الدافئ', hex: '#F3E8D6' },
      { name: 'الزيتوني الناعم', hex: '#065F46' },
    ],
    productPackaging: 'عبوة قطارة زجاجية صلبة من الزجاج الشفاف المصنفر نصف المعتم مع قطارة بغطاء من خشب البامبو الطبيعي، وملمس ناعم صديق للبيئة.',
    negativeRules: 'ألوان صناعية كيميائية, إضاءة نيون فاقعة, بلاستيك لامع, عبوات تجارية رخيصة, خلفيات معتمة مظلمة',
    aestheticStyle: 'تصوير طبيعي دافئ بضوء الشمس الصباحي الطبيعي (Organic Nordic / Warm Sunlight) مع ظلال نباتية ناعمة.',
    logoGuidelines: 'شعار ناعم لورقة شجر بسيطة باللون الأخضر المريمي.',
    createdAt: 1700000002000,
  },
];

export const DIMENSION_PRESETS: DimensionPreset[] = [
  {
    id: '3:4',
    name: 'عمودي 3:4',
    ratio: '3:4',
    width: 1536,
    height: 2048,
    orientation: 'vertical',
    tag: '1536×2048',
    description: 'مثالي للإعلانات المطبوعة والملصقات وتطبيقات الموبايل',
  },
  {
    id: '2:3',
    name: 'عمودي 2:3',
    ratio: '2:3',
    width: 1024,
    height: 1536,
    orientation: 'vertical',
    tag: '1024×1536',
    description: 'مقاس البورتريه الكلاسيكي والتصوير الفوتوغرافي العمودي',
  },
  {
    id: '4:5',
    name: 'عمودي 4:5',
    ratio: '4:5',
    width: 1024,
    height: 1280,
    orientation: 'vertical',
    tag: '1024×1280',
    description: 'المقاس الأمثل لمنشورات إنستغرام لملء شاشة التغذية',
  },
  {
    id: '9:16',
    name: 'ستوري 9:16',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    orientation: 'vertical',
    tag: '1080×1920',
    description: 'ستوري وريلز وتيك توك وشاشات الهواتف الكاملة',
  },
  {
    id: '1:1',
    name: 'مربع 1:1',
    ratio: '1:1',
    width: 1024,
    height: 1024,
    orientation: 'square',
    tag: '1024×1024',
    description: 'التنسيق المتوازن لمنصات التواصل ومتاجر التجارة الإلكترونية',
  },
  {
    id: '4:3',
    name: 'أفقي 4:3',
    ratio: '4:3',
    width: 1536,
    height: 1152,
    orientation: 'horizontal',
    tag: '1536×1152',
    description: 'شاشات العرض الكلاسيكية والمدونات والكتالوجات الرقمية',
  },
  {
    id: '3:2',
    name: 'أفقي 3:2',
    ratio: '3:2',
    width: 1536,
    height: 1024,
    orientation: 'horizontal',
    tag: '1536×1024',
    description: 'النسبة المعيارية لكاميرات DSLR ومطبوعات المناظر الطبيعية',
  },
  {
    id: '16:9',
    name: 'عريض 16:9',
    ratio: '16:9',
    width: 1920,
    height: 1080,
    orientation: 'horizontal',
    tag: '1920×1080',
    description: 'بنرات يوتيوب والشاشات العريضة والعروض التقديمية',
  },
  {
    id: 'custom',
    name: 'مقاس مخصص',
    ratio: 'custom',
    width: 1200,
    height: 1200,
    orientation: 'custom',
    tag: 'مخصص',
    description: 'حدد العرض والارتفاع المطلوبين بحرية تامة',
  },
];

export const DEFAULT_FRAMING_SETTINGS: FramingSettings = {
  dimensionId: '1:1',
  aspectRatio: '1:1',
  width: 1024,
  height: 1024,
  productPlacement: 'center',
  productScale: 'standard',
  margin: 'balanced',
  safeZone: true,
  backgroundStyle: 'extracted_complementary',
  preserveFidelity: true,
};

export const generateDefaultQuickIdeas = (
  productName: string,
  brandKit?: BrandKit | null,
  tool: TargetTool = 'midjourney',
  framing?: FramingSettings
): QuickInstantIdea[] => {
  const pName = productName.trim() || 'المنتج التجاري الفاخر';
  const ratio = framing?.aspectRatio || '1:1';
  
  // Brand color tags and prompts
  const brandColors = brandKit?.colors && brandKit.colors.length > 0
    ? brandKit.colors.map((c) => `${c.name} (${c.hex})`).join(', ')
    : '';
  const brandColorHex = brandKit?.colors && brandKit.colors.length > 0
    ? brandKit.colors[0].hex
    : '#4C53DB';
  const brandColorSecondHex = brandKit?.colors && brandKit.colors.length > 1
    ? brandKit.colors[1].hex
    : '#F8FAFC';

  const toolParams = tool === 'midjourney'
    ? `--ar ${ratio} --v 6.1 --style raw`
    : tool === 'krea'
    ? `--aspect ${ratio} --quality 2`
    : 'Commercial Photography Preset';

  const brandNegative = brandKit?.negativeRules ? `, ${brandKit.negativeRules}` : '';
  const baseNegative = `blurry, distorted packaging, morphed product shape, altered logo, fake text, random typography, low resolution, amateur photography, cropped product, clutter${brandNegative}`;

  return [
    {
      id: 'quick-1-studio',
      title: 'استوديو فاخر مينيمالي مع منصة هندسية',
      category: 'studio',
      categoryLabel: 'استوديو فاخر',
      backgroundDescription: 'منصة هندسية رخامية ناعمة محايدة مع تدرج لوني عميق مستلهم من هوية المنتج',
      lightingDescription: 'إضاءة استوديو Softbox علوية موجهة بزاوية 45 درجة مع إضاءة حافة دقيقة (Rim Light)',
      compositionDescription: 'توسيط هندسي مثالي في قلب الكادر، هوامش تنفس 28%، ومنطقة أمان مركزية 50%',
      shortDescription: 'إبراز فخامة المنتج بأسلوب مينيمالي نقي يركز 100% على خامة العبوة وأناقتها دون أي تشتيت.',
      productPreservation: 'الحفاظ الكامل على شكل العبوة الأصلي وتفاصيل الشعار والألوان كما هي دون أي تحوير.',
      brandVaultNote: brandKit ? `تطبيق ألوان الهوية: ${brandColors}` : undefined,
      finalPrompt: `High-end commercial product photography of ${pName}, perfectly centered on a clean minimalist geometric stone pedestal. Subtle gradient studio backdrop in elegant tones ${brandKit ? `incorporating brand accents ${brandColorHex}` : 'neutral slate'}. Professional softbox studio lighting, crisp edge rim light, perfectly balanced reflections. 28% breathing margin, central safe zone. Exact authentic product packaging preserved with zero distortion, crisp commercial realism, Hasselblad 80mm lens, sharp focus. ${toolParams}`,
      arabicPrompt: `تصوير منتجات تجاري فائق الجودة لـ (${pName}) متموضع في المركز فوق منصة حجرية مينيمالية، إضاءة استوديو ناعمة وإضاءة حافة تبرز الأبعاد، خلفية هادئة تعكس ألوان العلامة، مع الحفاظ التام على أصل العبوة.`,
      aspectRatio: ratio,
      parameters: toolParams,
      negativePrompt: baseNegative,
    },
    {
      id: 'quick-2-nature',
      title: 'طبيعي عضوي بضوء الشمس والظلال النباتية',
      category: 'nature',
      categoryLabel: 'طبيعي عضوي',
      backgroundDescription: 'سطح خشبي أو حجري طبيعي مع ظلال أوراق أشجار ناعمة (Dappled sunlight)',
      lightingDescription: 'ضوء شمس ذهبي طبيعي دافئ وقت العصر (Golden Hour) مع انعكاسات ضوئية واقعية',
      compositionDescription: 'زاوية كاميرا Eye-level مستوية مع عمق ميدان ضحل (DoF) يعزل المنتج بنعومة',
      shortDescription: 'إضفاء طابع الحيوية والنقاء الطبيعي مع المحافظة التامة على هيبة ومظهر المنتج.',
      productPreservation: 'لا تغيير في تفاصيل العلبة أو الملصق؛ التغيير محصور في البيئة والإضاءة الحيوية فقط.',
      brandVaultNote: brandKit ? `تنسيق الإضاءة المتوافقة مع ألوان براند ${brandKit.name}` : undefined,
      finalPrompt: `Organic lifestyle product photography featuring authentic ${pName} resting on a natural warm textured stone surface. Soft warm golden-hour afternoon sunlight filtering through botanical foliage creating elegant dappled shadows. Fresh organic atmosphere, shallow depth of field, gentle bokeh in background ${brandKit ? `with subtle ambient undertones matching ${brandColorHex}` : ''}. Exact reference product geometry and label intact, ultra-clean realistic texture, cinematic soft shadows. ${toolParams}`,
      arabicPrompt: `صورة فوتوغرافية حيوية لـ (${pName}) على سطح طبيعي دافئ، تتخلله إضاءة شمس العصر مع ظلال أوراق الشجر الناعمة، طابع طبيعي وأصيل دون أي مساس بتفاصيل المنتج الأصلية.`,
      aspectRatio: ratio,
      parameters: toolParams,
      negativePrompt: baseNegative,
    },
    {
      id: 'quick-3-dramatic',
      title: 'سينمائي درامي مع تباين جريء وإضاءة نيون',
      category: 'dramatic',
      categoryLabel: 'سينمائي درامي',
      backgroundDescription: 'خلفية داكنة فحمية مخملية مع وهج ضوئي محيطي ملون يعكس هوية البراند',
      lightingDescription: 'إضاءة كياروسكورو (Chiaroscuro) سينمائية حادة مع إضاءة ثنائية ملونة (Dual-tone backlight)',
      compositionDescription: 'زاوية كاميرا ديناميكية مائلة قليلاً، المنتج يطفو بانسيابية هادئة مع انعكاس سفلي',
      shortDescription: 'مشهد إعلاني جريء وعالي التأثير يلفت الانتباه فوراً على منصات التواصل والإعلانات الرقمية.',
      productPreservation: 'هيكل المنتج وملصقه ثابتان 100%؛ التباين الدرامي يخدم إبراز تفاصيل التصميم.',
      brandVaultNote: brandKit ? `استخدام إضاءة نيون مستوحاة من كود ${brandColorHex} و ${brandColorSecondHex}` : undefined,
      finalPrompt: `Dramatic cinematic advertising shot of authentic ${pName}, suspended in subtle elegant levitation against a dark moody charcoal textured backdrop. High-contrast chiaroscuro lighting with vivid dual rim lights glowing in ${brandKit ? `${brandColorHex} and ${brandColorSecondHex}` : 'subtle indigo and cyan accents'}. Crisp reflections, bold visual impact, commercial billboard aesthetics. Original product details, labels and materials perfectly preserved without alteration, razor-sharp textures, 85mm lens. ${toolParams}`,
      arabicPrompt: `لقطة سينمائية جريئة ذات تباين عالٍ لـ (${pName}) على خلفية فحمية داكنة مع إضاءة حافة مزدوجة متوهجة بألوان الهوية، تأثير إعلاني قوي يبرز المنتج دون تغيير شكله.`,
      aspectRatio: ratio,
      parameters: toolParams,
      negativePrompt: baseNegative,
    },
    {
      id: 'quick-4-architectural',
      title: 'داخلي معماري عصري وناعم (Editorial Interior)',
      category: 'architectural',
      categoryLabel: 'معماري عصري',
      backgroundDescription: 'مساحة داخلية إسكندنافية معاصرة مع تفاصيل معمارية ناعمة وقوس مينيمالي',
      lightingDescription: 'ضوء نهاري ناعم منتشر عبر نافذة زجاجية كبيرة، بدون ظلال حادة',
      compositionDescription: 'تكوين تحريري راقٍ مع مساحات فارغة متوازنة تناسب الحملات الإعلانية ومجلات الموضة',
      shortDescription: 'بيئة معمارية عصرية هادئة تعكس أسلوب الحياة الراقي والذوق الرفيع للمنتج.',
      productPreservation: 'هوية وشكل المنتج محمية بالكامل؛ المشهد المحيط يبرز اندماجه في الحياة اليومية الراقية.',
      brandVaultNote: brandKit ? `تناغم جدران المشهد مع لوحة ألوان ${brandKit.name}` : undefined,
      finalPrompt: `Editorial architectural interior product photography of ${pName} positioned on a smooth contemporary terrazzo tabletop. Soft diffused daylight streaming through modern floor-to-ceiling windows. Sophisticated Scandinavian interior aesthetic, clean architectural arches, subtle pastel and warm grey atmosphere ${brandKit ? `harmonized with ${brandColorHex}` : ''}. Generous clean negative space for commercial copy, authentic product packaging with pristine fidelity, Vogue editorial style. ${toolParams}`,
      arabicPrompt: `تصوير منتجات تحريري عصري لـ (${pName}) في مساحة داخلية معمارية راقية، ضوء نهاري منتشر وناعم، تكوين هادئ يعطي إحساساً بالفخامة اليومية مع حماية تفاصيل المنتج 100%.`,
      aspectRatio: ratio,
      parameters: toolParams,
      negativePrompt: baseNegative,
    },
  ];
};

// 1. Cinematic Lighting Styles (أنماط الإضاءة السينمائية)
export const CINEMATIC_LIGHTING_STYLES: CinematicLightingStyleInfo[] = [
  {
    id: 'dramatic_cinematic',
    name: 'إضاءة سينمائية درامية',
    nameEn: 'Dramatic Cinematic',
    description: 'تباين قوي، زوايا ضوء حادة، وعمق بصري يمنح المنتج حضوراً سينمائياً آسراً',
    badge: 'دراما وهيبة',
    previewGradient: 'from-amber-600 via-stone-800 to-black',
  },
  {
    id: 'low_key',
    name: 'إضاءة منخفضة ومظلمة (Low-Key)',
    nameEn: 'Low-Key Moody',
    description: 'سيادة المساحات المظلمة وظلال غنية مع إبراز نقاط الوهج الرئيسية للمنتج',
    badge: 'فخامة غامضة',
    previewGradient: 'from-slate-700 via-neutral-900 to-black',
  },
  {
    id: 'high_key',
    name: 'إضاءة عالية وناعمة (High-Key)',
    nameEn: 'High-Key Commercial',
    description: 'بيئة مضيئة مشرقة، ظلال شبه معدومة، وانطباع نقي وحيوي للمستحضرات والأزياء',
    badge: 'نقاء وإشراق',
    previewGradient: 'from-slate-100 via-white to-indigo-100',
  },
  {
    id: 'chiaroscuro',
    name: 'إضاءة كياروسكورو (Chiaroscuro)',
    nameEn: 'Chiaroscuro Renaissance',
    description: 'تباين شديد وكلاسيكي بين الضوء الساطع والظلال المنحوتة لإبراز الأبعاد الثلاثية',
    badge: 'نحت كلاسيكي',
    previewGradient: 'from-amber-500 via-amber-950 to-stone-950',
  },
  {
    id: 'side_lighting',
    name: 'إضاءة سينمائية جانبية (Side Lighting)',
    nameEn: 'Cinematic Side Light',
    description: 'ضوء يتدفق بزاوية 90 درجة يبرز ملامس الخامات والتفاصيل السطحية للعبوة',
    badge: 'إبراز الملامس',
    previewGradient: 'from-violet-500 via-slate-900 to-neutral-950',
  },
  {
    id: 'backlight_rim',
    name: 'إضاءة خلفية وتوهج محيطي (Backlight & Rim)',
    nameEn: 'Backlight & Rim Light',
    description: 'تحديد حواف المنتج بخط ضوئي حاد يفصله عن الخلفية ويمنحه هالة ضوئية ساحرة',
    badge: 'عزل وهالة',
    previewGradient: 'from-cyan-400 via-blue-950 to-black',
  },
  {
    id: 'volumetric',
    name: 'إضاءة حجمية وأشعة ظاهرة (Volumetric)',
    nameEn: 'Volumetric & God Rays',
    description: 'أشعة ضوئية مرئية تخترق الهواء والضباب الخفيف لإضفاء عمق جوي أسطوري',
    badge: 'أشعة حجمية',
    previewGradient: 'from-amber-300 via-yellow-900 to-stone-900',
  },
  {
    id: 'diffused',
    name: 'إضاءة ضبابية ناعمة (Diffused Lighting)',
    nameEn: 'Soft Silk Diffused',
    description: 'توزيع فائق النعومة بدون حواف قاسية، مثالي للزجاج والأسطح شديدة اللمعان',
    badge: 'نعومة حريرية',
    previewGradient: 'from-pink-100 via-indigo-50 to-slate-200',
  },
  {
    id: 'warm_golden_cool_blue',
    name: 'ذهبي دافئ وبارد أزرق (Dual Tone)',
    nameEn: 'Warm Golden & Cool Blue',
    description: 'تناغم سينمائي ثنائي بين حرارة الشمس الذهبية وبرودة الظلال الزرقاء العميقة',
    badge: 'تدرج ثنائي',
    previewGradient: 'from-amber-400 via-indigo-900 to-blue-950',
  },
  {
    id: 'anamorphic_luxury',
    name: 'إضاءة سينمائية أنامورفيك هوليوودية',
    nameEn: 'Anamorphic Luxury Cinema',
    description: 'خطوط توهج زرقاء أفقية، بوكيه بيضاوي، وفخامة مستوحاة من عدسات Panavision',
    badge: 'سينما هوليوود',
    previewGradient: 'from-blue-500 via-purple-950 to-black',
  },
];

// 2. Cinematic Color Palettes (لوحات الألوان السينمائية المتناسقة)
export const CINEMATIC_PALETTES: CinematicPaletteInfo[] = [
  {
    id: 'teal_orange',
    name: 'تيل وأورانج هوليوودي',
    nameEn: 'Teal & Orange',
    colors: ['#0E7490', '#F97316', '#0F172A', '#FED7AA'],
    description: 'اللوحة السينمائية الأشهر في أفلام هوليوود، تباين حار وبارد يبرز المنتج فوراً',
  },
  {
    id: 'amber_obsidian',
    name: 'عنبري دافئ وظلال سوداء',
    nameEn: 'Warm Amber & Obsidian',
    colors: ['#D97706', '#1C1917', '#78350F', '#FEF3C7'],
    description: 'دفء عطري وفخامة أرستقراطية تناسب العطور الفاخرة والجلود والمنتجات الحرفية',
  },
  {
    id: 'emerald_silver',
    name: 'زمردي فاخر وفضي نقي',
    nameEn: 'Emerald & Platinum Silver',
    colors: ['#047857', '#E2E8F0', '#064E3B', '#94A3B8'],
    description: 'طبيعة راقية وثراء بصري يعكس الجودة العالية والاستدامة المترفة',
  },
  {
    id: 'cyberpunk_neon',
    name: 'نيون سايبربانك كهربائي',
    nameEn: 'Cyberpunk Neon Glow',
    colors: ['#06B6D4', '#EC4899', '#3B82F6', '#1E1B4B'],
    description: 'توهج عصري مستقبلي للأجهزة التقنية والإلكترونيات ومنتجات الشباب الحيوية',
  },
  {
    id: 'golden_hour',
    name: 'الساعة الذهبية والغروب',
    nameEn: 'Sunset Golden Hour',
    colors: ['#F59E0B', '#B45309', '#7C2D12', '#FDE68A'],
    description: 'شمس الغروب الناعمة، دفء طبيعي عضوي يعزز المشاعر والأناقة المريحة',
  },
  {
    id: 'monochrome_graphite',
    name: 'أحادي كروم وجرافيت',
    nameEn: 'Monochrome Chrome & Graphite',
    colors: ['#F8FAFC', '#64748B', '#1E293B', '#020617'],
    description: 'مينيمالية صناعية فائقة، تركيز كامل على المعدن والتكوين والظلال النقية',
  },
  {
    id: 'pastel_highfashion',
    name: 'باستيل أزياء وموضة ناعمة',
    nameEn: 'High-Fashion Soft Pastel',
    colors: ['#FDA4AF', '#DDD6FE', '#FDF2F8', '#64748B'],
    description: 'رقة وأنوثة فائقة لمستحضرات التجميل والعناية بالبشرة وإعلانات الموضة',
  },
  {
    id: 'royal_crimson_gold',
    name: 'ملكي قرمزي وذهب مصقول',
    nameEn: 'Royal Crimson & Molten Gold',
    colors: ['#991B1B', '#EAB308', '#450A0A', '#FEF08A'],
    description: 'فخامة ملكية مهيبة تناسب المجوهرات والمنتجات التذكارية والقطع النادرة',
  },
];

// 3. Ready-made Lighting Recipes (10 وصفات إضاءة جاهزة)
export const CINEMATIC_RECIPES: LightingRecipeInfo[] = [
  {
    id: 'perfume_luxury',
    title: 'إضاءة إعلانات العطور الفاخرة',
    titleEn: 'Luxury Perfume Commercial',
    category: 'عطور ومستحضرات',
    description: 'إضاءة استوديو درامية متوازنة بـ Softbox كبير بزاوية 45°، إضاءة حافة حادة تفصل الزجاج، وانعكاسات دقيقة تحافظ على بريق السائل وتفاصيل الملصق.',
    settings: {
      styleId: 'dramatic_cinematic',
      keyLightDirection: 'side_45',
      keyLightAngle: 45,
      keyLightHeight: 'high_60',
      intensity: 85,
      softness: 'medium_diffused',
      beamSpread: 'medium_45',
      contrastRatio: 'dramatic_4_1',
      colorTemperatureK: 3800,
      rimLightPower: 'intense',
      volumetricHaze: 'light_mist',
      shadowDepth: 'deep_black',
      reflections: 'specular_glossy',
      bloomGlow: 'subtle_lens',
      lightingRatio: '4:1',
      palette: 'amber_obsidian',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: High-end luxury perfume commercial lighting. 45-degree diffused key softbox at 3800K warm luxury warmth, powerful precision rim light sculpting glass contours, subtle ethereal micro-mist catching highlights, 4:1 lighting ratio, deep obsidian shadows, crisp specular caustics, preserving authentic bottle geometry, typography and logo fidelity.',
    arabicSnippet: 'إضاءة إعلانات عطور فاخرة: إضاءة رئيسية بزاوية 45 درجة مع سوفت بوكس مشتت، إضاءة حافة قوية تنحت حواف الزجاج، رذاذ دقيق يعكس البريق، تباين 4:1 وظلال فحمية عميقة مع الحفاظ التام على أصل العبوة والشعار.',
  },
  {
    id: 'dark_background',
    title: 'إضاءة المنتجات على خلفية سوداء',
    titleEn: 'Dark Background Isolation',
    category: 'تصوير تجاري داكن',
    description: 'إضاءة منخفضة Low-Key تسلط الضوء على المنتج بحزم ضوئية ضيقة، مع عزل كامل للخلفية السوداء المخملية بدون أي تسريب ضوئي.',
    settings: {
      styleId: 'low_key',
      keyLightDirection: 'profile_90',
      keyLightAngle: 60,
      keyLightHeight: 'eye_level',
      intensity: 90,
      softness: 'hard_direct',
      beamSpread: 'spot_15',
      contrastRatio: 'extreme_8_1',
      colorTemperatureK: 4500,
      rimLightPower: 'halo',
      volumetricHaze: 'none',
      shadowDepth: 'deep_black',
      reflections: 'specular_glossy',
      bloomGlow: 'none',
      lightingRatio: '8:1',
      palette: 'monochrome_graphite',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Masterful Low-Key product photography on seamless infinite jet black background. Narrow snoot spot key light focused precisely on product hero angle, sharp 8:1 chiaroscuro contrast ratio, edge rim light halo defining exterior silhouette, pure pitch-black negative space, zero ambient spill, razor-sharp authentic packaging details.',
    arabicSnippet: 'إضاءة منخفضة Low-Key على خلفية سوداء لا نهائية: حزمة ضوء بؤرية مسلطة بدقة على بطل المشهد، تباين 8:1 حاد، هالة ضوئية تنحت الحواف الخارجية، سواد تام في الخلفية وثبات فائق لهيكل المنتج.',
  },
  {
    id: 'gold_metallic',
    title: 'إضاءة المنتجات الذهبية والمعدنية',
    titleEn: 'Gold & Metallic Luster',
    category: 'مجوهرات ومعادن',
    description: 'شرائط إضاءة طويلة متدرجة (Strip Softbox) تمنح المعادن والذهب انعكاسات متصلة وأنيقة دون بقع ضوئية محترقة (Hotspots).',
    settings: {
      styleId: 'diffused',
      keyLightDirection: 'side_45',
      keyLightAngle: 35,
      keyLightHeight: 'high_60',
      intensity: 75,
      softness: 'ultra_soft_silk',
      beamSpread: 'flood_120',
      contrastRatio: 'natural_2_1',
      colorTemperatureK: 3200,
      rimLightPower: 'medium',
      volumetricHaze: 'none',
      shadowDepth: 'feathered',
      reflections: 'specular_glossy',
      bloomGlow: 'vintage_halation',
      lightingRatio: '2:1',
      palette: 'royal_crimson_gold',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Specialized gold and polished metallic commercial studio lighting. Dual continuous gradient strip softboxes creating seamless liquid-metal specular reflections, warm 3200K tungsten glow emphasizing gold karats, anti-glare polarization, perfectly feathered falloff, preserving original metal textures, engravings, and hallmark details.',
    arabicSnippet: 'إضاءة متخصصة للمعادن والذهب: شرائط سوفت بوكس متدرجة ترسم انعكاسات سائلة مصقولة بدون وهج مزعج، حرارة لونية دافئة 3200 كلفن، تدرج ناعم يحافظ على دقة النقوش وخامات المعدن الحقيقية.',
  },
  {
    id: 'glass_reflective',
    title: 'إضاءة المنتجات الزجاجية والعاكسة',
    titleEn: 'Glassware & Reflective Caustics',
    category: 'زجاجيات وعبوات شفافة',
    description: 'إضاءة خلفية تضيء الزجاج من الداخل وتنتج انكسارات ضوئية وظلالاً نقية (Caustics) مع تحديد أسود دقيق للحواف الشفافة.',
    settings: {
      styleId: 'backlight_rim',
      keyLightDirection: 'overhead_top',
      keyLightAngle: 0,
      keyLightHeight: 'overhead_90',
      intensity: 80,
      softness: 'medium_diffused',
      beamSpread: 'medium_45',
      contrastRatio: 'natural_2_1',
      colorTemperatureK: 5600,
      rimLightPower: 'halo',
      volumetricHaze: 'none',
      shadowDepth: 'ambient_fill',
      reflections: 'specular_glossy',
      bloomGlow: 'subtle_lens',
      lightingRatio: '2:1',
      palette: 'emerald_silver',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Translucent glass and reflective bottle backlight setup. Bright back panel diffusion casting luminous inner liquid refraction and crystalline caustics, dark-field edge subtraction defining crisp crystal silhouettes, pure 5600K daylight balance, immaculate reflections, true product label clarity.',
    arabicSnippet: 'إضاءة الزجاجيات والانعكاسات: إضاءة خلفية مشتتة تعبر السائل الشفاف وتصنع انكسارات كريستالية ساحرة، خطوط حافة داكنة تبرز حدود القارورة، مع وضوح تام للملصق التجاري.',
  },
  {
    id: 'smoky_cinematic',
    title: 'إضاءة سينمائية دخانية',
    titleEn: 'Smoky Atmospheric Cinematic',
    category: 'سينما وأجواء درامية',
    description: 'أجواء دخانية سينمائية مع إضاءة حجمية قوية وأشعة ضوء مرئية (God Rays) تخترق المشهد وتخلق عمقاً بصرياً غامضاً ومثيراً.',
    settings: {
      styleId: 'volumetric',
      keyLightDirection: 'side_45',
      keyLightAngle: 50,
      keyLightHeight: 'high_60',
      intensity: 95,
      softness: 'hard_direct',
      beamSpread: 'spot_15',
      contrastRatio: 'dramatic_4_1',
      colorTemperatureK: 6000,
      rimLightPower: 'intense',
      volumetricHaze: 'god_rays',
      shadowDepth: 'deep_black',
      reflections: 'diffused_matte',
      bloomGlow: 'vintage_halation',
      lightingRatio: '4:1',
      palette: 'teal_orange',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Moody atmospheric cinematic haze with intense volumetric god rays. Harsh directional back-key projector piercing through dense fine cinematic smoke ribbons, strong rim illumination separating product, dramatic 4:1 lighting ratio, vintage halation around light sources, uncompromised product silhouette and authentic branding.',
    arabicSnippet: 'إضاءة سينمائية دخانية: ضباب سينمائي دقيق تخترقه أشعة حجمية ظاهرة (God Rays)، إضاءة حافة قوية تعزل المنتج، تباين 4:1 مع هالة ضوئية كلاسيكية تحيط بمصادر الضوء وتحمي معالم المنتج.',
  },
  {
    id: 'modern_tech',
    title: 'إضاءة المنتجات التقنية الحديثة',
    titleEn: 'Modern Futuristic Tech',
    category: 'تقنية وإلكترونيات',
    description: 'إضاءة مستقبلية دقيقة بخطوط حادة بدرجات حرارة 6500K ناصعة، مع لمسات سايبربانك سيان وماجنتا ناعمة تبرز أناقة التصميم المعدني والبلاستيكي.',
    settings: {
      styleId: 'anamorphic_luxury',
      keyLightDirection: 'front',
      keyLightAngle: 20,
      keyLightHeight: 'high_60',
      intensity: 85,
      softness: 'medium_diffused',
      beamSpread: 'medium_45',
      contrastRatio: 'dramatic_4_1',
      colorTemperatureK: 6500,
      rimLightPower: 'intense',
      volumetricHaze: 'none',
      shadowDepth: 'crisp',
      reflections: 'specular_glossy',
      bloomGlow: 'anamorphic_streak',
      lightingRatio: '4:1',
      palette: 'cyberpunk_neon',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Futuristic modern consumer tech product lighting. Ultra-clean 6500K cool daylight key light, precision linear LED rim lights with subtle cyan and electric magenta accents, sharp anamorphic lens flare streaks, controlled matte-to-gloss micro reflections, razor-crisp port and button details, pristine product branding integrity.',
    arabicSnippet: 'إضاءة الأجهزة التقنية الحديثة: ضوء رئيسي بارد نقي 6500 كلفن، خطوط إضاءة LED دقيقة بلون السيان والماجنتا، توهج أفقي أنامورفيك، وانعكاسات منضبطة تبرز جودة تصنيع الجهاز ومنافذه بدقة.',
  },
  {
    id: 'dramatic_luxury',
    title: 'إضاءة درامية للمنتجات الفاخرة',
    titleEn: 'Dramatic Luxury Chiaroscuro',
    category: 'فخامة ورفاهية',
    description: 'أسلوب كياروسكورو إيطالي بزاوية ريمبراندت 45° وظلال فحمية عميقة وتوهج خافت يمنح الساعات والمجوهرات فخامة هادئة وتفرداً نادراً.',
    settings: {
      styleId: 'chiaroscuro',
      keyLightDirection: 'side_45',
      keyLightAngle: 45,
      keyLightHeight: 'high_60',
      intensity: 90,
      softness: 'medium_diffused',
      beamSpread: 'spot_15',
      contrastRatio: 'extreme_8_1',
      colorTemperatureK: 3500,
      rimLightPower: 'subtle',
      volumetricHaze: 'none',
      shadowDepth: 'deep_black',
      reflections: 'specular_glossy',
      bloomGlow: 'subtle_lens',
      lightingRatio: '8:1',
      palette: 'amber_obsidian',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Dramatic high-end luxury chiaroscuro. Rembrandt-style key angle at 45 degrees, rich 3500K champagne warmth, sculpted velvety black shadows with 8:1 extreme lighting ratio, subtle rim light carving the product profile, museum-grade commercial aesthetics, preserving genuine craftsmanship and product materials.',
    arabicSnippet: 'إضاءة درامية للمنتجات الفاخرة: أسلوب ريمبراندت بزاوية 45 درجة، دفء لوني عنبري 3500 كلفن، ظلال مخملية عميقة بنسبة تباين 8:1، مع إضاءة حافة ناعمة تبرز الحرفية الفائقة للمنتج.',
  },
  {
    id: 'beauty_cosmetics',
    title: 'إضاءة ناعمة لمستحضرات التجميل',
    titleEn: 'Soft Beauty & Cosmetics High-Key',
    category: 'مستحضرات وجمال',
    description: 'إضاءة فراشة (Butterfly) عالية النعومة High-Key بظلال شبه منعدمة ولوحة ألوان باستيل وردية وعاجية تبرز نضارة المنتج ونقائه.',
    settings: {
      styleId: 'high_key',
      keyLightDirection: 'front',
      keyLightAngle: 0,
      keyLightHeight: 'high_60',
      intensity: 70,
      softness: 'ultra_soft_silk',
      beamSpread: 'flood_120',
      contrastRatio: 'soft_1_1',
      colorTemperatureK: 4800,
      rimLightPower: 'subtle',
      volumetricHaze: 'none',
      shadowDepth: 'ambient_fill',
      reflections: 'diffused_matte',
      bloomGlow: 'subtle_lens',
      lightingRatio: '1:1',
      palette: 'pastel_highfashion',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: High-Key beauty and cosmetics studio lighting. Large overhead butterfly beauty dish with silk diffusion, ultra-soft wrap-around ambient fill, gentle 1:1 lighting ratio eliminating harsh shadows, delicate luminous pastel radiance at 4800K, immaculate packaging texture and color fidelity, Vogue beauty campaign standard.',
    arabicSnippet: 'إضاءة ناعمة لمستحضرات التجميل: إضاءة علوية ناعمة بتقنية Butterfly Beauty Dish مع تشتيت حريري، تعبئة ضوئية شاملة 1:1 تمنع أي ظلال حادة، إشراقة باستيل راقية وثبات كامل لألوان العبوة وملمسها.',
  },
  {
    id: 'sunset_golden',
    title: 'إضاءة سينمائية طبيعية عند الغروب',
    titleEn: 'Natural Cinematic Golden Hour',
    category: 'طبيعي وأسلوب حياة',
    description: 'شمس الغروب الدافئة بزاوية منخفضة 2800K، ظلال ممتدة متدرجة، وهالة ذهبية تحيط بالمنتج وتخلق شعوراً بالدفء والأصالة والارتباط الإنساني.',
    settings: {
      styleId: 'warm_golden_cool_blue',
      keyLightDirection: 'low_angle_up',
      keyLightAngle: 65,
      keyLightHeight: 'low_20',
      intensity: 85,
      softness: 'medium_diffused',
      beamSpread: 'medium_45',
      contrastRatio: 'dramatic_4_1',
      colorTemperatureK: 2800,
      rimLightPower: 'intense',
      volumetricHaze: 'atmospheric_haze',
      shadowDepth: 'feathered',
      reflections: 'specular_glossy',
      bloomGlow: 'vintage_halation',
      lightingRatio: '4:1',
      palette: 'golden_hour',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Organic natural Golden Hour cinematic lighting. Low-raking direct warm sunlight at 2800K casting elongated soft-feathered shadows, glowing amber rim backlight with subtle atmospheric dust motes, rich complementary cool blue sky fill in shadows, photographic authenticity, unblemished product identity.',
    arabicSnippet: 'إضاءة سينمائية عند الغروب: أشعة شمس الغروب المائلة بدرجة 2800 كلفن الدافئة، ظلال طويلة ناعمة، هالة ضوئية عنبرية محيطية مع ظلال زرقاء خافتة، واقعية تصويرية تعزز حضور المنتج دون مساس بهويته.',
  },
  {
    id: 'commercial_studio',
    title: 'إضاءة استوديو تجاري احترافي',
    titleEn: 'Commercial Professional Three-Point Studio',
    category: 'إعلانات تجارية عامة',
    description: 'نظام الإضاءة التجاري الكلاسيكي ثلاثي النقاط (Key, Fill, Rim) المتوازن بدقة 5500K لضمان أقصى درجات الدقة اللونية والوضوح التجاري.',
    settings: {
      styleId: 'dramatic_cinematic',
      keyLightDirection: 'side_45',
      keyLightAngle: 45,
      keyLightHeight: 'high_60',
      intensity: 80,
      softness: 'medium_diffused',
      beamSpread: 'medium_45',
      contrastRatio: 'natural_2_1',
      colorTemperatureK: 5500,
      rimLightPower: 'medium',
      volumetricHaze: 'none',
      shadowDepth: 'feathered',
      reflections: 'specular_glossy',
      bloomGlow: 'none',
      lightingRatio: '2:1',
      palette: 'teal_orange',
      preserveProductFidelity: true,
    },
    promptSnippet: 'Cinematic Lighting: Standard professional three-point commercial product lighting. Balanced key softbox at 45-degree angle, subtle fill light controlling shadow contrast at 2:1 ratio, crisp rim hair light separating product from background, neutral 5500K daylight calibration for exact color reproduction, studio perfection, uncompromised brand authenticity.',
    arabicSnippet: 'إضاءة استوديو تجاري احترافي: إضاءة ثلاثية النقاط متوازنة بسوفت بوكس رئيسي بزاوية 45°، إضاءة تعبئة بنسبة 2:1، إضاءة حافة تفصل المنتج عن الخلفية، معايرة ضوء نهاري 5500 كلفن لدقة ألوان العبوة 100%.',
  },
];

// Default Cinematic Lighting Settings
export const DEFAULT_LIGHTING_SETTINGS: CinematicLightingSettings = {
  styleId: 'dramatic_cinematic',
  recipeId: 'commercial_studio',
  keyLightDirection: 'side_45',
  keyLightAngle: 45,
  keyLightHeight: 'high_60',
  intensity: 80,
  softness: 'medium_diffused',
  beamSpread: 'medium_45',
  contrastRatio: 'natural_2_1',
  colorTemperatureK: 5500,
  rimLightPower: 'medium',
  volumetricHaze: 'none',
  shadowDepth: 'feathered',
  reflections: 'specular_glossy',
  bloomGlow: 'subtle_lens',
  lightingRatio: '2:1',
  palette: 'teal_orange',
  preserveProductFidelity: true,
};

// Builder functions to generate tech specifications for prompts
export function buildCinematicLightingPromptSnippet(settings: CinematicLightingSettings): string {
  const recipe = CINEMATIC_RECIPES.find((r) => r.id === settings.recipeId);
  const style = CINEMATIC_LIGHTING_STYLES.find((s) => s.id === settings.styleId);
  const palette = CINEMATIC_PALETTES.find((p) => p.id === settings.palette);

  const directionMap: Record<string, string> = {
    front: 'frontal direct key',
    side_45: '45-degree classic key light',
    profile_90: '90-degree side profile key',
    overhead_top: 'overhead top-down beauty key',
    low_angle_up: 'low-angle upward dramatic key',
  };

  const heightMap: Record<string, string> = {
    eye_level: 'eye-level elevation',
    high_60: '60-degree high elevation',
    overhead_90: '90-degree zenith overhead',
    low_20: 'low 20-degree raking elevation',
  };

  const softnessMap: Record<string, string> = {
    hard_direct: 'crisp focused hard light',
    medium_diffused: 'medium softbox diffusion',
    ultra_soft_silk: 'ultra-soft silk wrap-around diffusion',
  };

  const rimMap: Record<string, string> = {
    off: 'no rim light',
    subtle: 'subtle edge contour rim light',
    medium: 'crisp commercial rim light',
    intense: 'powerful razor-sharp rim light',
    halo: 'glowing 360-degree halo rim backlight',
  };

  const hazeMap: Record<string, string> = {
    none: 'clean transparent atmosphere',
    light_mist: 'subtle ethereal micro-mist',
    atmospheric_haze: 'cinematic atmospheric haze',
    god_rays: 'dramatic visible volumetric god rays and light shafts',
  };

  const shadowMap: Record<string, string> = {
    crisp: 'sharp sculpted geometric shadows',
    feathered: 'soft feathered natural falloff shadows',
    deep_black: 'rich velvety pitch-black shadows',
    ambient_fill: 'gentle luminous ambient-filled shadows',
  };

  const refMap: Record<string, string> = {
    specular_glossy: 'crisp specular glossy highlights',
    diffused_matte: 'matte velvety sheen',
    anamorphic_glare: 'horizontal anamorphic glare',
    wet_surface: 'wet surface reflective shimmer',
  };

  const bloomMap: Record<string, string> = {
    none: 'sharp anti-bloom optics',
    subtle_lens: 'subtle lens glow',
    vintage_halation: 'vintage optical halation',
    anamorphic_streak: 'cinematic anamorphic blue streak bloom',
  };

  const colorTempDesc =
    settings.colorTemperatureK < 3300
      ? `${settings.colorTemperatureK}K warm golden tungsten warmth`
      : settings.colorTemperatureK < 5000
      ? `${settings.colorTemperatureK}K balanced warm-white studio warmth`
      : settings.colorTemperatureK < 6500
      ? `${settings.colorTemperatureK}K neutral clean daylight`
      : `${settings.colorTemperatureK}K cool ice-blue daylight`;

  const paletteDesc = palette ? `${palette.nameEn} color grading palette` : 'cinematic palette';
  const styleDesc = style ? style.nameEn : 'Cinematic Lighting';
  const fidelityDesc = settings.preserveProductFidelity
    ? 'Strictly preserving authentic product packaging, label typography, material texture, and colors without distortion or alteration'
    : 'Harmonious lighting across product and scene';

  return `Cinematic Lighting: ${styleDesc} setup. Key light positioned at ${directionMap[settings.keyLightDirection] || '45-degree angle'} with ${heightMap[settings.keyLightHeight] || 'high elevation'} at ${settings.intensity}% intensity, ${softnessMap[settings.softness] || 'medium softbox diffusion'}. ${colorTempDesc}. ${rimMap[settings.rimLightPower] || 'edge rim light'}. Lighting ratio ${settings.lightingRatio} with ${shadowMap[settings.shadowDepth] || 'sculpted shadows'}. ${hazeMap[settings.volumetricHaze] || 'clean air'}. ${refMap[settings.reflections] || 'specular highlights'}, ${bloomMap[settings.bloomGlow] || 'subtle lens glow'}. Harmonized with ${paletteDesc}. ${fidelityDesc}.`;
}

export function buildCinematicLightingArabicSnippet(settings: CinematicLightingSettings): string {
  const recipe = CINEMATIC_RECIPES.find((r) => r.id === settings.recipeId);
  const style = CINEMATIC_LIGHTING_STYLES.find((s) => s.id === settings.styleId);
  const palette = CINEMATIC_PALETTES.find((p) => p.id === settings.palette);

  const directionMapAr: Record<string, string> = {
    front: 'أمامي مباشر',
    side_45: 'جانبي بزاوية 45° كلاسيكية',
    profile_90: 'جانبي حاد بزاوية 90°',
    overhead_top: 'علوي مباشر من الأعلى',
    low_angle_up: 'منخفض تصاعدي للأعلى',
  };

  const softnessAr: Record<string, string> = {
    hard_direct: 'مباشر وبؤري حاد',
    medium_diffused: 'مشتت عبر سوفت بوكس',
    ultra_soft_silk: 'فائق النعومة بمشتت حريري واسع',
  };

  const rimAr: Record<string, string> = {
    off: 'بدون إضاءة خلفية',
    subtle: 'إضاءة حافة خافتة وناعمة',
    medium: 'إضاءة حافة تجارية واضحة',
    intense: 'إضاءة حافة قوية وحادة',
    halo: 'هالة ضوئية محيطية 360°',
  };

  const hazeAr: Record<string, string> = {
    none: 'هواء نقي بدون ضباب',
    light_mist: 'رذاذ دقيق خافت',
    atmospheric_haze: 'ضباب سينمائي جوي',
    god_rays: 'أشعة حجمية سينمائية ظاهرة (God Rays)',
  };

  const shadowAr: Record<string, string> = {
    crisp: 'ظلال هندسية حادة ومنحوتة',
    feathered: 'ظلال ناعمة ومتدرجة الانسياب',
    deep_black: 'ظلال فحمية عميقة ومخملية',
    ambient_fill: 'ظلال مضاءة بتعبئة محيطية هادئة',
  };

  const bloomAr: Record<string, string> = {
    none: 'بدون توهج إضافي',
    subtle_lens: 'توهج عدسة خافت',
    vintage_halation: 'هالة ضوئية كلاسيكية (Halation)',
    anamorphic_streak: 'توهج أفقي أنامورفيك أزرق',
  };

  return `إضاءة سينمائية (${style?.name || 'استوديو احترافي'}): ضوء رئيسي ${directionMapAr[settings.keyLightDirection] || 'بزاوية 45°'} بشدة ${settings.intensity}% و ${softnessAr[settings.softness] || 'سوفت بوكس ناعم'}، حرارة لونية ${settings.colorTemperatureK} كلفن، ${rimAr[settings.rimLightPower] || 'إضاءة حافة متناسقة'}، نسبة تباين ${settings.lightingRatio} مع ${shadowAr[settings.shadowDepth] || 'ظلال متدرجة'}، ${hazeAr[settings.volumetricHaze] || 'جو نقي'}، ${bloomAr[settings.bloomGlow] || 'توهج متناسق'}، لوحة ألوان: ${palette?.name || 'سينمائية متناسقة'}. مع الحفاظ الصارم على هوية وخامة المنتج 100%.`;
}
