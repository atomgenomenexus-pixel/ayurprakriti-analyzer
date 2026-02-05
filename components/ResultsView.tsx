import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ModuleResult, DoshaType, UserProfile } from '../types';

interface ResultsViewProps {
  result: ModuleResult;
  profile: UserProfile | null;
  onClose: () => void;
  onRetake?: () => void;
}

const DOSHA_COLORS: Record<string, string> = {
  [DoshaType.VATA]: '#14b8a6', // Teal
  [DoshaType.PITTA]: '#f59e0b', // Amber
  [DoshaType.KAPHA]: '#065f46', // Emerald
};

const ResultsView: React.FC<ResultsViewProps> = ({ result, profile, onClose, onRetake }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  /**
   * Normalizes AI output scores into stable 0-100 integers.
   * Ensures fractional inputs (0.5) and integer inputs (50) both result in 50.
   */
  const normalizeScore = (val: unknown): number => {
    if (val === undefined || val === null) return 0;
    const n = typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(n) || n === 0) return 0;
    
    // Convert decimal fractions (e.g., 0.5) to whole percentages (50)
    // We assume any non-zero value <= 1.0 is a fraction unless it is explicitly 1.0 (which could be 1% or 100%)
    // But since Dosha percentages are almost never 1%, we treat 1.0 as 100%.
    if (n > 0 && n <= 1.0) {
      return Math.round(n * 100);
    }
    
    return Math.round(n);
  };

  const scores = result?.scores || {};
  
  const chartData = Object.entries(scores).map(([name, value]) => ({
    name,
    value: normalizeScore(value),
  }));

  const sortedScores = Object.entries(scores)
    .map(([name, val]) => [name, normalizeScore(val)] as [string, number])
    .sort((a, b) => b[1] - a[1]);
  
  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 10,
      filename: `Charaka_Prakriti_${profile?.name || 'Report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(reportRef.current).save();
  };

  return (
    <div className="animate-in fade-in duration-1000 pb-20">
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap gap-4">
          <button onClick={onClose} className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-900/50 px-8 py-4 rounded-full border border-emerald-800/50 transition-all active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </button>
          
          {onRetake && (
            <button onClick={onRetake} className="flex items-center gap-3 text-amber-400 font-black uppercase tracking-widest text-[10px] hover:bg-amber-400/10 px-8 py-4 rounded-full border border-amber-400/30 transition-all active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Retake Scan
            </button>
          )}
        </div>

        <button 
          onClick={handleDownloadPDF}
          className="bg-amber-400 text-emerald-950 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-amber-300 px-10 py-4 rounded-full shadow-2xl transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Samhita Report
        </button>
      </div>

      <div ref={reportRef} className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-emerald-50 text-emerald-950">
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-emerald-100 pb-12 mb-12">
          <div className="relative">
            <h2 className="text-4xl font-cinzel font-black text-emerald-900 mb-2 uppercase tracking-tight">Ayur Prakriti Analyzer</h2>
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-amber-400 text-emerald-950 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Charaka Samhita Compliant
              </span>
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Vedic Constitutional Certificate</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[9px] uppercase font-black text-emerald-300 tracking-widest">Patient Profile</p>
                <p className="font-cinzel font-bold text-emerald-950">{profile?.name}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-emerald-300 tracking-widest">Clinical Data</p>
                <p className="font-bold text-emerald-950">{profile?.age}Y | {profile?.sex} | {profile?.place}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0 bg-emerald-950 text-white p-10 rounded-[2.5rem] text-center shadow-xl flex flex-col items-center justify-center min-w-[240px]">
             <p className="text-[10px] uppercase font-black tracking-widest text-amber-400 mb-2">Primary Prakruti</p>
             <h3 className="text-3xl font-cinzel font-black uppercase tracking-tighter mb-4">{result?.classification || 'Analyzing...'}</h3>
             <div className="w-16 h-0.5 bg-amber-400/30 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-emerald-50/50 rounded-[3rem] p-8 border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-900 text-9xl font-cinzel">V</div>
            <h4 className="text-xl font-cinzel font-bold mb-8 text-center text-emerald-900 uppercase">Tridosha Composition (%)</h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={chartData.length > 0 ? chartData : [{name: 'Loading', value: 100}]} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={8} 
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {chartData.length > 0 ? chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DOSHA_COLORS[entry.name as DoshaType] || '#CBD5E1'} />
                    )) : <Cell fill="#CBD5E1" />}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value}%`, 'Composition']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex justify-around">
              {sortedScores.map(([name, score]) => (
                <div key={name} className="text-center">
                  <div className="text-[10px] font-black uppercase text-emerald-500 mb-1">{name}</div>
                  <div className="text-2xl font-cinzel font-bold text-emerald-950">{score}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
             <div className="bg-emerald-900 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 text-8xl opacity-10 group-hover:scale-110 transition-transform font-cinzel italic">C</div>
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6">Samhita Insight (Vimana 8)</h4>
                <p className="text-xl font-lora italic leading-relaxed border-l-4 border-amber-400 pl-8 mb-8">
                  "{result?.insight || 'Synthesizing metabolic insights...'}"
                </p>
                <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                   <h5 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Clinical Sutra-Based Reasoning</h5>
                   <p className="text-[11px] leading-relaxed text-emerald-50/80 font-mono italic">
                     {result?.reasoning || 'Diagnostic logic calculation in progress.'}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
           <section className="bg-white p-10 rounded-[3rem] border-t-8 border-amber-400 shadow-lg border border-emerald-50">
              <h4 className="text-2xl font-cinzel font-black text-emerald-900 mb-8 flex items-center gap-4">
                 <span className="text-3xl">🍲</span> AHARA (SAMHITA DIET)
              </h4>
              <ul className="space-y-4">
                {(result?.recommendations?.ahara || ['General healthy diet recommended.']).map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-emerald-900 font-medium">
                    <span className="text-amber-500 mt-1">◈</span> {item}
                  </li>
                ))}
              </ul>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border-t-8 border-emerald-600 shadow-lg border border-emerald-50">
              <h4 className="text-2xl font-cinzel font-black text-emerald-900 mb-8 flex items-center gap-4">
                 <span className="text-3xl">🌿</span> VIHARA (LIFESTYLE)
              </h4>
              <ul className="space-y-4">
                {(result?.recommendations?.vihara || ['Maintain balanced daily routine.']).map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-emerald-900 font-medium">
                    <span className="text-emerald-500 mt-1">◈</span> {item}
                  </li>
                ))}
              </ul>
           </section>
        </div>

        <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100">
           <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.5em] mb-6 text-center">Referenced Ayurvedic Texts</h4>
           <div className="flex flex-wrap justify-center gap-3">
              {(result?.references || ['Charaka Samhita Vimana Sthana 8']).map((ref, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="text-amber-500 font-black">§</span>
                  <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">{ref}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="text-center pt-12 border-t border-emerald-50 mt-12">
           <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[1em]">Authenticated by Ayur Prakriti Analyzer Core • Charaka Samhita Reference Engine</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;