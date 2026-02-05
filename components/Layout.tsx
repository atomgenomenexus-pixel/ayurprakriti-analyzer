import React from 'react';

export const PrakritiHelixIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="text-emerald-800 opacity-30" />
    <path d="M45 25C35 25 30 35 35 45C40 55 50 50 50 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-sky-400 opacity-80" />
    <circle cx="45" cy="25" r="2" fill="currentColor" className="text-sky-200" />
    <path d="M55 25L65 45L55 40L45 45L55 25Z" fill="currentColor" className="text-amber-500 opacity-80" />
    <path d="M55 25L60 35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-amber-200" />
    <path d="M35 60C35 75 50 85 65 60C55 55 45 55 35 60Z" fill="currentColor" className="text-emerald-500 opacity-80" />
    <path d="M50 65V80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-200 opacity-40" />
    <circle cx="50" cy="50" r="6" fill="currentColor" className="text-white shadow-glow animate-pulse" />
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" className="text-amber-400/30" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-emerald-800/20" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-emerald-800/20" />
  </svg>
);

export const AyurAvatar = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Spiritual Halo */}
    <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-amber-400/20" />
    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" className="text-emerald-400/10" />
    
    {/* Stylized Human Silhouette in Meditation/Lotus Pose */}
    <path d="M60 25C52 25 45 32 45 40C45 48 52 55 60 55C68 55 75 48 75 40C75 32 68 25 60 25Z" fill="currentColor" className="text-amber-400" />
    <path d="M60 60C45 60 30 75 30 90C30 95 35 100 40 100H80C85 100 90 95 90 90C90 75 75 60 60 60Z" fill="currentColor" className="text-amber-400/80" />
    
    {/* Energy Points (Chakras/Prana Flow) */}
    <circle cx="60" cy="40" r="2" fill="white" className="animate-pulse" />
    <circle cx="60" cy="65" r="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
    <circle cx="60" cy="80" r="1.5" fill="white" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
    
    {/* Radiating Lines */}
    <line x1="60" y1="15" x2="60" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-400" />
    <line x1="35" y1="35" x2="40" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-400/50" />
    <line x1="85" y1="35" x2="80" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-400/50" />
  </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#022c22]">
      <header className="bg-emerald-950 text-amber-50 py-6 px-4 shadow-2xl border-b border-emerald-800/50 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-400/10 blur-xl rounded-full group-hover:bg-amber-400/20 transition-all"></div>
              <PrakritiHelixIcon className="w-12 h-12 relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-cinzel font-bold tracking-wider">Ayur Prakriti Analyzer</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-200/50">Vedic Constitution Diagnostic</p>
            </div>
          </div>
          <nav className="hidden md:block">
            <span className="text-sm italic text-amber-200/40">"Balance of Tridosha"</span>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-black/40 text-emerald-600/60 py-8 px-4 text-center text-sm border-t border-emerald-900/50">
        <div className="max-w-4xl mx-auto space-y-2">
          <p>© 2024 Ayur Prakriti Analyzer - Professional Diagnostic</p>
          <p className="text-[10px] opacity-50 uppercase tracking-[0.3em]">Precision Tridosha Profiling Engine</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;