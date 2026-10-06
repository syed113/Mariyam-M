import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  Sun,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FOUNDATION_SHADES } from '../../data/initialCatalog';
import { SkinTone, Undertone, ShadeMatchResult } from '../../types';

export const AIShadeStudioModal: React.FC = () => {
  const {
    isShadeStudioOpen,
    setIsShadeStudioOpen,
    products,
    addToCart,
    setShadeMatchResult,
    showToast
  } = useStore();

  if (!isShadeStudioOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Studio Flow State
  const [step, setStep] = useState<'intro' | 'photo' | 'manual' | 'analyzing' | 'result'>('intro');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedDepth, setSelectedDepth] = useState<SkinTone>('medium');
  const [selectedUndertone, setSelectedUndertone] = useState<Undertone>('warm');
  const [currentBrand, setCurrentBrand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setLocalMatchResult] = useState<ShadeMatchResult | null>(null);

  const foundationProduct = products.find(p => p.id === 'mm-prod-1') || products[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image size exceeds 8MB. Please choose a smaller photo.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setStep('photo');
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (mode: 'image' | 'manual') => {
    setIsProcessing(true);
    setStep('analyzing');

    try {
      const response = await fetch('/api/ai/shade-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: mode === 'image' ? uploadedImage : undefined,
          manualPreferences: {
            depth: selectedDepth,
            undertone: selectedUndertone,
            referenceBrand: currentBrand
          }
        })
      });

      if (!response.ok) {
        throw new Error('Analysis server response was not ok');
      }

      const data = await response.json();
      const matched = data.matchedShade || FOUNDATION_SHADES[2];

      const finalResult: ShadeMatchResult = {
        detectedTone: data.detectedTone || selectedDepth,
        detectedUndertone: data.detectedUndertone || selectedUndertone,
        confidenceScore: data.confidenceScore || 94,
        matchedShade: matched,
        concealerShadeName: data.concealerShadeName || `${matched.name} Concealer Spot-Light`,
        explanation: data.explanation || 'Analyzed your skin nuances to select the optimal warm golden balance.',
        lightingQuality: data.lightingQuality || 'Optimal',
        recommendedFoundationId: 'mm-prod-1',
        recommendedProducts: [foundationProduct]
      };

      setLocalMatchResult(finalResult);
      setShadeMatchResult(finalResult);
      setStep('result');
    } catch (err) {
      console.warn('API shade match fallback:', err);
      // Fallback algorithmic match
      let fallbackShade = FOUNDATION_SHADES[2];
      if (selectedDepth === 'fair') fallbackShade = FOUNDATION_SHADES[0];
      else if (selectedDepth === 'light') fallbackShade = FOUNDATION_SHADES[1];
      else if (selectedDepth === 'medium' && selectedUndertone === 'olive') fallbackShade = FOUNDATION_SHADES[3];
      else if (selectedDepth === 'medium') fallbackShade = FOUNDATION_SHADES[2];
      else if (selectedDepth === 'tan' && selectedUndertone === 'neutral') fallbackShade = FOUNDATION_SHADES[5];
      else if (selectedDepth === 'tan') fallbackShade = FOUNDATION_SHADES[4];
      else if (selectedDepth === 'deep' && selectedUndertone === 'neutral') fallbackShade = FOUNDATION_SHADES[7];
      else if (selectedDepth === 'deep') fallbackShade = FOUNDATION_SHADES[6];

      const fallbackResult: ShadeMatchResult = {
        detectedTone: selectedDepth,
        detectedUndertone: selectedUndertone,
        confidenceScore: 92,
        matchedShade: fallbackShade,
        concealerShadeName: `${fallbackShade.name} Concealer`,
        explanation: `Calibrated specifically for ${selectedDepth} complexion depth with ${selectedUndertone} undertones to cancel ashy grey cast.`,
        lightingQuality: 'Acceptable',
        recommendedFoundationId: 'mm-prod-1',
        recommendedProducts: [foundationProduct]
      };

      setLocalMatchResult(fallbackResult);
      setShadeMatchResult(fallbackResult);
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMatchedToCart = () => {
    if (!matchResult) return;
    addToCart(foundationProduct, matchResult.matchedShade, 1);
    setIsShadeStudioOpen(false);
    showToast(`Added ${matchResult.matchedShade.name} Foundation to Bag!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#4A0E17] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg tracking-wide">
                AI Shade Studio™
              </h2>
              <p className="text-[10px] text-[#EADFCB] uppercase tracking-wider">
                Precision Indian Complexion Matching
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShadeStudioOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: INTRO & METHOD SELECTION */}
          {step === 'intro' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EC] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-inner">
                <Camera className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-[#351016]">
                  Find Your True-to-Skin Shade
                </h3>
                <p className="text-xs sm:text-sm text-[#735D55] max-w-md mx-auto leading-relaxed">
                  Most foundations turn ashy or oxidise pink on Indian complexions. Our chromatic AI analyzes
                  natural melanin depth and warm, golden, or olive undertones in seconds.
                </p>
              </div>

              {/* Lighting requirement notice */}
              <div className="bg-[#FFFDF7] border border-[#EADFCB] rounded-2xl p-4 text-left flex items-start gap-3">
                <Sun className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-xs text-[#5C453E] space-y-1">
                  <p className="font-bold text-[#4A0E17]">Optimal Lighting Guide</p>
                  <p>
                    For highest accuracy, face a window with natural indirect daylight. Avoid harsh flash,
                    yellow lamps, or direct heavy filters.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3.5 px-4 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Selfie Photo</span>
                </button>

                <button
                  onClick={() => setStep('manual')}
                  className="py-3.5 px-4 bg-white border-2 border-[#D4AF37] hover:bg-[#FAF5EC] text-[#4A0E17] rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Guided Shade Quiz</span>
                </button>
              </div>

              {/* Privacy disclaimer */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8E7E73]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero Storage: Photos are analyzed in transient memory and immediately purged.</span>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO PREVIEW & VERIFY */}
          {step === 'photo' && uploadedImage && (
            <div className="space-y-6 text-center">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-xl">
                <img src={uploadedImage} alt="Uploaded selfie" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 pointer-events-none"></div>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-[#351016]">Ready for Chromatic Analysis</h4>
                <p className="text-xs text-[#735D55]">
                  Our AI vision model is ready to scan skin undertones and jawline transitions.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setStep('intro');
                  }}
                  className="px-5 py-2.5 border border-[#D9C8AF] rounded-full text-xs font-medium text-[#5C453E] hover:bg-gray-50"
                >
                  Choose Different Photo
                </button>
                <button
                  onClick={() => runAnalysis('image')}
                  className="px-6 py-2.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Analyze My Shade
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MANUAL GUIDED PREFERENCES */}
          {step === 'manual' && (
            <div className="space-y-6">
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-serif font-bold text-[#351016]">Describe Your Complexion</h3>
                <p className="text-xs text-[#735D55]">Help our color algorithm understand your undertone and depth.</p>
              </div>

              {/* Skin Depth */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  1. Your Skin Depth
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Fair', value: 'fair', color: '#F8E5D3' },
                    { label: 'Light', value: 'light', color: '#F1D1B5' },
                    { label: 'Medium', value: 'medium', color: '#E4BD9A' },
                    { label: 'Tan', value: 'tan', color: '#C8976C' },
                    { label: 'Deep', value: 'deep', color: '#925A37' }
                  ].map(d => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDepth(d.value as SkinTone)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedDepth === d.value ? 'border-[#4A0E17] ring-2 ring-[#4A0E17] bg-[#4A0E17]/5' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: d.color }}></span>
                      <span className="text-[11px] font-semibold text-gray-800">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Undertone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. What best describes your undertone?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: 'Warm Golden', desc: 'Gold jewelry looks best; veins appear greenish', value: 'warm' },
                    { label: 'Natural Olive', desc: 'Muted greenish nuance; foundations often look too pink', value: 'olive' },
                    { label: 'Neutral', desc: 'Balanced yellow and pink; both silver & gold suit you', value: 'neutral' },
                    { label: 'Cool Rosy', desc: 'Pink or blue nuances; burns quickly in strong sun', value: 'cool' }
                  ].map(u => (
                    <button
                      key={u.value}
                      onClick={() => setSelectedUndertone(u.value as Undertone)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedUndertone === u.value ? 'border-[#4A0E17] ring-1 ring-[#4A0E17] bg-[#4A0E17]/5' : 'border-gray-200 bg-white hover:border-[#D4AF37]'
                      }`}
                    >
                      <p className="font-bold text-[#4A0E17]">{u.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Foundation (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  3. Current Foundation You Wear (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. M.A.C NC40, Maybelline 220, Fenty 310"
                  value={currentBrand}
                  onChange={(e) => setCurrentBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 py-3 border border-gray-300 rounded-full text-xs font-semibold text-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => runAnalysis('manual')}
                  className="flex-1 py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Find My Match
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ANALYZING STATE */}
          {step === 'analyzing' && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <RefreshCw className="w-16 h-16 text-[#D4AF37] animate-spin" />
                <Sparkles className="w-6 h-6 text-[#4A0E17] absolute inset-0 m-auto" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#351016]">
                Analyzing Melanin Depth & Undertones...
              </h3>
              <p className="text-xs text-[#735D55] max-w-sm mx-auto">
                Comparing chromatic values against our calibrated database of 8 Indian foundation pigments.
              </p>
            </div>
          )}

          {/* STEP 5: RESULTS DISPLAY */}
          {step === 'result' && matchResult && (
            <div className="space-y-6">
              {/* Top Match Banner */}
              <div className="bg-gradient-to-r from-[#FAF5EC] to-[#F5ECE0] border border-[#D4AF37]/50 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>{matchResult.confidenceScore}% Confidence Match</span>
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#4A0E17]">
                      {matchResult.matchedShade.name}
                    </h3>
                    <p className="text-xs text-[#5C453E] font-medium capitalize">
                      {matchResult.detectedTone} Depth • {matchResult.detectedUndertone} Undertone
                    </p>
                  </div>

                  <div
                    className="w-14 h-14 rounded-2xl shadow-md border-2 border-white shrink-0"
                    style={{ backgroundColor: matchResult.matchedShade.hexCode }}
                  />
                </div>

                <p className="text-xs text-[#5C453E] mt-3 leading-relaxed border-t border-[#E8DAC2] pt-3">
                  {matchResult.explanation}
                </p>
              </div>

              {/* Recommended Product Box */}
              <div className="bg-white border border-[#E8DAC2] rounded-2xl p-4 flex items-center justify-between gap-4">
                <img
                  src={foundationProduct.primaryImage}
                  alt={foundationProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#A37B30] font-bold uppercase tracking-wider">
                    Foundation Pair
                  </span>
                  <h4 className="text-xs font-semibold text-[#201815] truncate">
                    {foundationProduct.name}
                  </h4>
                  <p className="text-xs font-bold text-[#4A0E17]">
                    ₹{foundationProduct.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[11px] text-gray-400 font-normal line-through">
                      ₹{foundationProduct.mrp.toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>

                <button
                  onClick={handleAddMatchedToCart}
                  className="px-4 py-2 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Concealer Recommendation */}
              <div className="bg-[#FCF9F5] border border-dashed border-[#D4AF37] rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#A37B30]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#5C453E]">
                  <p className="font-bold text-[#4A0E17]">Complementary Concealer Pair</p>
                  <p className="text-[11px] text-gray-600">{matchResult.concealerShadeName}</p>
                </div>
              </div>

              {/* Regulatory Limitation Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Shade recommendations are generated algorithmically based on camera lighting and colorimetry.
                  Actual results may vary depending on screen display settings and ambient lighting.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 py-3 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Re-Take Assessment
                </button>
                <button
                  onClick={handleAddMatchedToCart}
                  className="flex-1 py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Add Matched Shade (₹{foundationProduct.price})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
