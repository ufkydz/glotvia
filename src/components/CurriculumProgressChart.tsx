import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { UserProfile } from '../types';
import { 
  TrendingUp, 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Sparkles, 
  Target, 
  Layers, 
  Compass, 
  Clock,
  BookOpen
} from 'lucide-react';

interface CurriculumProgressChartProps {
  currentUser: UserProfile;
}

// Curriculum module definitions spanning A1 to B1
export interface CurriculumModuleStat {
  code: string;
  name: string;
  level: 'A1' | 'A2' | 'B1';
  totalTopics: number;
  completedTopics: number;
  masteredWords: number;
  totalWords: number;
  accuracy: number;
  status: 'completed' | 'in_progress' | 'locked';
}

// Generate realistic progress timeline data based on user's current XP, streak, and mastered words
const generateTimeProgressData = (user: UserProfile, timeRange: '7d' | '30d' | '90d' | 'all') => {
  const baseWords = user.stats.learnedCardIds?.length || 18;
  const baseXP = user.stats.xp || 420;
  
  if (timeRange === '7d') {
    return [
      { date: 'Pzt', xp: Math.max(0, Math.round(baseXP * 0.72)), words: Math.max(2, Math.round(baseWords * 0.70)), studyMins: 25, a1Progress: 65, a2Progress: 15, b1Progress: 0 },
      { date: 'Sal', xp: Math.max(0, Math.round(baseXP * 0.78)), words: Math.max(3, Math.round(baseWords * 0.75)), studyMins: 35, a1Progress: 70, a2Progress: 20, b1Progress: 0 },
      { date: 'Çar', xp: Math.max(0, Math.round(baseXP * 0.83)), words: Math.max(4, Math.round(baseWords * 0.80)), studyMins: 20, a1Progress: 75, a2Progress: 22, b1Progress: 2 },
      { date: 'Per', xp: Math.max(0, Math.round(baseXP * 0.88)), words: Math.max(5, Math.round(baseWords * 0.86)), studyMins: 45, a1Progress: 82, a2Progress: 28, b1Progress: 5 },
      { date: 'Cum', xp: Math.max(0, Math.round(baseXP * 0.92)), words: Math.max(6, Math.round(baseWords * 0.90)), studyMins: 30, a1Progress: 88, a2Progress: 32, b1Progress: 8 },
      { date: 'Cmt', xp: Math.max(0, Math.round(baseXP * 0.97)), words: Math.max(7, Math.round(baseWords * 0.96)), studyMins: 60, a1Progress: 94, a2Progress: 38, b1Progress: 12 },
      { date: 'Paz (Bugün)', xp: baseXP, words: baseWords, studyMins: 50, a1Progress: 98, a2Progress: 44, b1Progress: 15 },
    ];
  }

  if (timeRange === '30d') {
    return [
      { date: 'Hafta 1', xp: Math.round(baseXP * 0.25), words: Math.round(baseWords * 0.20), studyMins: 140, a1Progress: 30, a2Progress: 0, b1Progress: 0 },
      { date: 'Hafta 2', xp: Math.round(baseXP * 0.50), words: Math.round(baseWords * 0.45), studyMins: 180, a1Progress: 60, a2Progress: 10, b1Progress: 0 },
      { date: 'Hafta 3', xp: Math.round(baseXP * 0.78), words: Math.round(baseWords * 0.72), studyMins: 210, a1Progress: 85, a2Progress: 25, b1Progress: 5 },
      { date: 'Hafta 4', xp: baseXP, words: baseWords, studyMins: 260, a1Progress: 98, a2Progress: 44, b1Progress: 15 },
    ];
  }

  if (timeRange === '90d') {
    return [
      { date: '1. Ay (Başlangıç)', xp: Math.round(baseXP * 0.2), words: Math.round(baseWords * 0.15), studyMins: 450, a1Progress: 40, a2Progress: 0, b1Progress: 0 },
      { date: '2. Ay (İlerleme)', xp: Math.round(baseXP * 0.6), words: Math.round(baseWords * 0.55), studyMins: 620, a1Progress: 80, a2Progress: 20, b1Progress: 0 },
      { date: '3. Ay (Şimdi)', xp: baseXP, words: baseWords, studyMins: 780, a1Progress: 98, a2Progress: 44, b1Progress: 15 },
    ];
  }

  // All time
  return [
    { date: 'Eylül', xp: 50, words: 10, studyMins: 90, a1Progress: 20, a2Progress: 0, b1Progress: 0 },
    { date: 'Ekim', xp: 180, words: 35, studyMins: 240, a1Progress: 50, a2Progress: 5, b1Progress: 0 },
    { date: 'Kasım', xp: 340, words: 70, studyMins: 380, a1Progress: 75, a2Progress: 20, b1Progress: 0 },
    { date: 'Aralık', xp: 580, words: 120, studyMins: 510, a1Progress: 90, a2Progress: 35, b1Progress: 5 },
    { date: 'Ocak', xp: 820, words: 175, studyMins: 650, a1Progress: 98, a2Progress: 55, b1Progress: 15 },
    { date: 'Şubat', xp: Math.max(1050, baseXP), words: Math.max(220, baseWords), studyMins: 720, a1Progress: 100, a2Progress: 68, b1Progress: 28 },
  ];
};

export const CurriculumProgressChart: React.FC<CurriculumProgressChartProps> = ({ currentUser }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('7d');
  const [activeTab, setActiveTab] = useState<'timeline' | 'modules' | 'skills'>('timeline');

  const timeData = generateTimeProgressData(currentUser, timeRange);

  // A1, A2, B1 Modules data
  const moduleStats: CurriculumModuleStat[] = [
    {
      code: 'A1.1',
      name: 'Temel Giriş & Alfabe & Tanışma',
      level: 'A1',
      totalTopics: 7,
      completedTopics: 7,
      masteredWords: 120,
      totalWords: 120,
      accuracy: 94,
      status: 'completed'
    },
    {
      code: 'A1.2',
      name: 'Günlük Hayat, Alışveriş & Sayılar',
      level: 'A1',
      totalTopics: 8,
      completedTopics: 7,
      masteredWords: 140,
      totalWords: 150,
      accuracy: 89,
      status: 'in_progress'
    },
    {
      code: 'A2.1',
      name: 'Geçmiş Zaman (Perfekt), Yol & Ulaşım',
      level: 'A2',
      totalTopics: 8,
      completedTopics: 4,
      masteredWords: 85,
      totalWords: 160,
      accuracy: 82,
      status: 'in_progress'
    },
    {
      code: 'A2.2',
      name: 'İş & Meslekler, Sağlık & Rica Cümleleri',
      level: 'A2',
      totalTopics: 8,
      completedTopics: 2,
      masteredWords: 40,
      totalWords: 170,
      accuracy: 78,
      status: 'in_progress'
    },
    {
      code: 'B1.1',
      name: 'Görüş Belirtme, Bağlaçlar & Tartışma',
      level: 'B1',
      totalTopics: 10,
      completedTopics: 1,
      masteredWords: 25,
      totalWords: 200,
      accuracy: 72,
      status: 'in_progress'
    },
    {
      code: 'B1.2',
      name: 'Goethe B1 Sınav Hazırlığı & Mektup',
      level: 'B1',
      totalTopics: 10,
      completedTopics: 0,
      masteredWords: 5,
      totalWords: 220,
      accuracy: 65,
      status: 'locked'
    }
  ];

  // Radar chart: German language skills distribution
  const skillsData = [
    { skill: 'Wortschatz (Kelime)', value: 88, fullMark: 100 },
    { skill: 'Grammatik (Dilbilgisi)', value: 76, fullMark: 100 },
    { skill: 'Hören (Dinleme)', value: 82, fullMark: 100 },
    { skill: 'Sprechen (Konuşma)', value: 70, fullMark: 100 },
    { skill: 'Lesen (Okuma)', value: 92, fullMark: 100 },
    { skill: 'Schreiben (Yazma)', value: 74, fullMark: 100 },
  ];

  // Bar chart comparing levels
  const levelComparisonData = [
    { level: 'A1 Başlangıç', tamamlanan: 96, hedeflenen: 100, kelimeSayisi: 260 },
    { level: 'A2 Orta Öncesi', tamamlanan: 48, hedeflenen: 100, kelimeSayisi: 125 },
    { level: 'B1 Bağımsız', tamamlanan: 18, hedeflenen: 100, kelimeSayisi: 30 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] font-black text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recharts Müfredat İlerleme Grafiği</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>A1 - B1 Müfredat & Zaman İçinde İlerleme Analizi</span>
          </h3>
          <p className="text-xs text-slate-400">
            A1, A2 ve B1 seviyelerinde kazandığınız XP, kelime hakimiyeti ve çalışma sürelerinizi interaktif grafiklerle izleyin.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Zaman Akışı</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'modules'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modüller (A1-B1)</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Beceri Radarı</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TIMELINE PROGRESS OVER TIME (AREA & LINE CHART) */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Time range selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === '7d' ? 'bg-slate-800 text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Son 7 Gün
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === '30d' ? 'bg-slate-800 text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Son 30 Gün
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === '90d' ? 'bg-slate-800 text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Son 3 Ay
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === 'all' ? 'bg-slate-800 text-amber-300 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tüm Süreç
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-slate-300 font-medium">A1 Seviyesi (%98)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300 font-medium">A2 Seviyesi (%44)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-300 font-medium">B1 Seviyesi (%15)</span>
              </div>
            </div>
          </div>

          {/* Area Chart: Cumulative A1-B1 Progression */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Müfredat Seviye İlerlemesi (%)</span>
              <span className="text-[11px] text-slate-500 font-mono">Zaman Çizelgesi</span>
            </div>
            
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorA1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorA2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorB1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === 'a1Progress') return [`%${val}`, 'A1 Müfredatı'];
                      if (name === 'a2Progress') return [`%${val}`, 'A2 Müfredatı'];
                      if (name === 'b1Progress') return [`%${val}`, 'B1 Müfredatı'];
                      return [val, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="a1Progress"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorA1)"
                    name="a1Progress"
                  />
                  <Area
                    type="monotone"
                    dataKey="a2Progress"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorA2)"
                    name="a2Progress"
                  />
                  <Area
                    type="monotone"
                    dataKey="b1Progress"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorB1)"
                    name="b1Progress"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: XP & Study Minutes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Kazanılan Toplam XP</span>
                <span className="text-amber-400 text-xs font-bold font-mono">{currentUser.stats.xp} XP</span>
              </div>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                      formatter={(val: any) => [`${val} XP`, 'Deneyim']}
                    />
                    <Line
                      type="monotone"
                      dataKey="xp"
                      stroke="#fbbf24"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#fbbf24' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Öğrenilen Kelime Sayısı</span>
                <span className="text-emerald-400 text-xs font-bold font-mono">
                  {currentUser.stats.learnedCardIds?.length || 18} Kelime
                </span>
              </div>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                      formatter={(val: any) => [`${val} Kelime`, 'Aktif Hafıza']}
                    />
                    <Bar
                      dataKey="words"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: A1-B1 MODULES BREAKDOWN (BAR CHARTS & CARDS) */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Level Comparison Bar Chart */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>CEFR Seviyelerine Göre Müfredat Tamamlanma Oranları</span>
              <span className="text-[11px] text-amber-400 font-bold">Goethe A1 / A2 / B1 Standartları</span>
            </div>

            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelComparisonData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="level" stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === 'tamamlanan') return [`%${val}`, 'Tamamlanma'];
                      return [val, name];
                    }}
                  />
                  <Bar
                    dataKey="tamamlanan"
                    fill="#f59e0b"
                    radius={[0, 8, 8, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleStats.map((mod) => (
              <div
                key={mod.code}
                className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      mod.level === 'A1'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : mod.level === 'A2'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {mod.code} Modülü
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{mod.name}</h4>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    mod.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : mod.status === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {mod.status === 'completed' ? '✓ Tamamlandı' : mod.status === 'in_progress' ? 'Devam Ediyor' : 'Kilitli'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tamamlanan Konu: {mod.completedTopics} / {mod.totalTopics}</span>
                    <span className="font-bold text-white">{Math.round((mod.completedTopics / mod.totalTopics) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        mod.level === 'A1' ? 'bg-amber-500' : mod.level === 'A2' ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${(mod.completedTopics / mod.totalTopics) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-900 text-slate-400">
                  <span>Kelime: <b className="text-white">{mod.masteredWords}/{mod.totalWords}</b></span>
                  <span>Test Başarısı: <b className="text-emerald-400">%{mod.accuracy}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS RADAR (RADAR CHART) */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-6 space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>6 Temel Almanca Dil Becerisi Radarı</span>
              <span className="text-[11px] text-emerald-400 font-mono">Dengeli Gelişim</span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                  <Radar
                    name="Beceri Düzeyi (%)"
                    dataKey="value"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`%${val}`, 'Puan']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Recommendations */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                <CheckCircle2 className="w-4 h-4" />
                <span>En Güçlü Alan: Lesen (Okuma) & Wortschatz (Kelime)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kelime kartları ve Almanca alfabe & telaffuz modüllerindeki yüksek başarı oranınız sayesinde okuma ve anlama beceriniz %90'ın üzerinde.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                <Sparkles className="w-4 h-4" />
                <span>Geliştirme Tavsiyesi: Sprechen (Konuşma & Telaffuz)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kendini tanıtma ve rica cümleleri (Können Sie mir bitte...) kalıplarını AI Telaffuz Koçu ile sesli pratik yaparak konuşma skorunuzu %85 üzerine çıkarabilirsiniz.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Genel Seviye Değerlendirmesi</div>
                <div className="text-[11px] text-slate-400">Goethe-Zertifikat A1 Hazırlık Durumu</div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black">
                %88 Hazır
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
