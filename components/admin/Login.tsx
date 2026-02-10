import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demonstration purposes only.
    // In a production environment, this should be replaced with a secure backend authentication call.
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-lg border border-luxury-gold/20 p-8 rounded-2xl w-full max-w-md shadow-gold-glow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Login</h1>
          <p className="text-white/60 text-sm">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-luxury-gold text-white font-bold py-3 rounded-lg hover:bg-luxury-golddark transition-all transform active:scale-95 shadow-lg uppercase tracking-wider"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
