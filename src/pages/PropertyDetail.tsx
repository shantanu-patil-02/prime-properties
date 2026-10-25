import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Bed, Bath, Square, CheckCircle2, ArrowLeft, ShieldCheck, Phone, Mail } from 'lucide-react';
import { Property } from '../types';
import SEOHead from '../components/SEOHead';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Inquiry form
  const [inquiryData, setInquiryData] = useState({
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
    async function fetchProperty() {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data?.data || res.data);
      } catch (err) {
        console.error('Error fetching property detail:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryData.privacyConsent) {
      setSubmitError('Please consent to the privacy & confidentiality terms.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await axios.post('/api/inquiries', {
        ...inquiryData,
        city: property?.city || inquiryData.city,
        propertyRef: property?._id,
        propertyTitle: property?.title,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-white rounded-2xl" />
          <div className="h-10 bg-white w-1/2 rounded" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#2C2825]">Property Not Found</h2>
        <p className="text-[#78716C]">The property you are looking for may have been removed or is no longer listed.</p>
        <Link to="/properties" className="inline-block px-6 py-3 bg-[#2C2825] text-white rounded-lg text-xs font-semibold">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const propertyLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      businessFunction: property.purpose === 'rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <SEOHead
        title={`${property.title} | Prime Properties`}
        description={property.description.slice(0, 155)}
        ogImage={property.images[0]}
        jsonLd={propertyLd}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link to="/properties" className="inline-flex items-center gap-2 text-xs font-semibold text-[#78716C] hover:text-[#2C2825] transition-colors">
        <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
        <span>Back to Portfolio</span>
      </Link>

      {/* Header & Price */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {property.purpose === 'rent' ? (
              <span className="bg-[#D4AF37] text-[#1A1816] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
                FOR RENT / LEASE
              </span>
            ) : (
              <span className="bg-[#1A1816] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border border-[#D4AF37]/40 shadow">
                FOR OUTRIGHT SALE
              </span>
            )}
            <span className="bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#2C2825] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
              {property.propertyType}
            </span>
            <span className="bg-[#2C2825] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
              {property.city}
            </span>
            <span className="text-xs text-[#78716C] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {property.location}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2825]">{property.title}</h1>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs uppercase tracking-wider text-[#78716C] block">
            {property.purpose === 'rent' ? 'Monthly Rental' : 'Sale Consideration'}
          </span>
          <span className="font-serif text-4xl font-bold text-[#2C2825]">{property.priceDisplay}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#F2EFE9] border border-[#D4AF37]/30 shadow-lg">
          <img
            src={property.images[activeImageIndex] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {property.images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Details & Amenities */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specs Bar */}
          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-6 shadow-sm grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <Bed className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <span className="text-xs uppercase text-[#78716C] block">Bedrooms</span>
              <strong className="font-serif text-2xl font-bold text-[#2C2825]">{property.bedrooms}</strong>
            </div>
            <div className="space-y-1 border-x border-[#F2EFE9]">
              <Bath className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <span className="text-xs uppercase text-[#78716C] block">Bathrooms</span>
              <strong className="font-serif text-2xl font-bold text-[#2C2825]">{property.bathrooms}</strong>
            </div>
            <div className="space-y-1">
              <Square className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <span className="text-xs uppercase text-[#78716C] block">Area</span>
              <strong className="font-serif text-2xl font-bold text-[#2C2825]">{property.areaSqFt.toLocaleString()} sq.ft.</strong>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-8 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Residence Overview</h2>
            <p className="text-[#78716C] leading-relaxed text-base whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-8 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#2C2825]">Amenities & Distinctive Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAF8F5] p-3.5 rounded-lg border border-[#D4AF37]/20">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <span className="text-sm font-medium text-[#2C2825]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Inquiry & Scheduling Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-8 shadow-xl sticky top-24 space-y-6">
            <div className="space-y-2 border-b border-[#F2EFE9] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">Schedule Private Viewing</h3>
              <p className="text-xs text-[#78716C]">Connect with our managing director for confidential property access.</p>
            </div>

            {submitSuccess ? (
              <div className="bg-[#F2EFE9] p-6 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h4 className="font-serif font-bold text-[#2C2825]">Viewing Requested</h4>
                <p className="text-xs text-[#78716C]">We will contact you shortly to coordinate your private visit.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryData.fullName}
                    onChange={(e) => setInquiryData({ ...inquiryData, fullName: e.target.value })}
                    placeholder="Shantanu Patil"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    placeholder="Shantanu@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    placeholder="+91 98200 12345"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">Inquiry Type *</label>
                  <select
                    value={inquiryData.inquiryType}
                    onChange={(e) => setInquiryData({ ...inquiryData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825]"
                  >
                    <option value="Schedule Viewing">Schedule Viewing</option>
                    <option value="Pricing Details">Pricing Details</option>
                    <option value="Virtual Tour">Virtual Tour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    placeholder="Please let us know your preferred viewing date..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825]"
                  />
                </div>
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {submitError}
                  </div>
                )}

                <div className="flex items-start gap-2.5 p-2.5 bg-[#FAF8F5] border border-[#D4AF37]/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="detailPrivacyConsent"
                    required
                    checked={inquiryData.privacyConsent}
                    onChange={(e) => setInquiryData({ ...inquiryData, privacyConsent: e.target.checked })}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-[#D4AF37] text-[#2C2825] focus:ring-[#D4AF37] accent-[#2C2825] cursor-pointer"
                  />
                  <label htmlFor="detailPrivacyConsent" className="text-[11px] text-[#78716C] leading-snug cursor-pointer select-none">
                    I consent to Prime Properties contacting me regarding this residence. *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#2C2825] text-white font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-[#2C2825] transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Private Viewing'}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[#F2EFE9] space-y-2 text-xs text-[#78716C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Strict Client Confidentiality Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Direct Advisory Desk: +91 98200 00000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
