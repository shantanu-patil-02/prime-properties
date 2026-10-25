import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    inquiryType: 'General Inquiry',
    message: '',
    privacyConsent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      setError('Please provide privacy and confidentiality consent to submit your message.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/api/inquiries', formData);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: 'Mumbai',
        inquiryType: 'General Inquiry',
        message: '',
        privacyConsent: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Advisory Desk</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2825]">Contact Prime Properties</h1>
        <p className="text-[#78716C] text-base">Connect with our flagship advisory offices in Mumbai and Pune for confidential real estate consultations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Office Locations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-8 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">Mumbai Flagship Office</h3>
            <div className="space-y-3 text-sm text-[#78716C]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <span>Worli Seaface, The Imperial Tower, Level 34, Mumbai 400018</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 22 6622 8888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>mumbai@primeproperties.in</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-8 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">Pune Advisory Desk</h3>
            <div className="space-y-3 text-sm text-[#78716C]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <span>Koregaon Park North, Lane 7, Pune 411001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 20 6600 9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>pune@primeproperties.in</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1816] text-white p-6 rounded-xl border border-[#D4AF37]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
              <strong className="font-serif">Confidentiality Guarantee</strong>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              All discussions, client profiles, and acquisition requirements are protected under rigorous non-disclosure and privacy protocols.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 shadow-xl p-8 sm:p-12 space-y-8">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Send a Direct Message</h3>
              <p className="text-sm text-[#78716C]">Our managing directors review all inquiries within two hours.</p>
            </div>

            {submitSuccess ? (
              <div className="bg-[#F2EFE9] p-8 rounded-xl text-center space-y-4 border border-[#D4AF37]">
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto" />
                <h4 className="font-serif text-2xl font-bold text-[#2C2825]">Message Received</h4>
                <p className="text-sm text-[#78716C]">Thank you for contacting Prime Properties. Our advisory team will reach out to you shortly.</p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-[#2C2825] text-white text-xs font-semibold rounded-md hover:bg-[#D4AF37] hover:text-[#1A1816]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    {error}
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
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Shantanu@example.com"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
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
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Preferred City *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Inquiry Type *</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Schedule Viewing">Schedule Viewing</option>
                      <option value="List Property">List a Property</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message or inquiry details..."
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border border-[#D4AF37]/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="contactPrivacyConsent"
                    required
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-[#D4AF37] text-[#2C2825] focus:ring-[#D4AF37] accent-[#2C2825] cursor-pointer"
                  />
                  <label htmlFor="contactPrivacyConsent" className="text-xs text-[#78716C] leading-relaxed cursor-pointer select-none">
                    I agree to allow Prime Properties to contact me and retain my information under the Client Confidentiality Protocol for this luxury property inquiry. *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#2C2825] text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#2C2825] transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Sending Message...' : 'Send Confidential Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
