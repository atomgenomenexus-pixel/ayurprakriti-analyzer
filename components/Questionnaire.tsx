import React from 'react';
import { AssessmentModule } from '../types';

interface QuestionnaireProps {
  module: AssessmentModule;
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
  autoFilledIds?: string[];
  unclearIds?: string[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  module, 
  answers, 
  onAnswer, 
  autoFilledIds = [],
  unclearIds = []
}) => {
  const handleToggleOption = (id: string, value: string) => {
    // Simplify answer retrieval since Record<string, string> guarantees string or undefined
    const valString = answers[id] || '';
    const current = valString.split(',').filter(Boolean);
    
    const index = current.indexOf(value);
    let updated;
    if (index > -1) {
      updated = current.filter(v => v !== value);
    } else {
      updated = [...current, value];
    }
    onAnswer(id, updated.join(','));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {module.questions.map((q, idx) => {
        const isAutoFilled = autoFilledIds.includes(q.id);
        const isUnclear = unclearIds.includes(q.id);
        const rawValue = answers[q.id];
        const hasValue = rawValue !== undefined && rawValue !== null && rawValue !== '';
        
        // Simplified display logic for string-based answers stored in state
        const val = rawValue || '';
        const selectedValues = val.split(',').filter(Boolean);

        return (
          <div 
            key={q.id} 
            className={`p-8 rounded-[2.5rem] border transition-all duration-500 backdrop-blur-md ${
              isUnclear ? 'border-rose-500/40 bg-rose-950/10' :
              hasValue ? 'border-emerald-500/30 bg-emerald-950/20 shadow-lg' : 
              'border-emerald-800/20 bg-black/10'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-lg shadow-xl ${
                isUnclear ? 'bg-rose-500 text-rose-950' :
                hasValue ? 'bg-emerald-500 text-emerald-950' : 
                'bg-emerald-950 text-emerald-800 border border-emerald-800/50'
              }`}>
                {idx + 1}
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/30">
                    {q.category}
                  </span>
                  {isAutoFilled && hasValue && !isUnclear && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                       Optical Sensor Verified
                    </span>
                  )}
                  {isUnclear && (
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                       Verification Failed: Unclear Image
                    </span>
                  )}
                </div>
                <h4 className="text-xl md:text-2xl font-lora font-bold text-white leading-tight">{q.text}</h4>
                {isUnclear && (
                  <p className="text-[10px] text-rose-400/70 font-bold uppercase tracking-widest mt-2 italic">
                    Diagnostic notice: This feature could not be automatically verified. Please select manually.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {q.options.map((opt) => {
                const selected = q.type === 'multi-select' 
                  ? selectedValues.includes(opt.value)
                  : val === opt.value;
                
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => q.type === 'multi-select' ? handleToggleOption(q.id, opt.value) : onAnswer(q.id, opt.value)}
                    className={`text-left p-5 rounded-[2rem] border transition-all duration-300 relative ${
                      selected 
                        ? 'bg-emerald-900/60 border-amber-400 shadow-xl scale-[1.02]' 
                        : 'bg-black/20 border-emerald-900/30 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${selected ? 'text-amber-400' : 'text-emerald-700'}`}>
                        {opt.label}
                      </div>
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                      )}
                    </div>
                    {opt.description && (
                      <div className={`text-[11px] leading-relaxed font-medium mt-1 ${selected ? 'text-emerald-100' : 'text-emerald-500'}`}>
                        {opt.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Questionnaire;