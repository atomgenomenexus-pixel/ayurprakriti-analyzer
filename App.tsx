import React, { useState, useCallback, useMemo, useRef } from 'react';
import Layout, { PrakritiHelixIcon, AyurAvatar } from './components/Layout';
import CameraModule from './components/CameraModule';
import Questionnaire from './components/Questionnaire';
import ResultsView from './components/ResultsView';
import ProfileForm from './components/ProfileForm';
import { AssessmentState, AssessmentModuleId, UserProfile } from './types';
import { analyzeSingleModule, analyzeVisualFeatures } from './services/geminiService';
import { ASSESSMENT_MODULES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AssessmentState>({
    view: 'onboarding',
    profile: null,
    activeModule: null,
    activeResultId: null,
    answers: {},
    images: {},
    isAnalyzing: false,
    moduleResults: {},
    unclearIds: [],
  });

  const [isScanning, setIsScanning] = useState(false);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const questionnaireTopRef = useRef<HTMLDivElement>(null);

  const handleProfileSubmit = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile, view: 'dashboard' }));
  };

  const handleCaptureAll = useCallback(async (images: Record<string, string>) => {
    setState(prev => ({ ...prev, images }));
    setIsScanning(true);
    setProcessingLogs(["Initializing optical sensors...", "Extracting anatomical ratios..."]);
    
    try {
      setTimeout(() => setProcessingLogs(prev => [...prev, "Calculating Bi-Acromial vs Bi-Iliac ratio...", "Evaluating skin lusture..."]), 1500);
      
      const result = await analyzeVisualFeatures(images);
      
      setProcessingLogs(prev => [...prev, "Synthesizing diagnostic markers...", "Finalizing Prakruti auto-population..."]);
      
      setState(prev => ({
        ...prev,
        answers: { ...prev.answers, ...result.answers },
        unclearIds: result.unclearIds || []
      }));
      
      setTimeout(() => {
        questionnaireTopRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 800);

    } catch (err: any) {
      console.error("Visual scan failed", err);
      alert("Analysis engine failure. Please fill the remaining fields manually.");
    } finally {
      setIsScanning(false);
      setTimeout(() => setProcessingLogs([]), 2000);
    }
  }, []);

  const handleAnswer = useCallback((id: string, value: string) => {
    setState(prev => ({ 
      ...prev, 
      answers: { ...prev.answers, [id]: value },
      unclearIds: prev.unclearIds.filter(uid => uid !== id)
    }));
  }, []);

  const handleAnalyzeModule = async (moduleId: AssessmentModuleId) => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const result = await analyzeSingleModule(moduleId, state.answers, state.profile);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        moduleResults: { ...prev.moduleResults, [moduleId]: result },
        activeResultId: moduleId,
        view: 'module-result'
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false }));
      alert("Analysis failed. Please try again.");
    }
  };

  const prakrutiAutoFilledIds = useMemo(() => {
    const module = ASSESSMENT_MODULES.find(m => m.id === 'prakruti');
    return module?.questions
      .filter(q => q.id.startsWith('p_') && !q.id.startsWith('pm_'))
      .map(q => q.id) || [];
  }, []);

  // Shared Profile Header Component to be used in Dashboard and Assessment
  const PatientProfileBanner = ({ activeModuleTitle }: { activeModuleTitle?: string }) => (
    <div className="w-full bg-emerald-950/40 p-8 md:p-10 rounded-[3rem] border border-emerald-800/40 shadow-2xl backdrop-blur-xl mb-10 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 text-emerald-900/10 text-9xl font-cinzel opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
        AYUR
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-emerald-900 flex items-center justify-center border-2 border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)] group-hover:border-amber-400/60 transition-colors">
            <AyurAvatar className="w-16 h-16 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Patient Identity</div>
            <h2 className="text-3xl md:text-4xl font-cinzel font-black text-white uppercase tracking-widest leading-none">{state.profile?.name}</h2>
          </div>
        </div>

        <div className="h-px lg:h-12 w-full lg:w-px bg-emerald-800/40"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-6 flex-grow">
          <div>
            <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-1.5">Age / Sex</p>
            <p className="text-emerald-100 font-bold uppercase text-sm">{state.profile?.age}Y / {state.profile?.sex}</p>
          </div>
          <div>
            <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-1.5">Origin</p>
            <p className="text-emerald-100 font-bold uppercase text-sm truncate">{state.profile?.place}</p>
          </div>
          <div>
            <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-1.5">Occupation</p>
            <p className="text-emerald-100 font-bold uppercase text-sm truncate">{state.profile?.occupation}</p>
          </div>
          {state.profile?.phone && (
            <div>
              <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-1.5">Contact</p>
              <p className="text-emerald-100 font-bold uppercase text-sm">{state.profile?.phone}</p>
            </div>
          )}
          <div>
            <p className="text-emerald-700 text-[9px] font-black uppercase tracking-widest mb-1.5">Analysis State</p>
            <p className="text-amber-400 font-black uppercase text-sm animate-pulse-soft">
              {activeModuleTitle ? activeModuleTitle : 'Ready for Scan'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (state.view === 'onboarding') return <Layout><ProfileForm onSubmit={handleProfileSubmit} /></Layout>;

  if (state.isAnalyzing) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-emerald-950/20 rounded-[4rem] border border-emerald-800/30 backdrop-blur-3xl">
          <div className="relative mb-10">
            <div className="absolute inset-0 border-b-4 border-amber-400 rounded-full animate-spin opacity-50"></div>
            <PrakritiHelixIcon className="w-24 h-24 animate-pulse-soft relative z-10 text-amber-400" />
          </div>
          <h2 className="text-4xl font-cinzel font-black text-amber-400 uppercase tracking-widest mb-4">Metabolic Synthesis</h2>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Running Samhita Intelligence Core...</p>
        </div>
      </Layout>
    );
  }

  if (state.view === 'module-result' && state.activeResultId) {
    return (
      <Layout>
        <ResultsView 
          result={state.moduleResults[state.activeResultId]} 
          profile={state.profile}
          onClose={() => setState(p => ({ ...p, view: 'dashboard', activeResultId: null }))}
        />
      </Layout>
    );
  }

  if (state.view === 'assessment' && state.activeModule) {
    const module = ASSESSMENT_MODULES.find(m => m.id === state.activeModule);
    const hasImages = Object.keys(state.images).length >= 9;
    const isPrakruti = state.activeModule === 'prakruti';
    
    // Check if at least some questions are answered for a meaningful analysis (e.g. at least 1)
    const hasAnyAnswer = module?.questions.some(q => !!state.answers[q.id]);
    const answeredCount = module?.questions.filter(q => !!state.answers[q.id]).length || 0;
    const totalQuestions = module?.questions.length || 1;

    return (
      <Layout>
        <PatientProfileBanner activeModuleTitle={module?.title} />

        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={() => setState(p => ({ ...p, view: 'dashboard' }))} className="text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-900/40 px-8 py-4 rounded-full border border-emerald-800/40 transition-all active:scale-95">
            Return to Dashboard
          </button>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <button 
              onClick={() => handleAnalyzeModule(state.activeModule!)}
              disabled={!hasAnyAnswer}
              className={`px-12 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl ${
                hasAnyAnswer
                ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300' 
                : 'bg-emerald-900/40 text-emerald-800 cursor-not-allowed border border-emerald-800/40'
              }`}
            >
              {answeredCount < totalQuestions ? 'Calculate with Partial Data' : 'Calculate Full Systemic Result'}
            </button>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
              Data Points: {answeredCount} / {totalQuestions}
            </span>
          </div>
        </div>

        {isPrakruti && !hasImages && <CameraModule onCaptureAll={handleCaptureAll} isScanning={isScanning} />}
        
        <div ref={questionnaireTopRef} className="scroll-mt-20">
          {isScanning && (
            <div className="p-10 mb-12 bg-emerald-950/60 rounded-[3rem] border border-amber-400/30 text-center shadow-2xl">
              <div className="w-12 h-12 border-t-2 border-amber-400 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="text-amber-400 font-black uppercase tracking-[0.3em] text-xs mb-4">AI Bio-Metric Synthesis In Progress</div>
              <div className="space-y-1">
                {processingLogs.map((log, i) => (
                  <p key={i} className="text-emerald-500 text-[9px] font-black uppercase tracking-widest opacity-80 animate-pulse">>> {log}</p>
                ))}
              </div>
            </div>
          )}

          {module && (
            <Questionnaire 
              module={module} 
              answers={state.answers} 
              onAnswer={handleAnswer}
              autoFilledIds={isPrakruti ? prakrutiAutoFilledIds : []}
              unclearIds={state.unclearIds}
            />
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PatientProfileBanner />

      <div className="flex flex-wrap justify-center gap-10">
        {ASSESSMENT_MODULES.map(module => (
          <div key={module.id} className="bg-emerald-950/20 p-8 rounded-[3rem] border border-emerald-800/30 group hover:border-amber-400/30 transition-all flex flex-col justify-between overflow-hidden relative min-h-[350px] w-full max-w-lg">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-all"></div>
            <div>
              <div className="w-20 h-20 rounded-3xl bg-emerald-900/50 flex items-center justify-center text-4xl mb-8 border border-emerald-800 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-all group-hover:scale-110 shadow-lg">
                {module.id === 'prakruti' ? <PrakritiHelixIcon className="w-10 h-10" /> : '🌀'}
              </div>
              <h3 className="text-3xl font-cinzel font-black text-white uppercase tracking-widest mb-4 leading-tight">{module.title}</h3>
              <p className="text-emerald-600 text-[12px] font-bold uppercase tracking-[0.15em] opacity-80 leading-relaxed mb-8">{module.description}</p>
            </div>
            <button 
              onClick={() => setState(p => ({ ...p, view: 'assessment', activeModule: module.id }))}
              className="mt-4 w-full text-[11px] font-black uppercase tracking-[0.2em] px-6 py-6 rounded-[2rem] border bg-emerald-900/40 text-emerald-400 border-emerald-800/40 hover:bg-amber-400 hover:text-emerald-950 hover:border-amber-400 transition-all active:scale-95 shadow-xl"
            >
              Initialize Assessment
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default App;