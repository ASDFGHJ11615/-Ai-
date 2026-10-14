import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  PieChart as PieIcon,
  BarChart3,
  Cpu,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { CreativeResult, TargetTool } from '../types.ts';

interface ToolDistributionCardProps {
  history: CreativeResult[];
  onSelectTool?: (tool: TargetTool) => void;
}

const TOOL_CONFIG: Record<
  string,
  { name: string; englishName: string; color: string; shortTag: string }
> = {
  midjourney: {
    name: 'Midjourney v6.1',
    englishName: 'Midjourney',
    color: '#4C53DB',
    shortTag: 'الأسلوب السينمائي والفني',
  },
  firefly: {
    name: 'Adobe Firefly',
    englishName: 'Adobe Firefly',
    color: '#EF4444',
    shortTag: 'التصوير التجاري والمنتجات',
  },
  gemini: {
    name: 'Google Gemini',
    englishName: 'Google Gemini',
    color: '#2563EB',
    shortTag: 'الدقة الواقعية والبيئات',
  },
  chatgpt: {
    name: 'ChatGPT Image',
    englishName: 'DALL-E 3',
    color: '#10B981',
    shortTag: 'السرد الوصفي والتكوين',
  },
  krea: {
    name: 'Krea AI',
    englishName: 'Krea AI',
    color: '#8B5CF6',
    shortTag: 'التحسين الفوري والتفاصيل',
  },
  whisk: {
    name: 'Whisk (Google Labs)',
    englishName: 'Whisk',
    color: '#F59E0B',
    shortTag: 'فصل الموضوع والأسلوب',
  },
  universal: {
    name: 'برومبت عام (Universal)',
    englishName: 'Universal',
    color: '#64748B',
    shortTag: 'متعدد الاستخدامات',
  },
};

// Benchmark demo data if localStorage is completely fresh
const DEMO_BENCHMARK = [
  { tool: 'midjourney', count: 5 },
  { tool: 'firefly', count: 4 },
  { tool: 'gemini', count: 3 },
  { tool: 'chatgpt', count: 2 },
  { tool: 'universal', count: 1 },
];

export const ToolDistributionCard: React.FC<ToolDistributionCardProps> = ({
  history,
  onSelectTool,
}) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [showDemoIfEmpty, setShowDemoIfEmpty] = useState(false);

  const hasRealData = history.length > 0;

  // Process data from localStorage history
  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {};

    if (hasRealData) {
      history.forEach((item) => {
        const toolKey = item.targetTool || item.finalPrompt?.targetTool || 'universal';
        counts[toolKey] = (counts[toolKey] || 0) + 1;
      });
    } else if (showDemoIfEmpty) {
      DEMO_BENCHMARK.forEach((d) => {
        counts[d.tool] = d.count;
      });
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts)
      .map(([toolKey, count]) => {
        const config = TOOL_CONFIG[toolKey] || {
          name: toolKey,
          englishName: toolKey,
          color: '#94A3B8',
          shortTag: '',
        };
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return {
          id: toolKey as TargetTool,
          name: config.name,
          englishName: config.englishName,
          count,
          percentage,
          color: config.color,
          shortTag: config.shortTag,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [history, hasRealData, showDemoIfEmpty]);

  // Head-to-head comparison: Midjourney vs Adobe Firefly
  const midjourneyCount = distributionData.find((d) => d.id === 'midjourney')?.count || 0;
  const fireflyCount = distributionData.find((d) => d.id === 'firefly')?.count || 0;
  const totalProjects = hasRealData
    ? history.length
    : showDemoIfEmpty
    ? DEMO_BENCHMARK.reduce((a, b) => a + b.count, 0)
    : 0;

  const topTool = distributionData[0];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700 text-right text-xs">
          <div className="font-extrabold text-sm mb-0.5" style={{ color: data.color }}>
            {data.name}
          </div>
          <div className="text-slate-300">
            عدد المشاريع: <span className="font-bold text-white">{data.count}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            النسبة من الإجمالي: <span className="font-bold text-white">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#111827]">
                توزيع استخدام أدوات التوليد
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-[#4C53DB]">
                Recharts Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تحليل إحصائي فوري مستخرج من سجل المشاريع في المتصفح (localStorage)
            </p>
          </div>
        </div>

        {/* Chart View Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartType('donut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                chartType === 'donut'
                  ? 'bg-white text-[#4C53DB] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>مخطط دائري</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                chartType === 'bar'
                  ? 'bg-white text-[#4C53DB] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>مخطط أعمدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Head-to-Head Highlight: Midjourney vs Adobe Firefly */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#4C53DB]/10 to-indigo-50/50 border border-[#4C53DB]/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-[#4C53DB]">
              Midjourney v6.1
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4C53DB]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {midjourneyCount}{' '}
            <span className="text-xs font-medium text-slate-500">مشروع</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            المفضل للقطات السينمائية والإضاءة الفنية
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-50/50 border border-rose-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold text-rose-600">
              Adobe Firefly
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {fireflyCount}{' '}
            <span className="text-xs font-medium text-slate-500">مشروع</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 font-medium">
            المفضل للتصوير التجاري وتطبيقات المنتجات
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-600">
              الأداة الأكثر استخداماً
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 truncate">
            {topTool ? topTool.name : 'بانتظار المشاريع'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            إجمالي المشاريع في السجل: {totalProjects}
          </p>
        </div>
      </div>

      {/* Main Chart and Distribution Breakdown */}
      {distributionData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Recharts Visualization Container */}
          <div className="lg:col-span-7 h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'donut' ? (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={distributionData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <BarChart
                  data={distributionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                >
                  <XAxis
                    dataKey="englishName"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Breakdown List */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              تفاصيل الحصة النسبية لكل أداة:
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {distributionData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTool && onSelectTool(item.id)}
                  className="p-2.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 transition flex items-center justify-between text-right cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-extrabold text-slate-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.shortTag}
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0 mr-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {item.count}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mr-1">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State with option to preview demo benchmark */
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4C53DB] flex items-center justify-center mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">
              لم يتم تسجيل مشاريع بعد في هذا المتصفح
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              عند توليد أي فكرة أو برومبت وتغيير المحرك بين Midjourney و Adobe Firefly و Gemini،
              سيتم تحديث هذا الرسم البياني تلقائياً برؤى إحصائية حية.
            </p>
          </div>
          <button
            onClick={() => setShowDemoIfEmpty(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#4C53DB] shadow-2xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>عرض معاينة نموذجية للمخطط البياني (Demo)</span>
          </button>
        </div>
      )}

      {/* Footer Info Notice */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#4C53DB]" />
          <span>
            تُحفظ الإحصائيات بأمان داخل جهازك في المتصفح عبر المفتاح {`creative_studio_history_v1`}.
          </span>
        </div>
        {showDemoIfEmpty && !hasRealData && (
          <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
            أنت تشاهد حالياً بيانات نموذجية استرشادية
          </span>
        )}
      </div>
    </div>
  );
};
