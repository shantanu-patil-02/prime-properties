import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShieldCheck, Award, Building2, Sparkles, CheckCircle2, ChevronRight, ChevronUp } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import SEOHead from '../components/SEOHead';
import { Property, Blog } from '../types';

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Inquiry form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    inquiryType: 'Schedule Viewing',
    message: '',
    privacyConsent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [propRes, blogRes] = await Promise.all([
          axios.get('/api/properties?featured=true'),
          axios.get('/api/blogs')
        ]);
        const propList = Array.isArray(propRes.data) ? propRes.data : (propRes.data?.data || []);
        const blogList = Array.isArray(blogRes.data) ? blogRes.data : (blogRes.data?.data || []);
        setFeaturedProperties(propList.slice(0, 3));
        setLatestBlogs(blogList.slice(0, 2));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      setSubmitError('Please accept the privacy and confidentiality consent to proceed.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await axios.post('/api/inquiries', formData);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: 'Mumbai',
        inquiryType: 'Schedule Viewing',
        message: '',
        privacyConsent: false,
      });
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Prime Properties — Ultra-Luxury Flats & Houses Mumbai & Pune"
        description="Discover exclusive ultra-luxury flats, sea-facing penthouses, and private estates for rent and sale in Mumbai and Pune with Prime Properties. Inquire today."
      />
      <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1A1816]">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_mumbai_pune_1792781619397.jpg"
            alt="Luxury Mumbai & Pune Real Estate"
            className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-10000 ease-out hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-[#1A1816]/60 to-transparent" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-20">
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#F4E8C1] tracking-widest uppercase shadow-lg shadow-[#D4AF37]/10 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Mumbai & Pune Luxury Real Estate Brokerage</span>
          </div>

          <h1 className="animate-fade-in-up animate-delay-100 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white text-balance leading-tight">
            Brokering Elite Flats <span className="text-[#D4AF37] italic font-normal">& Luxury Houses</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-200 max-w-2xl mx-auto text-base sm:text-lg text-[#FAF8F5]/85 font-light leading-relaxed">
            Your premier luxury brokerage for high-value flats for rent, flats for outright sale, independent houses, and penthouses across Worli, Bandra, and Koregaon Park.
          </p>

          <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-[#1A1816] font-bold rounded-lg hover:bg-[#F4E8C1] hover:shadow-xl hover:shadow-[#D4AF37]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group"
            >
              <span>Explore Exclusive Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a
              href="#inquiry"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold rounded-lg hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Schedule Private Consultation</span>
            </a>
          </div>

          {/* Luxury Animated Scroll Down Indicator */}
          <div className="pt-8 flex justify-center">
            <a
              href="#statistics"
              aria-label="Scroll to statistics"
              className="inline-flex flex-col items-center gap-2 text-white/50 hover:text-[#D4AF37] transition-colors group"
            >
              <span className="text-[10px] tracking-widest uppercase font-semibold text-white/60 group-hover:text-[#D4AF37] transition-colors">Scroll to Discover</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-[#D4AF37] flex items-start justify-center p-1.5 transition-colors">
                <div className="w-1.5 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <RevealOnScroll>
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-2xl p-8 sm:p-12 space-y-8 luxury-card-hover">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Private Consultation</span>
              <h2 className="font-serif text-3xl font-bold text-[#2C2825]">Connect With Our Managing Directors</h2>
              <p className="text-sm text-[#78716C]">Complete the secure form below to schedule a private viewing or portfolio consultation.</p>
            </div>

            {submitSuccess ? (
              <div className="bg-[#F2EFE9] border border-[#D4AF37] p-8 rounded-xl text-center space-y-4 animate-fade-in-up">
                <div className="w-12 h-12 bg-[#D4AF37] text-[#1A1816] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Inquiry Received Successfully</h3>
                <p className="text-sm text-[#78716C]">
                  Thank you. Our senior advisory desk has received your inquiry and will contact you within 2 hours. Notification sent to authorized administration.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-[#2C2825] text-white text-xs font-semibold rounded-md hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all hover:shadow-md"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md animate-fade-in-up">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Shantanu patil"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Email Address </label>
                    <input
                      type="email"
                      
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Shantanu@example.com"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Preferred City </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Other">Other / Global</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Inquiry Type </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="Schedule Viewing">Schedule Viewing</option>
                      <option value="Pricing Details">Pricing Details</option>
                      <option value="Virtual Tour">Virtual Tour</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Message or Specific Requirements </label>
                  <textarea
                    
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify your requirements, preferred viewing dates, or property interest..."
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAF8F5] border border-[#D4AF37]/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="homePrivacyConsent"
                    required
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-[#D4AF37] text-[#2C2825] focus:ring-[#D4AF37] accent-[#2C2825] cursor-pointer"
                  />
                  <label htmlFor="homePrivacyConsent" className="text-xs text-[#78716C] leading-relaxed cursor-pointer select-none">
                    I consent to Prime Properties securely processing my contact information for confidential advisory communications in accordance with the luxury brokerage privacy guidelines. *
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[#78716C]">Your data is protected under our strict client confidentiality protocol.</span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 bg-[#2C2825] text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#2C2825] hover:shadow-xl hover:shadow-[#D4AF37]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Inquiry...' : 'Submit Confidential Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </section>

      {/* Animated / Labeled Statistic Counters Section */}
      <section id="statistics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <RevealOnScroll>
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xl p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#F2EFE9] luxury-card-hover">
            <div className="space-y-2 pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2825] block">
                <AnimatedCounter end={2500} prefix="₹" suffix="+ Cr" />
              </span>
              <span className="block text-xs uppercase tracking-wider text-[#78716C] font-medium">Portfolio Volume <span className="text-[#D4AF37] font-semibold">(DEMO FIGURE)</span></span>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2825] block">
                <AnimatedCounter end={250} suffix="+" />
              </span>
              <span className="block text-xs uppercase tracking-wider text-[#78716C] font-medium">Landmark Sales <span className="text-[#D4AF37] font-semibold">(DEMO FIGURE)</span></span>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2825] block">
                <AnimatedCounter end={1200} suffix="+" />
              </span>
              <span className="block text-xs uppercase tracking-wider text-[#78716C] font-medium">Satisfied UHNW Clients <span className="text-[#D4AF37] font-semibold">(DEMO FIGURE)</span></span>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2825] block">
                <AnimatedCounter end={18} suffix=" Yrs" />
              </span>
              <span className="block text-xs uppercase tracking-wider text-[#78716C] font-medium">Market Leadership</span>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Exclusive Residences</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2825]">Featured Portfolio</h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2C2825] hover:text-[#D4AF37] transition-colors group"
            >
              <span>View All Properties</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </RevealOnScroll>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-[#F2EFE9]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, idx) => (
              <RevealOnScroll key={property._id} delay={idx * 150}>
                <PropertyCard property={property} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Prime Properties */}
      <section className="bg-[#F2EFE9]/60 py-20 border-y border-[#D4AF37]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Uncompromising Standards</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2825]">Why Discerning Buyers Choose Prime Properties</h2>
              <p className="text-[#78716C] text-base">We provide absolute confidentiality, rigorous title due diligence, and bespoke advisory for Mumbai and Pune's elite real estate market.</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll delay={100}>
              <div className="luxury-card-hover group bg-white p-8 rounded-xl border border-[#D4AF37]/20 shadow-sm space-y-4 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C2825] group-hover:text-[#D4AF37] transition-colors duration-300">Absolute Discretion</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">
                  We handle off-market transactions and high-net-worth acquisitions with stringent privacy protocols and verified legal titles.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="luxury-card-hover group bg-white p-8 rounded-xl border border-[#D4AF37]/20 shadow-sm space-y-4 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C2825] group-hover:text-[#D4AF37] transition-colors duration-300">Unmatched Expertise</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">
                  Deep-rooted relationships with premier developers, architectural studios, and private owners across Worli, Bandra, and Koregaon Park.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="luxury-card-hover group bg-white p-8 rounded-xl border border-[#D4AF37]/20 shadow-sm space-y-4 h-full">
                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2C2825] group-hover:text-[#D4AF37] transition-colors duration-300">Bespoke Advisory</h3>
                <p className="text-sm text-[#78716C] leading-relaxed">
                  Tailored portfolio management, interior curation recommendations, and end-to-end transaction facilitation.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Customer Experience / Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="bg-[#1A1816] text-[#FAF8F5] rounded-2xl p-8 sm:p-16 border border-[#D4AF37]/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
            <div className="max-w-3xl space-y-8 relative z-10">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Client Testimonial</span>
              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-snug font-normal text-white italic">
                "Prime Properties navigated our acquisition of a Worli sea-facing duplex with immaculate precision and complete confidentiality. Their market insight is truly unparalleled."
              </blockquote>
              <div>
                <strong className="text-white font-serif text-lg block">Shantanu patil</strong>
                <span className="text-xs text-[#78716C]">Managing Director, Prime Properties </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Latest Insights / Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Editorial & Intelligence</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2825]">Latest Market Insights</h2>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2C2825] hover:text-[#D4AF37] transition-colors group"
            >
              <span>Read All Articles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestBlogs.map((blog, idx) => (
            <RevealOnScroll key={blog._id} delay={idx * 150}>
              <Link
                to={`/blogs`}
                className="luxury-card-hover group bg-white rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-sm flex flex-col sm:flex-row h-full"
              >
                <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#F2EFE9]">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#78716C]">
                      <span>{blog.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#2C2825] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#D4AF37] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 bg-[#2C2825] text-[#D4AF37] rounded-full border border-[#D4AF37]/40 shadow-2xl hover:bg-[#D4AF37] hover:text-[#1A1816] hover:scale-110 active:scale-95 transition-all duration-300 animate-fade-in-up"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
    </>
  );
}
