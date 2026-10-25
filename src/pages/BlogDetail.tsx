import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  Shield,
  Building2,
  Sparkles,
  Phone,
  Mail,
  Send,
  BookOpen,
} from 'lucide-react';
import { Blog, Property } from '../types';
import SEOHead from '../components/SEOHead';
import PropertyCard from '../components/PropertyCard';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticleData() {
      setLoading(true);
      try {
        const [blogRes, propsRes] = await Promise.all([
          axios.get(`/api/blogs/${slug}`),
          axios.get('/api/properties?limit=3'),
        ]);
        setBlog(blogRes.data);
        const propsData = propsRes.data?.data || propsRes.data || [];
        setRelatedProperties(propsData.slice(0, 2));
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadArticleData();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const text = blog ? `${blog.title} — Prime Properties Intelligence` : 'Prime Properties';

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-[#F2EFE9] rounded" />
        <div className="h-12 bg-[#F2EFE9] rounded w-3/4" />
        <div className="h-96 bg-[#F2EFE9] rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 bg-[#F2EFE9] rounded w-full" />
          <div className="h-4 bg-[#F2EFE9] rounded w-5/6" />
          <div className="h-4 bg-[#F2EFE9] rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-[#2C2825]">Intelligence Briefing Not Found</h1>
        <p className="text-[#78716C]">The requested luxury market report may have been archived or updated.</p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2825] text-white rounded font-medium hover:bg-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Intelligence Reports</span>
        </Link>
      </div>
    );
  }

  // Schema.org BlogPosting
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prime Properties',
      logo: {
        '@type': 'ImageObject',
        url: 'https://primeproperties.in/src/assets/images/hero_luxury_mumbai_pune_1792781619397.jpg',
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  };

  return (
    <>
      <SEOHead
        title={`${blog.title} | Prime Properties Intelligence`}
        description={blog.excerpt}
        ogImage={blog.coverImage}
        ogType="article"
        jsonLd={articleSchema}
      />

      <article className="min-h-screen py-10 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-[#78716C] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            <Link to="/blogs" className="hover:text-[#D4AF37] transition-colors">Market Insights</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#2C2825] font-semibold truncate max-w-[200px] sm:max-w-xs">{blog.category}</span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#C5A059] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-wider rounded">
                {blog.category}
              </span>
              {blog.readTime && (
                <span className="flex items-center gap-1.5 text-xs text-[#78716C]">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {blog.readTime}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2825] leading-tight">
              {blog.title}
            </h1>

            <p className="text-lg sm:text-xl text-[#78716C] font-light leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Author Attribution & Share Toolbar */}
            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2C2825] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-sm">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2825]">{blog.author}</p>
                  <p className="text-xs text-[#78716C]">Prime Properties Advisory & Research</p>
                </div>
              </div>

              {/* Social Share Toolbar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#78716C] mr-1 hidden sm:inline">Share:</span>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded bg-white border border-[#D4AF37]/30 text-[#2C2825] hover:bg-[#FAF8F5] transition-colors relative"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#78716C]" />}
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2C2825] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="px-2.5 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors"
                  title="Share via WhatsApp"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="px-2.5 py-1.5 rounded bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-medium transition-colors"
                  title="Share on LinkedIn"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="px-2.5 py-1.5 rounded bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#2C2825] hover:bg-[#F2EFE9] text-xs font-medium transition-colors"
                  title="Share on X"
                >
                  X
                </button>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/30">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 text-white/80 text-xs tracking-wider uppercase font-medium">
              Prime Properties Strategic Intelligence • Maharashtra Luxury Corridors
            </div>
          </div>

          {/* Formatted Article Body */}
          <div className="prose prose-stone max-w-none space-y-6 text-[#2C2825] leading-relaxed text-base sm:text-lg">
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825] mt-8 mb-4 border-b border-[#D4AF37]/20 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={index} className="space-y-2 my-4 pl-4 border-l-2 border-[#D4AF37]">
                    {items.map((item, i) => (
                      <li key={i} className="text-[#2C2825] pl-2 text-base">
                        {item.replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-[#3D3833] leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Private Advisory Consultation Box */}
          <div className="my-12 p-8 bg-gradient-to-br from-[#2C2825] to-[#1A1816] text-[#FAF8F5] rounded-2xl border border-[#D4AF37]/40 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Private Advisory Consultation
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Seek Confidential Guidance on Mumbai & Pune Luxury Real Estate?
              </h3>
              <p className="text-sm text-[#FAF8F5]/80 max-w-2xl">
                Whether you are evaluating long-term lease returns on a sea-facing flat or seeking an off-market independent bungalow in Koregaon Park, connect directly with our Managing Director.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                className="px-6 py-3 bg-[#D4AF37] text-[#1A1816] font-semibold text-sm rounded hover:bg-[#e0bc43] transition-colors inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Schedule Confidential Briefing</span>
              </Link>
              <a
                href="tel:+919820000000"
                className="px-6 py-3 bg-white/10 text-white font-medium text-sm rounded border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+91 98200 00000</span>
              </a>
            </div>
          </div>

          {/* Related Properties in this Segment */}
          {relatedProperties.length > 0 && (
            <div className="pt-10 border-t border-[#D4AF37]/20 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Featured Portfolio</span>
                  <h3 className="font-serif text-2xl font-bold text-[#2C2825]">Related Luxury Residences</h3>
                </div>
                <Link
                  to="/properties"
                  className="text-xs font-semibold text-[#D4AF37] hover:underline"
                >
                  View All Listings &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProperties.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            </div>
          )}

          {/* Back to Blogs */}
          <div className="pt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C2825] hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Intelligence Reports</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
