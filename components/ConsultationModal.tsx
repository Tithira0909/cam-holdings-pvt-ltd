import React, { useState, useRef } from 'react';
import { X, Send, Sparkles, Film, Upload, Loader2, Play } from 'lucide-react';
import { getAIRecommendation, generateVideo } from '../services/gemini';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loadingMessages = [
  "Analyzing architectural composition...",
  "Synthesizing cinematic motion path...",
  "Applying premium material shaders...",
  "Rendering high-fidelity lighting...",
  "Simulating atmospheric depth...",
  "Polishing final frames for review..."
];

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'ai' | 'vision'>('form');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Vision / Veo state
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionPrompt, setVisionPrompt] = useState('');
  const [visionAspectRatio, setVisionAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const response = await getAIRecommendation(aiQuery);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setVisionImage(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!visionImage) return;

    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey();
    }

    setIsVideoGenerating(true);
    setGeneratedVideoUrl(null);
    
    const msgInterval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
    }, 4000);

    try {
      const videoUrl = await generateVideo(visionPrompt, visionImage, visionAspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
      } else {
        alert("An error occurred during video generation. Please try again.");
      }
    } finally {
      setIsVideoGenerating(false);
      clearInterval(msgInterval);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-luxury-black/70 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 rounded-sm">
        {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-1/4 bg-luxury-black p-10 flex-col justify-between items-center text-center border-r border-white/5">
          <div className="w-full">
            <img 
              src="logo.png" 
              alt="Crown Asia Majestic Holdings" 
              className="w-full h-auto object-contain mb-10 brightness-110" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = `<div class="w-14 h-14 bg-red-600 flex items-center justify-center text-luxury-black font-serif text-2xl font-bold mx-auto mb-10 shadow-gold-glow">C</div>`;
              }}
            />
            <h3 className="text-white font-serif text-2xl mb-6 leading-tight tracking-tight">Elite Partner <br/> Consultation</h3>
            <p className="text-white/40 text-[11px] font-light leading-relaxed uppercase tracking-luxury">Transforming visionary site sketches into architectural motion reality.</p>
          </div>
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-brand text-red-600 font-bold">EST. 2012</div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar bg-white">
          <button onClick={onClose} className="absolute top-8 right-8 text-luxury-black hover:text-red-600 transition-colors z-20">
            <X size={24} />
          </button>

          <div className="flex gap-10 border-b border-luxury-border mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['form', 'ai', 'vision'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-5 text-[10px] uppercase tracking-brand font-bold border-b-2 transition-all ${activeTab === tab ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400 hover:text-luxury-black'}`}
              >
                {tab === 'form' ? 'Request Proposal' : tab === 'ai' ? 'AI Concierge' : 'Vision Visualizer'}
              </button>
            ))}
          </div>

          {activeTab === 'form' && (
            <form
              className="space-y-8 animate-in fade-in duration-500"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = {
                  full_name: formData.get('full_name'),
                  email: formData.get('email'),
                  service: formData.get('service'),
                  message: 'Consultation Request', // Simple default message or add textarea
                  subject: 'New Consultation Request'
                };

                try {
                    const res = await fetch('/api/inquiries', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (res.ok) {
                        alert('Request sent successfully! Our team will contact you shortly.');
                        onClose();
                    } else {
                        alert('Failed to send request. Please try again.');
                    }
                } catch (err) {
                    console.error(err);
                    alert('An error occurred.');
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-luxury text-luxury-gray block font-bold">Full Name</label>
                  <input name="full_name" type="text" className="w-full bg-luxury-offwhite border border-luxury-border p-4 text-sm focus:ring-1 focus:ring-red-600 outline-none" placeholder="Johnathan Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-luxury text-luxury-gray block font-bold">Email Address</label>
                  <input name="email" type="email" className="w-full bg-luxury-offwhite border border-luxury-border p-4 text-sm focus:ring-1 focus:ring-red-600 outline-none" placeholder="john@elite.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-luxury text-luxury-gray block font-bold">Inquiry Type</label>
                <select name="service" className="w-full bg-luxury-offwhite border border-luxury-border p-4 text-sm focus:ring-1 focus:ring-red-600 outline-none appearance-none">
                  <option>New Project Feasibility</option>
                  <option>Construction Management</option>
                  <option>Interior Architecture</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-red-600 text-luxury-black font-bold uppercase text-[10px] tracking-brand shadow-gold-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Send Request <Send size={16} />
              </button>
            </form>
          )}

          {activeTab === 'ai' && (
            <div className="animate-in fade-in duration-500 flex flex-col h-[500px]">
              <div className="bg-luxury-offwhite border border-luxury-border p-8 flex-1 mb-6 text-sm leading-relaxed text-luxury-black shadow-inner overflow-y-auto custom-scrollbar font-light rounded-sm">
                {aiResponse || <div className="text-gray-400 italic">"What are the current luxury architectural trends in Colombo?"</div>}
                {isAiLoading && <div className="mt-4 text-red-600 flex items-center gap-2 font-bold animate-pulse text-[10px] tracking-brand uppercase">Concierge is analyzing...</div>}
              </div>
              <form onSubmit={handleAiChat} className="relative">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask our premium consultant..."
                  className="w-full bg-luxury-offwhite border border-luxury-border p-5 pr-14 focus:ring-1 focus:ring-red-600 outline-none text-sm text-luxury-black"
                />
                <button type="submit" disabled={isAiLoading} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-luxury-black transition-colors disabled:opacity-30">
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="animate-in fade-in duration-500 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-[10px] text-luxury-gray font-bold uppercase tracking-luxury">Source Visualization</p>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border border-dashed border-luxury-border bg-luxury-offwhite flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-all relative overflow-hidden group shadow-sm"
                  >
                    {visionImage ? (
                      <>
                        <img src={`data:image/jpeg;base64,${visionImage}`} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" />
                        <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="text-white" size={32} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="text-red-600 mb-3" size={28} />
                        <span className="text-[10px] text-luxury-gray uppercase tracking-brand font-bold">Upload Site Media</span>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                  <div className="flex gap-4">
                    {['16:9', '9:16'].map(ratio => (
                      <button 
                        key={ratio}
                        onClick={() => setVisionAspectRatio(ratio as any)}
                        className={`flex-1 py-3 text-[10px] uppercase tracking-brand font-bold border transition-all ${visionAspectRatio === ratio ? 'border-red-600 bg-red-600/5 text-red-600 shadow-sm' : 'border-luxury-border text-gray-400 hover:text-luxury-black'}`}
                      >
                        {ratio === '16:9' ? 'Landscape' : 'Portrait'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury text-luxury-gray block font-bold">Walkthrough Prompt</label>
                    <textarea 
                      value={visionPrompt}
                      onChange={(e) => setVisionPrompt(e.target.value)}
                      className="w-full bg-luxury-offwhite border border-luxury-border p-5 h-28 focus:ring-1 focus:ring-red-600 outline-none text-sm text-luxury-black font-light resize-none"
                      placeholder="Cinematic drone sweep across this site at dusk with garden lighting..."
                    />
                  </div>

                  <button 
                    onClick={handleGenerateVideo}
                    disabled={!visionImage || isVideoGenerating}
                    className="w-full py-5 bg-red-600 text-luxury-black font-bold uppercase text-[10px] tracking-brand shadow-gold-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {isVideoGenerating ? (
                      <><Loader2 className="animate-spin" size={18} /> Simulating Vision...</>
                    ) : (
                      <><Sparkles size={18} /> Render Vision</>
                    )}
                  </button>
                </div>
              </div>

              {isVideoGenerating || generatedVideoUrl ? (
                <div className="border-t border-luxury-border pt-10 animate-in slide-in-from-bottom-6 duration-700">
                  <div className={`relative bg-luxury-black shadow-gold-glow-lg mx-auto overflow-hidden ${visionAspectRatio === '9:16' ? 'max-w-[320px] aspect-[9/16]' : 'w-full aspect-video'}`}>
                    {isVideoGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
                        <Loader2 className="animate-spin text-red-600 mb-8" size={56} />
                        <h4 className="text-white font-serif text-xl mb-4 tracking-tight">{loadingMessages[loadingMsgIdx]}</h4>
                        <div className="w-48 h-1 bg-white/10 relative overflow-hidden">
                           <div className="absolute inset-0 bg-red-600 animate-[loading-bar_4s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    ) : (
                      <video src={generatedVideoUrl!} controls autoPlay loop className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;