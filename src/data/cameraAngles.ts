/**
 * Camera Angles & Perspectives Data Definition for Creative Studio AI
 * Categorized according to professional cinematography & commercial photography standards.
 */

import { CameraAngleCategory, CameraAngleOption, CameraAngleId } from '../types.ts';

export const AUTO_CAMERA_ANGLE: CameraAngleOption = {
  id: 'auto',
  nameAr: 'تلقائي (ذكاء اصطناعي)',
  nameEn: 'Auto (AI-Selected)',
  descriptionAr: 'يحدد الذكاء الاصطناعي الزاوية الأكثر جاذبية وتأثيراً تلقائياً بناءً على هوية المنتج والفكرة الإعلانية.',
  promptSnippet: 'AI-optimized professional commercial camera angle best suited for product aesthetics',
  compositionSnippet: 'تكوين مدروس ومختار تلقائياً بواسطة الذكاء الاصطناعي',
  category: 'auto',
  tag: 'موصى به',
};

export const CAMERA_ANGLE_CATEGORIES: CameraAngleCategory[] = [
  {
    id: 'basic',
    number: 1,
    titleAr: 'الزوايا الأساسية',
    titleEn: 'Basic Angles',
    angles: [
      {
        id: 'front',
        nameAr: 'أمامية',
        nameEn: 'Front View',
        descriptionAr: 'زاوية أمامية مباشرة تبرز واجهة المنتج والتناظر والشعار بوضوح تجاري كامل.',
        promptSnippet: 'Direct frontal symmetry, straight-on commercial front view, perfectly centered product face, clean front presentation',
        compositionSnippet: 'واجهة أمامية مباشرة مع توسيط متناظر للمنتج',
        category: 'basic',
      },
      {
        id: 'eye_level',
        nameAr: 'مستوى العين',
        nameEn: 'Eye-Level',
        descriptionAr: 'منظور طبيعي مريح بمستوى نظر العين يحاكي الرؤية البشرية الواقعية.',
        promptSnippet: 'Neutral eye-level angle, natural perspective at subject height, balanced realistic human viewpoint',
        compositionSnippet: 'منظور أفقي متوازن بمستوى نظر العين',
        category: 'basic',
      },
      {
        id: 'side',
        nameAr: 'جانبية',
        nameEn: 'Side View',
        descriptionAr: 'لقطة بروفايل جانبية 90 درجة توضح السُمك والمنحنيات الجانبية للمنتج.',
        promptSnippet: 'Crisp 90-degree profile side view, showcasing product silhouette, side thickness and contours',
        compositionSnippet: 'بروفايل جانبي بزاوية 90 درجة يكشف الخطوط الجانبية',
        category: 'basic',
      },
      {
        id: 'back',
        nameAr: 'خلفية',
        nameEn: 'Back View',
        descriptionAr: 'زاوية خلفية تبرز تصميم وتفاصيل الجهة الخلفية أو تشويق المشاهد.',
        promptSnippet: 'Rear view, detailed commercial back perspective, dramatic back-facing product presentation',
        compositionSnippet: 'زاوية خلفية مركزة على تفاصيل ظهر المنتج',
        category: 'basic',
      },
      {
        id: 'three_quarter',
        nameAr: 'ثلاثة أرباع',
        nameEn: 'Three-Quarter View',
        descriptionAr: 'الزاوية الإعلانية الأكثر شهرة (45 درجة) لتوضيح الواجهة والجانب معاً بعمق ثلاثي الأبعاد.',
        promptSnippet: 'Classic commercial 45-degree three-quarter view, multi-dimensional depth showing both front and side facets',
        compositionSnippet: 'زاوية كلاسيكية 45 درجة توضح الأبعاد والواجهة والجانب',
        category: 'basic',
      },
    ],
  },
  {
    id: 'high_low',
    number: 2,
    titleAr: 'الزوايا العلوية والمنخفضة',
    titleEn: 'High & Low Angles',
    angles: [
      {
        id: 'top_down',
        nameAr: 'علوية مباشرة',
        nameEn: 'Top-Down View',
        descriptionAr: 'مسقط رأسي 90 درجة من الأعلى (Flat-lay)، مثالي للترتيب الجرافيكي والتنسيقات المسطحة.',
        promptSnippet: 'Direct 90-degree top-down flat-lay shot, overhead perpendicular perspective, graphic arrangement',
        compositionSnippet: 'مسقط رأسي من الأعلى بزاوية 90 درجة (Flat-lay)',
        category: 'high_low',
      },
      {
        id: 'birds_eye',
        nameAr: 'منظور عين الطائر',
        nameEn: 'Bird’s-Eye View',
        descriptionAr: 'لقطة جوية علوية واسعة من مسافة تكشف المشهد والسياق المحيط بالمنتج.',
        promptSnippet: "Elevated bird's-eye view, high vantage panoramic perspective revealing surrounding contextual environment",
        compositionSnippet: 'منظور علوي واسع يشرف على بيئة المشهد بأكملها',
        category: 'high_low',
      },
      {
        id: 'high_angle',
        nameAr: 'زاوية مرتفعة',
        nameEn: 'High Angle',
        descriptionAr: 'الكاميرا تنظر للأسفل بزاوية 30-60 درجة لتوضيح السطح العلوي وتفاصيل الكادر.',
        promptSnippet: 'High angle shot looking downward at subject, tilted down 45 degrees, revealing top surface details',
        compositionSnippet: 'لقطة مرتفعة تنظر للأسفل بزاوية مائلة تكشف الغطاء والسطح العلوي',
        category: 'high_low',
      },
      {
        id: 'low_angle',
        nameAr: 'زاوية منخفضة',
        nameEn: 'Low Angle',
        descriptionAr: 'الكاميرا تنظر للأعلى من زاوية منخفضة لتمنح المنتج هيبة وقوة وحضوراً بطولياً (Hero Shot).',
        promptSnippet: 'Empowering low camera angle looking upward, monumental heroic commercial perspective, majestic presence',
        compositionSnippet: 'لقطة منخفضة تنظر للأعلى وتمنح المنتج حضوراً إعلانياً بطولياً',
        category: 'high_low',
      },
      {
        id: 'worms_eye',
        nameAr: 'منظور عين الدودة',
        nameEn: 'Worm’s-Eye View',
        descriptionAr: 'لقطة من أدنى مستوى أرضي ممكن نحو الأعلى لمنظور درامي فائق الارتفاع والعمق.',
        promptSnippet: "Ground-level worm's-eye view looking dramatically straight up, extreme ground perspective, soaring verticality",
        compositionSnippet: 'منظور ملاصق للأرض يتجه رأسياً للأعلى بدرامية بصرية قوية',
        category: 'high_low',
      },
    ],
  },
  {
    id: 'three_quarter_variants',
    number: 3,
    titleAr: 'زوايا ثلاثة أرباع',
    titleEn: 'Three-Quarter Angles',
    angles: [
      {
        id: 'high_three_quarter',
        nameAr: 'ثلاثة أرباع من أعلى',
        nameEn: 'High Three-Quarter View',
        descriptionAr: 'زاوية 45 درجة مع ارتفاع علوي يظهر الواجهة والجانب والسطح العلوي معاً.',
        promptSnippet: 'Elevated high three-quarter angle, looking down at a 45-degree isometric-like commercial angle',
        compositionSnippet: 'زاوية 45 درجة من الأعلى توضح الواجهة والجانب والسطح العلوي',
        category: 'three_quarter_variants',
      },
      {
        id: 'low_three_quarter',
        nameAr: 'ثلاثة أرباع من أسفل',
        nameEn: 'Low Three-Quarter View',
        descriptionAr: 'زاوية 45 درجة موجهة من الأسفل للأعلى لدمج العمق المجسم مع الهيبة الإعلانية.',
        promptSnippet: 'Low three-quarter perspective looking up, combining dimensional 45-degree depth with monumental presence',
        compositionSnippet: 'زاوية 45 درجة منخفضة تنظر للأعلى تجمع بين العمق ثلاثي الأبعاد والهيبة',
        category: 'three_quarter_variants',
      },
      {
        id: 'rear_three_quarter',
        nameAr: 'ثلاثة أرباع خلفية',
        nameEn: 'Rear Three-Quarter View',
        descriptionAr: 'لقطة 45 درجة من الخلف تظهر الجانب والخلف بأسلوب سينمائي غامض وجذاب.',
        promptSnippet: 'Rear three-quarter perspective, angled from behind at 45 degrees, sleek aesthetic silhouette',
        compositionSnippet: 'زاوية 45 درجة من الخلف تبرز المنحنيات الجانبية والخلفية',
        category: 'three_quarter_variants',
      },
    ],
  },
  {
    id: 'closeups',
    number: 4,
    titleAr: 'اللقطات القريبة والتفصيلية',
    titleEn: 'Close-Up & Detailed Shots',
    angles: [
      {
        id: 'close_up',
        nameAr: 'لقطة قريبة',
        nameEn: 'Close-Up',
        descriptionAr: 'تركيز حميمي يملأ الكادر بالمنتج لإبراز ملامحه وتصميمه بدقة عالية.',
        promptSnippet: 'Tight commercial close-up framing, intimate focus filling the frame with razor-sharp product details',
        compositionSnippet: 'لقطة قريبة تمتلئ بتفاصيل المنتج مع عزل ناعم للخلفية',
        category: 'closeups',
      },
      {
        id: 'extreme_close_up',
        nameAr: 'لقطة قريبة جدًا',
        nameEn: 'Extreme Close-Up',
        descriptionAr: 'لقطة فائقة القرب لعنصر محدد مثل الشعار أو ملمس الخامة أو النقوش الدقيقة.',
        promptSnippet: 'Extreme close-up shot focused on exquisite micro details, texture weave, emblem engraving, crisp focus',
        compositionSnippet: 'لقطة بالغة القرب تركز بصرياً على الشعار أو الخامة الدقيقة',
        category: 'closeups',
      },
      {
        id: 'macro',
        nameAr: 'تصوير ماكرو',
        nameEn: 'Macro Shot',
        descriptionAr: 'عدسة ماكرو متخصصة تكشف جزيئات المادة وقطرات الندى والانعكاسات المجهرية.',
        promptSnippet: 'True 1:1 macro photography, 100mm macro lens, ultra-shallow depth of field, tactile microscopic textures and droplets',
        compositionSnippet: 'تصوير ماكرو دقيق بعدسة 100mm يظهر الانعكاسات والقطرات والمسام المادية',
        category: 'closeups',
      },
    ],
  },
  {
    id: 'wide_perspective',
    number: 5,
    titleAr: 'اللقطات الواسعة والمنظورية',
    titleEn: 'Wide & Perspective Shots',
    angles: [
      {
        id: 'wide_shot',
        nameAr: 'لقطة واسعة',
        nameEn: 'Wide Shot',
        descriptionAr: 'لقطة بيئية واسعة تعرض المنتج ضمن محيطه وسياقه المعماري أو الطبيعي.',
        promptSnippet: 'Cinematic wide shot, establishing contextual environment around product, generous environmental framing',
        compositionSnippet: 'كادر سينمائي واسع يدمج المنتج ضمن بيئة وسياق متكامل',
        category: 'wide_perspective',
      },
      {
        id: 'pov',
        nameAr: 'منظور الشخص الأول',
        nameEn: 'POV Shot',
        descriptionAr: 'تصوير من منظور عين المستخدم (وكأنه يمسك أو يستخدم المنتج بيده).',
        promptSnippet: 'First-person point-of-view (POV) perspective, immersive experiential angle, user viewpoint interaction',
        compositionSnippet: 'منظور الشخص الأول POV يوحي بتجربة واستخدام مباشر من قبل العميل',
        category: 'wide_perspective',
      },
      {
        id: 'over_the_shoulder',
        nameAr: 'من فوق الكتف',
        nameEn: 'Over-the-Shoulder',
        descriptionAr: 'لقطة تضع المشاهد في سياق القصة الإعلانية عبر تأطير المنتج من وراء كتف شخص.',
        promptSnippet: 'Over-the-shoulder (OTS) framing, narrative cinematic depth placing product in focal third beyond shoulder silhouette',
        compositionSnippet: 'تأطير سينمائي من فوق الكتف يضيف بعداً روائياً وإنسانياً للمشهد',
        category: 'wide_perspective',
      },
    ],
  },
  {
    id: 'creative',
    number: 6,
    titleAr: 'الزوايا الإبداعية',
    titleEn: 'Creative Angles',
    angles: [
      {
        id: 'dutch_angle',
        nameAr: 'زاوية مائلة',
        nameEn: 'Dutch Angle',
        descriptionAr: 'ميلان محور الكاميرا (Canted Angle) لإعطاء شعور بالديناميكية، السرعة، والإثارة البصرية.',
        promptSnippet: 'Dynamic Dutch angle (canted angle), 15-degree tilted camera axis, high-energy diagonal tension and modern advertising style',
        compositionSnippet: 'زاوية مائلة ديناميكية Dutch Angle بميلان 15 درجة تعطي طاقة وحركة عصرية',
        category: 'creative',
      },
      {
        id: 'tilted_side',
        nameAr: 'زاوية جانبية مائلة',
        nameEn: 'Tilted Side View',
        descriptionAr: 'مزيج بين المنظور الجانبي مع انحراف وتمايل فني في زاوية الالتقاط.',
        promptSnippet: 'Artistically tilted side perspective, dynamic diagonal axis on profile view, unconventional edgy composition',
        compositionSnippet: 'منظور جانبي مع ميلان قطري فني غير تقليدي',
        category: 'creative',
      },
    ],
  },
];

// Helper to look up an angle by ID
export function getCameraAngleById(id: string): CameraAngleOption {
  if (id === 'auto' || !id) {
    return AUTO_CAMERA_ANGLE;
  }
  for (const cat of CAMERA_ANGLE_CATEGORIES) {
    const found = cat.angles.find((a) => a.id === id);
    if (found) return found;
  }
  return AUTO_CAMERA_ANGLE;
}
