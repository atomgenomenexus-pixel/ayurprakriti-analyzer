import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ScanStep {
  key: string;
  label: string;
  hint: string;
  overlayClass: string;
  guides?: 'body' | 'face' | 'hand' | 'eye' | 'skin';
}

const SCAN_STEPS: ScanStep[] = [
  { 
    key: 'body', 
    label: '1. Bi-Acromion & Trunk Breadth', 
    hint: 'Stand back (2m). Align shoulders with the TOP guide and pelvis with the BOTTOM. We are comparing shoulder width vs. trunk width.', 
    overlayClass: 'w-[50%] h-[90%] rounded-[4rem] border-emerald-400',
    guides: 'body'
  },
  { 
    key: 'wrist', 
    label: '2. Elbow & Wrist Bony Prominence', 
    hint: 'Grip your wrist with your other hand. Fingers overlap easily = Narrow. Fingers just touch = Medium. Fingers do not meet = Wide.', 
    overlayClass: 'w-[55%] h-[45%] rounded-[2rem] border-amber-400',
    guides: 'hand'
  },
  { 
    key: 'forehead', 
    label: '3. Mahalalaat (Angula Pramana)', 
    hint: 'Place your fingers horizontally against your forehead height. The AI counts the finger-widths (Angulas) to determine height. 3 fingers = Narrow, 4 = Medium, >4 = Broad.', 
    overlayClass: 'w-[65%] h-[40%] rounded-[1.5rem] border-orange-400',
    guides: 'face'
  },
  { 
    key: 'eyes', 
    label: '4. Sclera Visibility & Lashes', 
    hint: 'Align eyes. Focus on the white area (sclera) around iris and lash thickness.', 
    overlayClass: 'w-[70%] h-[35%] rounded-full border-sky-400',
    guides: 'eye'
  },
  { 
    key: 'skin_detail', 
    label: '5. Dermal Texture & Tone', 
    hint: 'CRITICAL: Move to NATURAL light. Bring camera very close to your cheek. Capture lustre, dryness, and true color differentiation (Varna).', 
    overlayClass: 'w-[40%] h-[40%] rounded-full border-emerald-300 shadow-[0_0_30px_rgba(110,231,183,0.3)]',
    guides: 'skin'
  },
  { 
    key: 'lips', 
    label: '6. Lip Size & Texture', 
    hint: 'Close-up of mouth. Focus on vermilion border thickness and presence of cracks/wrinkles.', 
    overlayClass: 'w-[50%] h-[25%] rounded-[3rem] border-rose-400',
    guides: 'face'
  },
  { 
    key: 'dental', 
    label: '7. Teeth Shape & Palate', 
    hint: 'Smile for teeth (Even/Uneven), then tilt head for palate color (Pale/Red).', 
    overlayClass: 'w-[55%] h-[35%] rounded-[2rem] border-yellow-400' 
  },
  { 
    key: 'palm', 
    label: '8. Palm Color & Texture', 
    hint: 'Hold palm close. Assess color (Dark/Red/Pale/Pink) for base constitution baseline.', 
    overlayClass: 'w-[60%] h-[50%] rounded-[2rem] border-indigo-400',
    guides: 'hand'
  },
  { 
    key: 'nails', 
    label: '9. Nail Ratio (L vs B)', 
    hint: 'Nails close-up. Check if Length is <, =, or > Breadth. Also check color/texture.', 
    overlayClass: 'w-[50%] h-[40%] rounded-xl border-blue-400' 
  },
  { 
    key: 'feet', 
    label: '10. Sole & Heel Tendency', 
    hint: 'Capture heel area. Look for cracked/wrinkled skin and color patterns.', 
    overlayClass: 'w-[45%] h-[60%] rounded-[3rem] border-teal-400' 
  }
];

interface CameraModuleProps {
  onCaptureAll: (images: Record<string, string>) => void;
  isScanning?: boolean;
}

const CameraModule: React.FC<CameraModuleProps> = ({ onCaptureAll, isScanning }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const currentStep = SCAN_STEPS[currentStepIndex];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setError(null);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access is required for anatomical analysis. Please check permissions.");
    }
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const newImages = { ...capturedImages, [currentStep.key]: dataUrl };
        setCapturedImages(newImages);
        
        if (currentStepIndex < SCAN_STEPS.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          onCaptureAll(newImages);
        }
      }
    } else {
      setError("Sensor not ready. Please ensure your camera is active.");
    }
  }, [currentStepIndex, capturedImages, currentStep.key, onCaptureAll]);

  const restartScan = () => {
    if (confirm("Clear all diagnostic captures and restart?")) {
      setCurrentStepIndex(0);
      setCapturedImages({});
      setError(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const renderGuides = (type?: string) => {
    switch (type) {
      case 'body':
        return (
          <div className="absolute inset-0 flex flex-col items-center">
            <div className="absolute top-[20%] w-[90%] border-t-4 border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.6)]">
               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full uppercase tracking-tighter">Bi-Acromion (Shoulder)</span>
            </div>
            <div className="h-full border-l-2 border-dashed border-emerald-400/30" />
            <div className="absolute left-[15%] h-[60%] top-[20%] border-l-2 border-emerald-400/20" />
            <div className="absolute right-[15%] h-[60%] top-[20%] border-l-2 border-emerald-400/20" />
            <div className="absolute bottom-[25%] w-[75%] border-t-4 border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.6)]">
               <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full uppercase tracking-tighter">Bi-Iliac (Pelvis)</span>
            </div>
          </div>
        );
      case 'face':
        return (
          <>
            <div className="absolute top-1/2 w-full border-t border-orange-400/50" />
            <div className="absolute left-1/2 -translate-x-1/2 h-full border-l border-orange-400/50" />
          </>
        );
      case 'eye':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-12">
              <div className="w-16 h-12 rounded-[50%] border-2 border-sky-400/50" />
              <div className="w-16 h-12 rounded-[50%] border-2 border-sky-400/50" />
            </div>
          </div>
        );
      case 'skin':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-emerald-400/20" />
            <div className="h-full w-px bg-emerald-400/20" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-emerald-950/20 rounded-[3rem] border border-emerald-800/40 overflow-hidden mb-12 shadow-2xl">
      <div className="bg-emerald-900/40 p-6 border-b border-emerald-800/40 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center text-amber-400 font-black border border-emerald-800/50">
            {currentStepIndex + 1}
          </div>
          <div>
            <h3 className="text-amber-400 font-cinzel font-black uppercase tracking-widest text-sm">
              {currentStep.label}
            </h3>
            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
              Precision Bio-Metric Calibration: {Math.round(((currentStepIndex) / SCAN_STEPS.length) * 100)}%
            </p>
          </div>
        </div>
        
        <button 
          onClick={restartScan}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-950/40 text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-800/30 rounded-full hover:bg-rose-900/60 transition-all active:scale-95"
        >
          Restart Scan
        </button>
      </div>

      {error && (
        <div className="bg-rose-500 text-white p-4 text-center font-black uppercase tracking-widest text-[10px]">
          {error}
        </div>
      )}

      <div className="relative aspect-video bg-black">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
        
        <div className="absolute inset-0 pointer-events-none border-[2rem] border-black/30 flex items-center justify-center">
          <div className={`border-4 border-dashed animate-pulse transition-all duration-700 ${currentStep.overlayClass} flex flex-col items-center justify-center relative overflow-hidden`}>
            {renderGuides(currentStep.guides)}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-8 text-center flex flex-col items-center">
          <div className="max-w-xl bg-emerald-950/90 backdrop-blur-xl px-8 py-4 rounded-[2rem] mb-6 shadow-2xl border border-emerald-800/50">
            <p className="text-white text-sm font-bold leading-relaxed tracking-wide">
              {currentStep.hint}
            </p>
          </div>
          
          <button
            onClick={capturePhoto}
            disabled={isScanning}
            className="group relative w-20 h-20 bg-white rounded-full border-4 border-emerald-50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            <div className="w-14 h-14 bg-emerald-600 rounded-full group-hover:bg-emerald-500 transition-colors shadow-inner" />
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraModule;