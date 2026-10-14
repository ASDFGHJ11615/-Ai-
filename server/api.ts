import express from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction embodying the 5 integrated personas with strict prompt output requirements
const SYSTEM_PROMPT = `أنت "استوديو الإبداع" (Creative Studio AI) - وكيل ذكاء اصطناعي متخصص في الإبداع البصري وهندسة البرومبتات الاحترافية لمصممي الجرافيك، المخرجين الفنيين، وصنّاع المحتوى والمسوقين.

هويتك مكوّنة من خمس شخصيات متكاملة:
1. المدير الإبداعي: يبتكر الفكرة الإعلانية والرسالة البصرية العميقة غير المبتذلة.
2. المخرج الفني: يحدد التكوين، المنظور، الإضاءة، لوحة الألوان، والخامات.
3. محلل الصور: يفهم الصور المرجعية ويميز بصرامة بين الحقائق المرئية والاستنتاجات الإبداعية.
4. مهندس البرومبتات: يصيغ برومبتات إنجليزية إنتاجية خارقة وجاهزة للتوليد فوراً خالية من الحشو الزائف، مع ترجمتها وشرحها بالعربية.
5. المستشار الإبداعي: يقترح إعدادات المحرك ونسب الأبعاد وحلول التنفيذ.

قواعد صارمة وإلزامية:
1. يجب دوماً تضمين برومبت نهائي صريح وكامل وجاهز للنسخ في حقل "finalPrompt.englishPrompt". لا تكتفِ بوصف الفكرة أو تقديم نصائح عامة دون كتابة البرومبت الفعلي.
2. البرومبت باللغة الإنجليزية يجب أن يكون مستقلاً، مفصلاً، ومصمماً خصيصاً للمحرك المختار (Midjourney, Gemini, ChatGPT/DALL-E, Firefly, Whisk, Krea, Universal).
3. عند طلب "برومبت فقط" أو طلب مباشر وبسيط: اختصر الشروحات وركز على تسليم البرومبت فوراً دون إطالة.
4. اعرض الاستجابة دائماً بتنسيق JSON صحيح ونظيف.`;

// Fast High-Performance In-Memory Response Cache for Repeated / Similar Requests
interface CacheEntry {
  data: any;
  timestamp: number;
}
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
const MAX_CACHE_SIZE = 120;

function createCacheKey(prefix: string, body: any): string {
  const imgSig = body.image?.data ? body.image.data.slice(0, 64) + body.image.data.length : '';
  const framingSig = body.framingSettings ? `${body.framingSettings.aspectRatio}_${body.framingSettings.productPlacement}` : '';
  const lightingSig = body.lightingSettings ? `${body.lightingSettings.styleId}_${body.lightingSettings.recipeId}` : '';
  const brandSig = body.brandKit?.id || '';
  return `${prefix}:${body.mode || ''}:${body.targetTool || ''}:${body.action || ''}:${body.personaFocus || ''}:${brandSig}:${framingSig}:${lightingSig}:${body.prompt || ''}:${imgSig}`;
}

function getCachedResponse(key: string): any | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedResponse(key: string, data: any): void {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

apiRouter.post('/creative/process', async (req, res) => {
  try {
    const {
      mode = 'concept',
      prompt = '',
      image,
      targetTool = 'universal',
      action,
      personaFocus,
      language = 'ar',
      brandKit,
      framingSettings,
      lightingSettings,
    } = req.body;

    if (!prompt && !image) {
      return res.status(400).json({ error: 'الرجاء إدخال فكرة أو رفع صورة مرجعية.' });
    }

    // High-speed Cache Lookup: Instantaneous 0ms return for cached creative queries
    const cacheKey = createCacheKey('process', req.body);
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, fromCache: true });
    }

    const ai = getGenAI();

    // Check if user specifically asks for prompt only
    const lowerPrompt = (prompt || '').toLowerCase();
    const isPromptOnly =
      lowerPrompt.includes('برومبت فقط') ||
      lowerPrompt.includes('فقط برومبت') ||
      lowerPrompt.includes('prompt only') ||
      lowerPrompt.includes('just prompt') ||
      lowerPrompt.includes('only prompt') ||
      mode === 'scratch';

    // Prepare contents parts
    const parts: any[] = [];

    if (image && image.data) {
      const mimeType = image.mimeType || 'image/jpeg';
      const cleanData = image.data.includes(',')
        ? image.data.split(',')[1]
        : image.data;

      parts.push({
        inlineData: {
          mimeType,
          data: cleanData,
        },
      });
    }

    let userInstruction = `الوضع الإبداعي: ${mode}\n`;
    userInstruction += `أداة التوليد المستهدفة: ${targetTool}\n`;
    if (personaFocus) {
      userInstruction += `تركيز الشخصية: ${personaFocus}\n`;
    }
    if (action) {
      userInstruction += `إجراء التعديل المطلوب: ${action}\n`;
    }
    if (isPromptOnly) {
      userInstruction += `ملاحظة هامة جداً: المستخدم طلب «برومبت فقط»، لذلك ركّز على صياغة البرومبت النهائي مباشرة.\n`;
    }

    // Brand Vault Shield Integration
    if (brandKit) {
      userInstruction += `\n🛡️ [درع الهوية البصرية للعلامة التجارية - Brand Vault Shield مُفعّل ومُلزِم]:\n`;
      userInstruction += `- اسم العلامة التجارية: ${brandKit.name} (${brandKit.industry || 'عام'})\n`;
      if (brandKit.tagline) {
        userInstruction += `- شعار العلامة (Tagline): ${brandKit.tagline}\n`;
      }
      if (brandKit.colors && brandKit.colors.length > 0) {
        const colorsList = brandKit.colors.map((c: any) => `${c.name} (${c.hex})`).join('، ');
        userInstruction += `- الألوان الرسمية الإلزامية للعلامة: ${colorsList}\n`;
      }
      if (brandKit.productPackaging) {
        userInstruction += `- المواصفات الصارمة لشكل المنتج والعبوة (يجب الحفاظ عليها كاملة دون تشويه): ${brandKit.productPackaging}\n`;
      }
      if (brandKit.aestheticStyle) {
        userInstruction += `- الطابع والأسلوب الجمالي المعتمد: ${brandKit.aestheticStyle}\n`;
      }
      if (brandKit.negativeRules) {
        userInstruction += `- الكلمات والقواعد المحظورة والمستبعدة نهائياً (Strict Negative Rules): ${brandKit.negativeRules}\n`;
      }
      userInstruction += `تنبيه خاص بالدرع: ادمج ألوان البراند وشكل العبوة الإلزامية في صلب البرومبت النهائي وضع الكلمات المحظورة في negativePrompt.\n\n`;
    }

    // Dimensions & Framing Integration
    const targetAspect = framingSettings?.aspectRatio || '16:9';
    if (framingSettings) {
      const dimWidth = framingSettings.customWidth || framingSettings.width || 1024;
      const dimHeight = framingSettings.customHeight || framingSettings.height || 1024;
      const ratioStr = framingSettings.aspectRatio || `${dimWidth}:${dimHeight}`;

      let placementDesc = 'توسيط المنتج في قلب الكادر بدقة تجارية هندسية دون أي تشويه أو قص (Perfect centering without distortion or cropping)';
      if (framingSettings.productPlacement === 'lower_third') {
        placementDesc = 'وضع المنتج في الثلث السفلي للكادر مع مساحة علوية هادئة متوازنة (Lower-third placement)';
      } else if (framingSettings.productPlacement === 'floating') {
        placementDesc = 'عرض المنتج عائماً بانسيابية خفيفة مع ظلال ناعمة واقعية (Zero-gravity floating levitation)';
      } else if (framingSettings.productPlacement === 'dynamic_angle') {
        placementDesc = 'زاوية ديناميكية 45 درجة تبرز أبعاد وخامة المنتج (Dynamic 45-degree isometric angle)';
      }

      let scaleDesc = 'حجم قياسي متوازن يشغل حوالي 60% من الكادر (Standard 60% framing scale)';
      if (framingSettings.productScale === 'dominant') {
        scaleDesc = 'حجم بارز ومهيمن يشغل 75% من الكادر لإبراز تفاصيل العبوة (Dominant 75% hero scale)';
      } else if (framingSettings.productScale === 'minimal') {
        scaleDesc = 'حجم بسيط وهادئ يشغل 40% من الكادر مع فضاء سلبي واسع (Minimal 40% breathing scale)';
      }

      let marginDesc = 'هوامش فارغة متوازنة تقارب 28% لراحة العين والتهوية البصرية (Balanced ~28% negative space margin)';
      if (framingSettings.margin === 'tight') {
        marginDesc = 'هوامش ضيقة مركزة 15% (Tight 15% margins)';
      } else if (framingSettings.margin === 'spacious') {
        marginDesc = 'هوامش رحبة واسعة 40% (Spacious 40% negative margins)';
      }

      let bgDesc = 'استخراج ألوان خلفية متناسقة ومتناغمة من المنتج المرجعي ولوحة ألوانه الطبيعية (Harmonious background extracted from reference product)';
      if (framingSettings.backgroundStyle === 'neutral_studio') {
        bgDesc = 'خلفية استوديو رمادية/عاجية محايدة ناعمة (Neutral soft studio cyclorama)';
      } else if (framingSettings.backgroundStyle === 'gradient_vignette') {
        bgDesc = 'تدرج إضاءة ناعم مع فينيت لطيف (Soft gradient vignette lighting backdrop)';
      } else if (framingSettings.backgroundStyle === 'contextual') {
        bgDesc = 'بيئة سياقية حقيقية طبيعية متناسقة مع طبيعة واستخدام المنتج (Contextual environment)';
      } else if (framingSettings.backgroundStyle === 'minimalist_solid') {
        bgDesc = 'خلفية أحادية نظيفة مينيمالية صلبة بدون أي مشتتات (Minimalist solid clean backdrop)';
      }

      userInstruction += `\n📐 [قسم المقاسات والأبعاد والتأطير التجاري - Dimensions & Commercial Framing]:\n`;
      userInstruction += `- المقاس المطلوب ونسبة الأبعاد: ${ratioStr} (الأبعاد البكسلية: ${dimWidth}×${dimHeight})\n`;
      userInstruction += `- موضع المنتج: ${placementDesc}\n`;
      userInstruction += `- حجم المنتج: ${scaleDesc}\n`;
      userInstruction += `- الهوامش الفارغة: ${marginDesc}\n`;
      userInstruction += `- المنطقة الآمنة المركزية: ${framingSettings.safeZone ? 'مفعلة (منطقة آمنة مركزية بنسبة 50% تضمن عدم اقتطاع المنتج عند النشر على منصات التواصل الاجتماعي)' : 'تكوين حر'}\n`;
      userInstruction += `- لون ونمط الخلفية: ${bgDesc}\n`;
      userInstruction += `- جودة وحفظ الهوية: واقعية تجارية عالية الجودة (High-end commercial studio realism)، مع الحفاظ الصارم على ألوان وتفاصيل وهوية المنتج الأصلي وخاماته الحقيقية دون أي تشويه أو اختلاق عناصر دخيلة.\n`;
      userInstruction += `تنبيه إلزامي: احرص على تضمين عبارات المقاس والتوسيط والهوامش في صلب البرومبت الإنجليزي finalPrompt.englishPrompt، وضع النسبة "${ratioStr}" في حقل aspectRatio.\n\n`;
    }

    // Cinematic Lighting Studio Integration
    if (lightingSettings) {
      userInstruction += `\n💡 [استوديو الإضاءة السينمائية المتقدمة - Cinematic Lighting Studio]:\n`;
      userInstruction += `- النمط السينمائي المعتمد: ${lightingSettings.styleId || 'dramatic_cinematic'} (وصفة الإضاءة: ${lightingSettings.recipeId || 'commercial_studio'})\n`;
      userInstruction += `- مصدر الضوء الرئيسي (Key Light): اتجاه ${lightingSettings.keyLightDirection || 'side_45'}، زاوية ${lightingSettings.keyLightAngle ?? 45} درجة، ارتفاع ${lightingSettings.keyLightHeight || 'high_60'}، شدة ${lightingSettings.intensity ?? 80}%، نعومة ${lightingSettings.softness || 'medium_diffused'}، انتشار ${lightingSettings.beamSpread || 'medium_45'}\n`;
      userInstruction += `- حرارة اللون: ${lightingSettings.colorTemperatureK || 5500}K كلفن (${(lightingSettings.colorTemperatureK || 5500) < 3500 ? 'درجة دافئة عنبرية ذهبية' : (lightingSettings.colorTemperatureK || 5500) > 6000 ? 'درجة باردة زرقاء ناصعة' : 'ضوء نهاري نقي متوازن'})\n`;
      userInstruction += `- إضاءة الحواف والخلفية (Rim & Backlight): قوة ${lightingSettings.rimLightPower || 'medium'}\n`;
      userInstruction += `- الإضاءة الحجمية والضباب (Volumetric Haze): مستوى ${lightingSettings.volumetricHaze || 'none'}\n`;
      userInstruction += `- نسبة تباين الضوء إلى الظل (Lighting Ratio): ${lightingSettings.lightingRatio || '2:1'} مع عمق ظلال: ${lightingSettings.shadowDepth || 'feathered'}\n`;
      userInstruction += `- نمط الانعكاسات والتوهج: انعكاسات ${lightingSettings.reflections || 'specular_glossy'} وتوهج ضوئي ${lightingSettings.bloomGlow || 'subtle_lens'}\n`;
      userInstruction += `- لوحة الألوان السينمائية: ${lightingSettings.palette || 'teal_orange'}\n`;
      userInstruction += `- الحفاظ الصارم على المنتج: ${lightingSettings.preserveProductFidelity ? 'الحفاظ التام على هوية وخامة المنتج وشعاره وألوانه الحقيقية دون أي تشويه أو طمس' : 'تناغم الإضاءة مع المنتج'}\n`;
      userInstruction += `تنبيه إلزامي للمحرر: أدرج هذا الوصف التقني بدقة كقسم مستقل داخل finalPrompt.englishPrompt بعنوان: "Cinematic Lighting: ..."، ووضّح تفاصيل الإضاءة في breakdown.lighting وفي الشرح العربي.\n\n`;
    }

    userInstruction += `مدخلات المستخدم:\n${prompt || (image ? 'حلل هذه الصورة المرجعية وقدّم أفكاراً وبرومبتات لتطويرها.' : '')}\n`;

    userInstruction += `\nيجب عليك إرجاع كائن JSON دقيق بالهيكل التالي (تأكد من ملء finalPrompt.englishPrompt بنص البرومبت الفعلي بالإنجليزية):
{
  "title": "عنوان موجز ومميز للمشروع",
  "isPromptOnly": ${isPromptOnly ? 'true' : 'false'},
  "creativeIdea": "1. الفكرة الإبداعية: شرح فكرة ومفهوم العمل باختصار وذكاء إعلاني",
  "visualConception": "2. التصور البصري: وصف دقيق للمشهد المقترح وعناصره وتكوينه وإضاءته وخاماته",
  "finalPrompt": {
    "englishPrompt": "The complete, standalone, production-ready prompt in English tailored for ${targetTool} (ready to copy and paste directly into the image generator, with all aesthetic, lighting, lens, and compositional instructions)",
    "arabicPrompt": "الترجمة والتفسير الكامل للبرومبت باللغة العربية",
    "targetTool": "${targetTool}",
    "aspectRatio": "${targetAspect}",
    "parameters": "${targetTool === 'midjourney' ? `--ar ${targetAspect} --v 6.1 --style raw` : ''}",
    "negativePrompt": "blurry, distorted, oversaturated, amateur, text watermark",
    "breakdown": {
      "subject": "العنصر والموضوع الأساسي",
      "environment": "البيئة والمشهد المحيط",
      "lighting": "نوع الإضاءة واتجاهها والظلال",
      "composition": "التكوين وزاوية الكاميرا والمنظور",
      "materials": "الخامات والأنسجة والواقعية"
    }
  },
  "suggestedSettings": {
    "targetTool": "${targetTool}",
    "aspectRatio": "16:9",
    "parameters": "${targetTool === 'midjourney' ? '--ar 16:9 --v 6.1 --style raw' : 'High Quality'}",
    "negativePrompt": "blurry, low quality, distorted text, amateur photography",
    "notes": "نصائح وإعدادات مقترحة لأداة ${targetTool}"
  }${image ? `,
  "visualAnalysis": {
    "hasImage": true,
    "subject": "الموضوع والعناصر الظاهرة بدقة وتفصيل",
    "mood": "الحالة المزاجية والانطباع والأجواء البصرية",
    "concept": "الفكرة البصرية والرسالة الإعلانية أو الفنية",
    "composition": "التكوين وتوزيع الفراغ وقاعدة الأثلاث والمنظور",
    "perspective": "زاوية الكاميرا والمنظور والبعد البؤري التقديري",
    "lighting": "أسلوب الإضاءة ومصادر الضوء والظلال والانعكاسات",
    "colorPalette": [{"name": "اسم اللون", "hex": "#HEX"}],
    "textures": "الخامات والأنسجة ومستوى الواقعية",
    "environment": "البيئة والخلفية والمشهد المحيط",
    "style": "الأسلوب الفني أو التجاري (Cinematic, Editorial, Commercial...)",
    "strengths": "نقاط القوة البصرية القابلة للتطوير",
    "improvements": "عناصر التحسين وإعادة الابتكار",
    "observedVsInferred": "تمييز صريح وعميق: ما يظهر يقيناً في الصورة مقابل الاستنتاجات الإبداعية والسيميائية",
    "inferredElements": "استنتاج العناصر غير الواضحة بصرياً: مثل الإعدادات التقنية غير الظاهرة للإضاءة، سياق ما وراء الكواليس، النوايا السردية، الشريحة المستهدفة غير المباشرة",
    "newDesignApplications": [
      "فكرة تطبيق 1: كيفية توظيف هذه الإضاءة وألوانها في مشهد أو منتج جديد",
      "فكرة تطبيق 2: كيفية إعادة صياغة هذا التكوين لإنشاء تصميم إعلاني مختلف",
      "فكرة تطبيق 3: اقتراح حملة بصرية مبتكرة مستوحاة من روح هذه الصورة"
    ],
    "evolutionIdea": "تصور إبداعي متكامل لتطوير الصورة أو إنشاء مشهد جديد مذهل"
  }` : ''}${mode === 'concept' ? `,
  "concepts": [
    {
      "name": "اسم المفهوم 1",
      "adIdea": "الفكرة الإعلانية",
      "message": "الرسالة التي يوصلها",
      "visualScene": "التصور البصري",
      "whyUnique": "سر التميز عن الإعلانات التقليدية",
      "isRecommended": true
    },
    {
      "name": "اسم المفهوم 2",
      "adIdea": "الفكرة الإعلانية البديلة",
      "message": "الرسالة",
      "visualScene": "التصور البصري",
      "whyUnique": "سر التميز",
      "isRecommended": false
    },
    {
      "name": "اسم المفهوم 3",
      "adIdea": "الفكرة الإعلانية البديلة",
      "message": "الرسالة",
      "visualScene": "التصور البصري",
      "whyUnique": "سر التميز",
      "isRecommended": false
    }
  ]` : ''}${mode === 'story' ? `,
  "storyOpening": "فقرة افتتاحية روائية مشوقة مبنية على المشهد"` : ''}${mode === 'copywriting' ? `,
  "copywritingElements": {
    "headline": "عنوان إعلاني جذاب",
    "subhead": "عنوان فرعي",
    "tagline": "شعار تسويقي قصير",
    "socialCaption": "نص منشور ترويجي متناسق مع هاشتاغات"
  }` : ''},
  "suggestedActions": [
    "طوّر الفكرة بتفاصيل أكثر",
    "اجعل التكوين أكثر جرأة وسريالية",
    "أنشئ نسخة بتصوير واقعي بسيط"
  ]
}`;

    parts.push({ text: userInstruction });

    // Primary high-speed execution using gemini-3.1-flash-lite, with gemini-3.8-flash fallback
    let responseText = '';
    let usedModel = 'gemini-3.1-flash-lite';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn('gemini-3.1-flash-lite failed, falling back to gemini-3.8-flash with LOW thinking:', primaryErr.message);
      usedModel = 'gemini-3.8-flash';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          temperature: 0.8,
        },
      });
      responseText = fallbackResponse.text || '';
    }

    if (!responseText.trim()) {
      throw new Error('لم يرجع نموذج الذكاء الاصطناعي أي استجابة نصية.');
    }

    // Robust JSON parsing and fallback extraction
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      // Try stripping markdown blocks
      const cleanMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const toParse = cleanMatch ? cleanMatch[1].trim() : responseText.replace(/```json\n?|\n?```/g, '').trim();
      try {
        data = JSON.parse(toParse);
      } catch (secondErr) {
        console.warn('Direct JSON parse failed, constructing normalized object from text:', secondErr);
        data = {
          title: 'مشروع إبداعي',
          creativeIdea: responseText.slice(0, 300),
          visualConception: responseText.slice(300, 800),
          finalPrompt: {
            englishPrompt: responseText,
            arabicPrompt: '',
            targetTool,
            aspectRatio: '16:9',
          },
          rawResponse: responseText,
        };
      }
    }

    // CRITICAL FIX: Normalize and guarantee finalPrompt and its englishPrompt exist and are populated!
    if (!data.finalPrompt) {
      data.finalPrompt = {};
    }

    if (typeof data.finalPrompt === 'string') {
      data.finalPrompt = {
        englishPrompt: data.finalPrompt,
        arabicPrompt: data.arabicPrompt || '',
        targetTool,
        aspectRatio: data.aspectRatio || '16:9',
      };
    }

    // Check all potential field names where the model might have put the prompt
    let promptValue =
      data.finalPrompt.englishPrompt ||
      data.finalPrompt.prompt ||
      data.finalPrompt.text ||
      data.englishPrompt ||
      data.english_prompt ||
      data.prompt ||
      data.final_prompt ||
      data.imagePrompt ||
      data.image_prompt ||
      '';

    // If still empty, check inside concepts or visualConception
    if (!promptValue.trim()) {
      if (data.concepts && Array.isArray(data.concepts) && data.concepts[0]?.visualScene) {
        promptValue = data.concepts[0].visualScene;
      } else if (data.visualConception) {
        promptValue = data.visualConception;
      }
    }

    data.finalPrompt.englishPrompt = promptValue.trim();
    data.finalPrompt.targetTool = data.finalPrompt.targetTool || targetTool;
    data.finalPrompt.arabicPrompt = data.finalPrompt.arabicPrompt || data.arabicPrompt || '';
    data.finalPrompt.aspectRatio = framingSettings?.aspectRatio || data.finalPrompt.aspectRatio || data.aspectRatio || '16:9';

    const finalRatio = data.finalPrompt.aspectRatio;
    const defaultParams = targetTool === 'midjourney' ? `--ar ${finalRatio} --v 6.1 --style raw` : '';

    data.finalPrompt.parameters = data.finalPrompt.parameters || defaultParams;
    if (targetTool === 'midjourney' && !data.finalPrompt.parameters.includes('--ar')) {
      data.finalPrompt.parameters = `--ar ${finalRatio} ${data.finalPrompt.parameters}`.trim();
    }

    // Ensure suggestedSettings is populated
    if (!data.suggestedSettings) {
      data.suggestedSettings = {
        targetTool: data.finalPrompt.targetTool,
        aspectRatio: data.finalPrompt.aspectRatio,
        parameters: data.finalPrompt.parameters || defaultParams,
        negativePrompt: data.finalPrompt.negativePrompt || 'blurry, distorted, oversaturated',
        notes: `إعدادات موصى بها لمحرك ${targetTool}`,
      };
    } else {
      data.suggestedSettings.aspectRatio = finalRatio;
      if (targetTool === 'midjourney') {
        data.suggestedSettings.parameters = data.finalPrompt.parameters;
      }
    }

    if (framingSettings) {
      data.framingSettings = framingSettings;
    }

    // Ensure creativeIdea & visualConception exist
    if (!data.creativeIdea) {
      data.creativeIdea = data.summary || data.title || 'فكرة إعلانية مبتكرة من استوديو الإبداع.';
    }
    if (!data.visualConception) {
      data.visualConception = data.creativeIdea;
    }

    // Set summary for backward compatibility
    data.summary = data.summary || `${data.creativeIdea}\n\n${data.visualConception}`;
    data.usedModel = usedModel;

    if (brandKit) {
      data.brandKitApplied = {
        name: brandKit.name,
        colors: brandKit.colors || [],
      };
      if (brandKit.negativeRules && data.finalPrompt) {
        data.finalPrompt.negativePrompt = data.finalPrompt.negativePrompt
          ? `${brandKit.negativeRules}, ${data.finalPrompt.negativePrompt}`
          : brandKit.negativeRules;
      }
    }

    if (lightingSettings) {
      data.lightingSettings = lightingSettings;
    }

    setCachedResponse(cacheKey, data);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /creative/process:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'حدث خطأ أثناء معالجة الطلب الإبداعي في الخادم.',
    });
  }
});

// Quick Instant Ideas API: Generates 4 diverse ad ideas for the same product,
// strictly varying background, lighting, and composition while preserving product identity.
apiRouter.post('/creative/quick-ideas', async (req, res) => {
  try {
    const {
      prompt = '',
      image,
      brandKit,
      framingSettings,
      targetTool = 'midjourney',
    } = req.body;

    // High-speed Cache Lookup for Quick Ideas
    const cacheKey = createCacheKey('quick-ideas', req.body);
    const cachedIdeas = getCachedResponse(cacheKey);
    if (cachedIdeas) {
      return res.json({ success: true, quickIdeas: cachedIdeas, fromCache: true });
    }

    const productName = prompt.trim() || 'المنتج التجاري الفاخر';
    const targetAspect = framingSettings?.aspectRatio || '1:1';

    let parts: any[] = [];
    if (image?.data) {
      const mimeType = image.mimeType || 'image/jpeg';
      const cleanData = image.data.includes(',')
        ? image.data.split(',')[1]
        : image.data;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanData,
        },
      });
    }

    let instruction = `المهمة: ابتكر 4 أفكار إعلانية فورية متنوعة للمنتج نفسه (Quick Instant Ideas)، مع تغيير الخلفية والإضاءة والتكوين فقط.
اسم أو وصف المنتج المرجعي: ${productName}
أداة التوليد المستهدفة: ${targetTool}
نسبة الأبعاد: ${targetAspect}

القواعد الإلزامية الصارمة:
1. حافظ على هوية المنتج المرجعي وتفاصيله وشكله والعبوة والملصق والشعار دون أي تغيير أو تشويه أو إعادة تصميم.
2. اجعل كل فكرة مختلفة بصرياً تماماً عن الأخرى:
   - فكرة 1 (studio): استوديو فاخر مينيمالي (Luxury Minimalist Studio)
   - فكرة 2 (nature): طبيعي عضوي بضوء شمس العصر الدافئ وظلال أوراق الشجر (Sunlit Organic Nature)
   - فكرة 3 (dramatic): سينمائي درامي مع تباين جريء وإضاءة حافة نيون ملونة (Cinematic Dramatic Contrast)
   - فكرة 4 (architectural): داخلي معماري عصري وناعم مع ضوء نهاري منتشر (Modern Architectural Interior)
3. التزم بألوان العلامة التجارية النشطة وقواعد Brand Vault إذا كانت مزودة.
4. امنع العناصر الزائدة والكتابات العشوائية أو إعادة تصميم المنتج وضع ذلك صراحة في negativePrompt.
5. اجعل وصف كل فكرة مختصراً ودقيقاً.
6. اكتب البرومبت الإنجليزي النهائي الكامل لكل فكرة ليكون جاهزاً للنسخ والتوليد فوراً بمحرك ${targetTool}.`;

    if (brandKit) {
      instruction += `\n\n🛡️ [درع الهوية البصرية للعلامة التجارية - Brand Vault Shield]:
- اسم العلامة: ${brandKit.name}
- الألوان الرسمية: ${brandKit.colors?.map((c: any) => `${c.name} (${c.hex})`).join(', ') || ''}
${brandKit.negativeRules ? `- القواعد المحظورة: ${brandKit.negativeRules}` : ''}
الدمج: ادمج ألوان البراند الرسمية في درجات الخلفية والإضاءة الحيوية لكل فكرة.`;
    }

    instruction += `\n\nأرجع النتيجة بصيغة JSON حصراً بهذا الهيكل:
{
  "quickIdeas": [
    {
      "id": "quick-1-studio",
      "title": "استوديو فاخر مينيمالي مع منصة هندسية",
      "category": "studio",
      "categoryLabel": "استوديو فاخر",
      "shortDescription": "وصف موجز للمشهد الإعلاني",
      "backgroundDescription": "تفاصيل الخلفية",
      "lightingDescription": "تفاصيل الإضاءة والظلال",
      "compositionDescription": "تفاصيل التكوين والتأطير",
      "productPreservation": "تأكيد الحفاظ على تفاصيل المنتج والعبوة والشعار",
      "finalPrompt": "High-end commercial product photography of authentic product...",
      "arabicPrompt": "البرومبت بالعربية...",
      "aspectRatio": "${targetAspect}",
      "parameters": "${targetTool === 'midjourney' ? `--ar ${targetAspect} --v 6.1 --style raw` : 'Commercial preset'}",
      "negativePrompt": "blurry, distorted packaging, morphed shape, random text, watermark"
    }
  ]
}`;

    parts.push({ text: instruction });

    let quickIdeas = null;
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      if (responseText.trim()) {
        const parsed = JSON.parse(responseText.trim().replace(/^```json\s*/, '').replace(/```$/, ''));
        if (parsed.quickIdeas && Array.isArray(parsed.quickIdeas) && parsed.quickIdeas.length > 0) {
          quickIdeas = parsed.quickIdeas;
        }
      }
    } catch (geminiErr: any) {
      console.warn('Gemini quick-ideas generation failed, using intelligent fallback:', geminiErr.message);
    }

    // Fallback generator ensuring 4 high-quality diverse ideas if Gemini was unavailable or partial
    if (!quickIdeas || quickIdeas.length === 0) {
      const brandColors = brandKit?.colors && brandKit.colors.length > 0
        ? brandKit.colors.map((c: any) => `${c.name} (${c.hex})`).join(', ')
        : '';
      const brandColorHex = brandKit?.colors?.[0]?.hex || '#4C53DB';
      const brandColorSecondHex = brandKit?.colors?.[1]?.hex || '#F8FAFC';
      const toolParams = targetTool === 'midjourney'
        ? `--ar ${targetAspect} --v 6.1 --style raw`
        : targetTool === 'flux'
        ? `--aspect ${targetAspect} --quality 2`
        : 'Commercial Photography Preset';
      const baseNegative = `blurry, distorted packaging, morphed product shape, altered logo, fake text, random typography, low resolution, amateur photography, cropped product, clutter${brandKit?.negativeRules ? `, ${brandKit.negativeRules}` : ''}`;

      quickIdeas = [
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
          finalPrompt: `High-end commercial product photography of ${productName}, perfectly centered on a clean minimalist geometric stone pedestal. Subtle gradient studio backdrop in elegant tones ${brandKit ? `incorporating brand accents ${brandColorHex}` : 'neutral slate'}. Professional softbox studio lighting, crisp edge rim light, perfectly balanced reflections. 28% breathing margin, central safe zone. Exact authentic product packaging preserved with zero distortion, crisp commercial realism, Hasselblad 80mm lens, sharp focus. ${toolParams}`,
          arabicPrompt: `تصوير منتجات تجاري فائق الجودة لـ (${productName}) متموضع في المركز فوق منصة حجرية مينيمالية، إضاءة استوديو ناعمة وإضاءة حافة تبرز الأبعاد، خلفية هادئة تعكس ألوان العلامة، مع الحفاظ التام على أصل العبوة.`,
          aspectRatio: targetAspect,
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
          finalPrompt: `Organic lifestyle product photography featuring authentic ${productName} resting on a natural warm textured stone surface. Soft warm golden-hour afternoon sunlight filtering through botanical foliage creating elegant dappled shadows. Fresh organic atmosphere, shallow depth of field, gentle bokeh in background ${brandKit ? `with subtle ambient undertones matching ${brandColorHex}` : ''}. Exact reference product geometry and label intact, ultra-clean realistic texture, cinematic soft shadows. ${toolParams}`,
          arabicPrompt: `صورة فوتوغرافية حيوية لـ (${productName}) على سطح طبيعي دافئ، تتخلله إضاءة شمس العصر مع ظلال أوراق الشجر الناعمة، طابع طبيعي وأصيل دون أي مساس بتفاصيل المنتج الأصلية.`,
          aspectRatio: targetAspect,
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
          finalPrompt: `Dramatic cinematic advertising shot of authentic ${productName}, suspended in subtle elegant levitation against a dark moody charcoal textured backdrop. High-contrast chiaroscuro lighting with vivid dual rim lights glowing in ${brandKit ? `${brandColorHex} and ${brandColorSecondHex}` : 'subtle indigo and cyan accents'}. Crisp reflections, bold visual impact, commercial billboard aesthetics. Original product details, labels and materials perfectly preserved without alteration, razor-sharp textures, 85mm lens. ${toolParams}`,
          arabicPrompt: `لقطة سينمائية جريئة ذات تباين عالٍ لـ (${productName}) على خلفية فحمية داكنة مع إضاءة حافة مزدوجة متوهجة بألوان الهوية، تأثير إعلاني قوي يبرز المنتج دون تغيير شكله.`,
          aspectRatio: targetAspect,
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
          finalPrompt: `Editorial architectural interior product photography of ${productName} positioned on a smooth contemporary terrazzo tabletop. Soft diffused daylight streaming through modern floor-to-ceiling windows. Sophisticated Scandinavian interior aesthetic, clean architectural arches, subtle pastel and warm grey atmosphere ${brandKit ? `harmonized with ${brandColorHex}` : ''}. Generous clean negative space for commercial copy, authentic product packaging with pristine fidelity, Vogue editorial style. ${toolParams}`,
          arabicPrompt: `تصوير منتجات تحريري عصري لـ (${productName}) في مساحة داخلية معمارية راقية، ضوء نهاري منتشر وناعم، تكوين هادئ يعطي إحساساً بالفخامة اليومية مع حماية تفاصيل المنتج 100%.`,
          aspectRatio: targetAspect,
          parameters: toolParams,
          negativePrompt: baseNegative,
        },
      ];
    }

    setCachedResponse(cacheKey, quickIdeas);
    res.json({ success: true, quickIdeas });
  } catch (err: any) {
    console.error('Error in /creative/quick-ideas:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'تعذر توليد الأفكار السريعة للمنتج.',
    });
  }
});

// Professional Guided Prompt Crafting API: Generates tailored multi-engine prompt formulations
apiRouter.post('/creative/craft-prompt', async (req, res) => {
  try {
    const {
      subject = '',
      environment = '',
      composition = '',
      aspectRatio = '16:9',
      lighting = '',
      colorMood = '',
      artisticStyle = '',
      realismLevel = '',
      cameraLens = '',
      negativeElements = '',
    } = req.body;

    if (!subject.trim()) {
      return res.status(400).json({ error: 'الرجاء تحديد الموضوع الرئيسي للبرومبت.' });
    }

    const ai = getGenAI();

    const promptCraftInstruction = `أنت مهندس برومبتات استثنائي وخبير في أدوات توليد الصور (Prompt Engineer & AI Vision Expert).
المطلوب: صياغة برومبتات احترافية مفصلة وعالية الجودة بناءً على المعايير المحددة التالية:
- الموضوع الرئيسي: ${subject}
- البيئة والمشهد: ${environment || 'بيئة استوديو إعلانية متناسقة'}
- التكوين وزاوية الكاميرا ونسبة الأبعاد: ${composition || 'توسيط تجاري احترافي'} (النسبة: ${aspectRatio})
- أسلوب الإضاءة ولوحة الألوان: ${lighting || 'إضاءة استوديو ناعمة ومتوازنة'} ${colorMood ? `(الألوان: ${colorMood})` : ''}
- الأسلوب الفني: ${artisticStyle || 'Commercial advertising photography'}
- مستوى الواقعية والخامات: ${realismLevel || 'Ultra-realistic 8k, tactile authentic textures'}
- نوع العدسة والكاميرا: ${cameraLens || '85mm f/1.4 lens'}
- الكلمات المستبعدة: ${negativeElements || 'blurry, malformed, low quality, artifacts'}

يجب عليك إرجاع كائن JSON دقيق يحتوي على صياغات متخصصة ومصممة بدقة لكل محرك:
{
  "arabicSummary": "شرح موجز للفكرة البصرية والتركيبة",
  "aspectRatio": "${aspectRatio}",
  "midjourney": {
    "prompt": "The complete high-end prompt in English specifically formatted for Midjourney v6.1 using artistic and photographic keywords, weights, and commas",
    "params": "--ar ${aspectRatio} --v 6.1 --style raw --c 5",
    "full": "The prompt followed by the params at the end"
  },
  "dalle": {
    "prompt": "Rich, flowing descriptive narrative in English for DALL-E 3 (ChatGPT Image) describing exact layout, lighting balance, textural details and atmospheric perspective without tech flags",
    "full": "Complete standalone narrative prompt"
  },
  "stableDiffusion": {
    "positivePrompt": "Masterpiece, 8k uhd, photorealistic, intricate textures, raytracing, followed by detailed subject and lighting tokens",
    "negativePrompt": "blurry, out of focus, malformed limbs, cartoon, extra digits, low resolution, watermark, bad anatomy, deformed, oversaturated",
    "full": "Complete positive prompt"
  },
  "gemini": {
    "prompt": "Clean photographic realism prompt in English tailored for Google Gemini / Nano Banana",
    "full": "Full prompt ready to use"
  },
  "firefly": {
    "prompt": "Commercial product studio photography prompt for Adobe Firefly focusing on camera depth of field, aperture, and clean composition",
    "full": "Full prompt ready to use"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: promptCraftInstruction,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      data = JSON.parse(match ? match[1] : text);
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in /creative/craft-prompt:', err);
    res.status(500).json({ success: false, error: err.message || 'تعذر توليد البرومبتات المتخصصة.' });
  }
});

// Text-to-Speech API using gemini-3.8-flash-lite-tts
apiRouter.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'النص المطلوب قراءته غير موجود.' });
    }

    const cleanText = text.slice(0, 1500).trim();
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, engaging, professional artistic narrator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('لم يتم استلام بيانات صوتية من محرك النطق.');
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('Error in /tts:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'تعذر توليد القراءة الصوتية عبر الذكاء الاصطناعي.',
    });
  }
});

// Creative Studio Info / FAQ knowledge endpoint
apiRouter.get('/studio-info', (req, res) => {
  res.json({
    name: 'Creative Studio AI | استوديو الإبداع',
    tagline: 'شريكك الإبداعي لابتكار الأفكار البصرية وصناعة البرومبتات الاحترافية',
    personas: [
      { id: 'director', name: 'المدير الإبداعي', description: 'يبتكر الفكرة الإعلانية، المفهوم والرسالة البصرية.' },
      { id: 'art_director', name: 'المخرج الفني', description: 'يحدد التكوين، والألوان، والإضاءة، والمنظور، والخامات.' },
      { id: 'analyst', name: 'محلل الصور', description: 'يفهم الصور المرجعية ويستخرج عناصرها وأسلوبها ويميز الحقائق عن الاستنتاجات.' },
      { id: 'prompt_engineer', name: 'مهندس البرومبتات', description: 'يحوّل الفكرة إلى تعليمات دقيقة مصممة خصيصاً لأداة التوليد.' },
      { id: 'consultant', name: 'المستشار الإبداعي', description: 'يقترح بدائل غير تقليدية ويطور النتائج باستمرار.' },
    ],
    supportedTools: [
      { id: 'universal', name: 'برومبت عام متعدد الاستخدامات', description: 'متوازن ومتوافق مع جميع محركات التوليد' },
      { id: 'midjourney', name: 'Midjourney v6.1', description: 'مع بارامترات الإخراج والنسبة والأسلوب (--ar, --v, --style raw)' },
      { id: 'gemini', name: 'Google Gemini / Nano Banana', description: 'تركيز على الدقة الواقعية وتفاصيل الإضاءة والبيئة الطبيعية' },
      { id: 'chatgpt', name: 'ChatGPT Image (DALL-E 3)', description: 'وصف سردي وسياقي دقيق للعناصر والتكوين' },
      { id: 'firefly', name: 'Adobe Firefly', description: 'مصطلحات التصوير التجاري والعدسات والعمق اللوني' },
      { id: 'whisk', name: 'Whisk (Google Labs)', description: 'تكامل صور المراجع للموضوع والأسلوب والخلفية' },
      { id: 'krea', name: 'Krea AI', description: 'تحسين التفاصيل والدقة والتكوين الحي' },
    ],
  });
});
