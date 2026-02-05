import React, { useRef, useMemo } from 'react';
import { ModuleResult, UserProfile } from '../types';

interface Props {
  result: ModuleResult;
  profile: UserProfile | null;
  onClose: () => void;
  onRetake?: () => void;
}

const ModuleResultView: React.FC<Props> = ({ result, profile, onClose, onRetake }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const isAgni = result?.moduleId === 'agni';
  
  const getModuleTitle = () => {
    switch (result?.moduleId) {
      case 'prakruti': return 'Prakriti: Anatomical Constitution';
      case 'sara': return 'Sara: Tissue Excellence Profile';
      case 'dhatu': return 'Dhatu: Systemic Tissue Status';
      case 'dosha': return 'Dosha: Metabolic Equilibrium';
      case 'koshta': return 'Koshta: Gastrointestinal Bowel';
      case 'agni': return 'Agni: Digestive Metabolic Fire';
      case 'mala': return 'Mala: Metabolic Waste Efficacy';
      default: return 'Ayur Prakriti Analyzer Diagnostic';
    }
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 10,
      filename: `AyurPrakriti_${profile?.name || 'Report'}_${result?.moduleId || 'Module'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#022c22' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(reportRef.current).save();
  };

  const normalizeScore = (val: number) => {
    if (val > 0 && val <= 1) return Math.round(val * 100);
    return Math.round(val);
  };

  const reasoningSentences = useMemo(() => 
    (result?.reasoning || '').split('.').filter(s => s.trim().length > 3), 
  [result?.reasoning]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 no-print">
        <div className="flex gap-4">
          <button onClick={onClose} className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-900/50 px-8 py-4 rounded-full border border-emerald-800/50 transition-all active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </button>
          
          {onRetake && (
            <button onClick={onRetake} className="flex items-center gap-3 text-amber-400 font-black uppercase tracking-widest text-[10px] hover:bg-amber-400/10 px-8 py-4 rounded-full border border-amber-400/30 transition-all active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Retake Assessment
            </button>
          )}
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          className="bg-amber-400 text-emerald-950 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-amber-300 px-10 py-4 rounded-full shadow-2xl transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Diagnostic PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-[#022c22] p-2 md:p-8 rounded-[3.5rem] border border-emerald-800/30">
        <div className="mb-16 p-10 border-b border-emerald-800/30 bg-gradient-to-br from-emerald-900/20 to-transparent rounded-[3rem]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h1 className="text-4xl font-cinzel font-black text-amber-400 uppercase tracking-widest mb-1">Ayur Prakriti Analyzer</h1>
              <div className="flex items-center gap-4 mt-2">
                 <span className="bg-amber-400 text-emerald-950 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Charaka Samhita Engine</span>
                 <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em]">Systems Diagnostic Hub</p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                   <div className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Patient</div>
                   <div className="text-white font-bold font-cinzel text-lg">{profile?.name}</div>
                </div>
                <div>
                   <div className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Demographics</div>
                   <div className="text-white font-bold">{profile?.age}Y / {profile?.sex}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 p-10 rounded-[2.5rem] border border-emerald-800/50 flex flex-col items-center justify-center text-center md:w-64">
               <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Finding</div>
               <div className="text-2xl font-cinzel font-black text-white uppercase leading-tight mb-2">{result?.classification || 'Pending'}</div>
               <div className="w-12 h-1 bg-amber-400/30 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="px-6 mb-20">
          <h3 className="text-2xl font-cinzel font-black text-center text-emerald-100 mb-12 uppercase tracking-[0.3em]">
             {getModuleTitle()}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {result?.subScores && Object.entries(result.subScores).map(([name, data]: [string, any]) => {
              const val = typeof data === 'object' ? data.percentage : data;
              const cls = typeof data === 'object' ? data.classification : 'Analyzed';
              
              return (
                <div key={name} className="bg-emerald-950/40 p-8 rounded-[2.5rem] border border-emerald-800/40 flex flex-col items-center text-center group hover:bg-emerald-900/40 transition-all">
                  <div className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-2">{name}</div>
                  {!isAgni && typeof val === 'number' && <div className="text-4xl font-cinzel font-black text-white mb-3">{normalizeScore(val)}%</div>}
                  <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    cls.toLowerCase().includes('balanced') || cls.toLowerCase().includes('sama') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    cls.toLowerCase().includes('alpa') ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {cls}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 mb-20">
           <div className="bg-emerald-950/60 p-12 rounded-[3.5rem] border border-emerald-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-emerald-900 text-6xl opacity-20 group-hover:opacity-30 transition-all font-cinzel italic">§</div>
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Constitutional Synthesis</h4>
              <p className="text-lg text-emerald-50 font-lora italic leading-relaxed border-l-4 border-amber-400 pl-8 py-2">
                 "{result?.insight || 'Synthesizing metabolic insights...'}"
              </p>
           </div>

           <div className="bg-emerald-900/30 p-12 rounded-[3.5rem] border border-emerald-800/50 flex flex-col justify-center">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-8">Clinical Samhita Logic</h4>
              <div className="space-y-6">
                {reasoningSentences.map((sentence, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <span className="w-8 h-8 rounded-xl bg-emerald-950 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-800">
                      {idx + 1}
                    </span>
                    <p className="text-[13px] text-emerald-100/90 leading-relaxed font-mono mt-1 italic">
                      {sentence.trim()}.
                    </p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="px-6 mb-20">
           <div className="bg-emerald-950/20 p-8 rounded-[3rem] border border-emerald-800/30">
              <h4 className="text-[9px] font-black text-emerald-800 uppercase tracking-[0.4em] mb-6 text-center">Referenced Ayurvedic Texts</h4>
              <div className="flex flex-wrap justify-center gap-4">
                 {(result?.references || ['Charaka Samhita Vimana Sthana 8']).map((ref, i) => (
                   <span key={i} className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-black/40 px-6 py-2 rounded-full border border-emerald-800/40">
                      {ref}
                   </span>
                 ))}
              </div>
           </div>
        </div>

        <div className="text-center pb-12 border-t border-emerald-900/50 mt-12 pt-12">
          <p className="text-emerald-900 text-[9px] font-black uppercase tracking-[0.8em]">Validated against Charaka Samhita Vimana 8 • Ayur Prakriti Analyzer</p>
        </div>
      </div>
    </div>
  );
};

export default ModuleResultView;