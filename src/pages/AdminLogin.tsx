import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('shantanupatil636@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/login', { email, password }, { withCredentials: true });
      if (res.data?.token) {
        localStorage.setItem('admin_token', res.data.token);
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#D4AF37]/30 shadow-2xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#1A1816] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2C2825]">Administrator Portal</h1>
          <p className="text-xs text-[#78716C]">
            Authorized Access Only<br />
            <strong className="text-[#2C2825]">shantanupatil636@gmail.com</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#78716C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">Administrator Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#78716C]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            {/* <p className="text-[11px] text-[#78716C] pt-1">Default development password: <code className="bg-[#FAF8F5] px-1 py-0.5 rounded border">PrimeAdmin@2026#</code></p> */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#2C2825] text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#2C2825] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Secure Admin Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
