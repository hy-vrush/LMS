import { Shield, User, ArrowRight, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface LandingPageProps {
  onSelectRole: (role: 'admin' | 'user') => void;
}

export function LandingPage({ onSelectRole }: LandingPageProps) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | null>(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleRoleSelect = (role: 'admin' | 'user') => {
    setSelectedRole(role);
    setError('');
    setCredentials({ email: '', password: '' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAdmin = selectedRole === 'admin' && credentials.email === 'admin' && credentials.password === 'admin123';
    const isUser = selectedRole === 'user' && credentials.email === 'user' && credentials.password === 'user123';

    if (isAdmin || isUser) {
      onSelectRole(selectedRole!);
      navigate(selectedRole === 'admin' ? '/admin' : '/user');
    } else {
      setError('Invalid credentials. Use admin/admin123 or user/user123.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              Next-Gen Learning
            </div>
            <h1 className="text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
              Sigma<br/><span className="text-blue-500">Learn</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            The ultimate meta-driven LMS. Automated course ingestion, seamless progress tracking, and professional-grade UI.
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                  {i}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-white font-bold">10k+</span>
              <span className="text-gray-500 ml-1">Students learning daily</span>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div 
                key="role-selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid gap-4"
              >
                <button 
                  onClick={() => handleRoleSelect('admin')}
                  className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
                      <Shield size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
                    <p className="text-gray-400 text-sm mb-6">Manage courses, upload folder structures, and configure global themes.</p>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest">
                      <span>Enter Portal</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleRoleSelect('user')}
                  className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <User size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white mb-4">
                      <User size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Student Area</h3>
                    <p className="text-gray-400 text-sm mb-6">Access your courses, track progress, and learn at your own pace.</p>
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-widest">
                      <span>Start Learning</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl"
              >
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2"
                >
                  <ChevronLeft size={14} />
                  <span>Back to roles</span>
                </button>

                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedRole === 'admin' ? 'Admin Login' : 'Student Login'}
                  </h3>
                  <p className="text-gray-400 text-sm">Enter your credentials to access the platform.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Username / Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="text"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder={selectedRole === 'admin' ? 'admin' : 'user'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs font-medium ml-1">{error}</p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] mt-4"
                  >
                    Sign In
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChevronLeft({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

