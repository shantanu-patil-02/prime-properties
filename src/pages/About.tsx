import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, ShieldCheck, Building2, TrendingUp, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const inquiryTrendData = [
  { month: 'Jan', inquiries: 42 },
  { month: 'Feb', inquiries: 58 },
  { month: 'Mar', inquiries: 75 },
  { month: 'Apr', inquiries: 64 },
  { month: 'May', inquiries: 89 },
  { month: 'Jun', inquiries: 110 },
];

const cityDistributionData = [
  { name: 'Mumbai (Worli/Bandra)', value: 65 },
  { name: 'Pune (Koregaon Park)', value: 35 },
];

const COLORS = ['#D4AF37', '#2C2825'];

export default function About() {
  return (
    <>
      <SEOHead
        title="About Prime Properties — Premier Luxury Brokerage Mumbai & Pune"
        description="Learn about Prime Properties, the premier boutique luxury real estate brokerage advisory representing elite penthouses and estates across Maharashtra."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Established 2008</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2825] leading-tight">
            Redefining Luxury Real Estate in Mumbai & Pune
          </h1>
          <p className="text-[#78716C] leading-relaxed text-base">
            Prime Properties is India’s premier boutique real estate advisory firm. Founded by veteran luxury consultants, we represent the most coveted architectural penthouses, beachfront residences, and historic gated estates for global leaders, industrialists, and UHNWIs.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
              <span className="font-serif text-3xl font-bold text-[#2C2825]">₹2,500+ Cr</span>
              <span className="block text-xs uppercase text-[#78716C]">Total Managed Volume <span className="text-[#D4AF37] font-semibold">(DEMO)</span></span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/30 shadow-sm space-y-1">
              <span className="font-serif text-3xl font-bold text-[#2C2825]">250+</span>
              <span className="block text-xs uppercase text-[#78716C]">Exclusive Transactions <span className="text-[#D4AF37] font-semibold">(DEMO)</span></span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-xl">
          <img
            src="/src/assets/images/about_luxury_team_1792781620873.jpg"
            alt="Prime Properties Team"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Analytics & Charts Section (Recharts) */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Market Analytics</span>
          <h2 className="font-serif text-3xl font-bold text-[#2C2825]">Performance & Market Distribution</h2>
          <p className="text-sm text-[#78716C]">Insights into luxury buyer inquiry growth and regional portfolio distribution across Mumbai and Pune. <span className="text-[#D4AF37] font-medium">(Note: Based on development demo dataset).</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Monthly Inquiry Trends */}
          <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">Monthly UHNWI Inquiry Trends</h3>
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inquiryTrendData}>
                  <XAxis dataKey="month" stroke="#78716C" fontSize={12} />
                  <YAxis stroke="#78716C" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1816', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="inquiries" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: City Distribution */}
          <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">Portfolio City Distribution</h3>
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {cityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Standards */}
      <div className="bg-[#1A1816] text-[#FAF8F5] rounded-2xl p-10 sm:p-16 border border-[#D4AF37]/30 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Authorized Leadership</span>
          <h2 className="font-serif text-3xl font-bold text-white">Managed by Industry Veterans</h2>
          <p className="text-sm text-[#78716C]">Authorized Administrator: shantanupatil636@gmail.com. Dedicated to absolute transparency and legal due diligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-[#2C2825] p-8 rounded-xl border border-[#D4AF37]/20 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Title Verification</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">Every property undergoes rigorous legal screening by top tier real estate counsels before representation.</p>
          </div>
          <div className="bg-[#2C2825] p-8 rounded-xl border border-[#D4AF37]/20 space-y-3">
            <Users className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Confidential Desk</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">Direct one-on-one advisory for family offices, NRI investors, and corporate leaders.</p>
          </div>
          <div className="bg-[#2C2825] p-8 rounded-xl border border-[#D4AF37]/20 space-y-3">
            <Award className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Bespoke Curation</h3>
            <p className="text-xs text-[#78716C] leading-relaxed">Access to exclusive off-market penthouses not listed on public portals.</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
