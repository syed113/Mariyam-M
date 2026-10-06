import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const { login, register, showToast } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back to Mariyam Maquillage', 'success');
      } else {
        await register(name, email, password, phone);
        showToast('Account created successfully. Welcome to Haute Beauté Indienne!', 'success');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setMode('login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="bg-[#4A0E17] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-serif font-bold text-lg">
                {mode === 'login' ? 'Customer Sign In' : 'Join Mariyam Atelier'}
              </h3>
              <p className="text-[10px] text-[#EADFCB]">
                {mode === 'login' ? 'Access your orders, shade match & trousseau' : 'Personalized shade calibration & VIP privileges'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Quick-Fill Demo Shortcuts */}
        <div className="bg-[#FAF5EC] border-b border-[#E8DAC2] p-3 text-[11px] text-[#5C453E] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#4A0E17] uppercase tracking-wider text-[10px]">Instant Sign-In:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('aanya.sharma@example.com', 'AanyaPass123!')}
              className="px-2.5 py-1.5 bg-white border border-[#D9C8AF] hover:border-[#4A0E17] rounded-lg text-left transition-all group"
            >
              <p className="font-semibold text-gray-900 group-hover:text-[#4A0E17] truncate">Aanya (Customer)</p>
              <p className="text-[9px] text-gray-500">Royal Tier VIP</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@mariyam.com', 'MariyamAdmin2026!')}
              className="px-2.5 py-1.5 bg-white border border-[#D9C8AF] hover:border-[#4A0E17] rounded-lg text-left transition-all group"
            >
              <p className="font-semibold text-gray-900 group-hover:text-[#4A0E17] truncate">Store Admin</p>
              <p className="text-[9px] text-emerald-700 font-semibold">Full Ops Access</p>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C8AF] rounded-xl focus:outline-none focus:border-[#4A0E17]"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Number (+91)</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="98200 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C8AF] rounded-xl focus:outline-none focus:border-[#4A0E17]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C8AF] rounded-xl focus:outline-none focus:border-[#4A0E17]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C8AF] rounded-xl focus:outline-none focus:border-[#4A0E17]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Customer Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-gray-600">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-[#4A0E17] font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-[#4A0E17] font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
