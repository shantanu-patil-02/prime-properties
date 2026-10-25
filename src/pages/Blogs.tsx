import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  User,
  Search,
  Filter,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Blog } from '../types';
import SEOHead from '../components/SEOHead';

const CATEGORIES = ['All', 'Market Trends', 'Architecture', 'Investment', 'Pune', 'Mumbai'];

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await axios.get('/api/blogs', { params });
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(() => {
      fetchBlogs();
    }, 200);

    return () => clearTimeout(timeout);
  }, [selectedCategory, searchQuery]);

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const secondaryBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <>
      <SEOHead
        title="Luxury Real Estate Insights & Market Intelligence | Prime Properties"
        description="Authoritative reports on luxury flat rental yields, bungalow acquisitions, and market trends across Mumbai and Pune's elite residential corridors."
        ogType="website"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-xs font-semibold uppercase tracking-widest text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Strategic Advisory & Market Intelligence</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2825]">
            Maharashtra Luxury Property Intelligence
          </h1>
          <p className="text-[#78716C] text-base sm:text-lg">
            Empirical data, micro-market rental yields, and legal frameworks for ultra-high-net-worth investors across Mumbai and Pune.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2C2825] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#78716C] hover:bg-[#F2EFE9] hover:text-[#2C2825]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports or corridors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-xs text-[#2C2825] placeholder-[#78716C] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#2C2825]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-[#F2EFE9]" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-16 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">No Matching Intelligence Briefings</h3>
            <p className="text-sm text-[#78716C]">Try adjusting your search criteria or explore our featured reports.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#2C2825] text-white text-xs font-semibold rounded hover:bg-[#D4AF37] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Insight Card (First article when no active search) */}
            {featuredBlog && (
              <div className="bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden relative">
                  <img
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#2C2825]/90 text-[#D4AF37] px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#D4AF37]/30">
                    Lead Editorial Report
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-[#78716C]">
                      <span className="bg-[#FAF8F5] border border-[#D4AF37]/30 px-2.5 py-1 rounded text-[#2C2825] font-semibold">
                        {featuredBlog.category}
                      </span>
                      {featuredBlog.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {featuredBlog.readTime}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {new Date(featuredBlog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2825] leading-snug group-hover:text-[#C5A059] transition-colors">
                      <Link to={`/blogs/${featuredBlog.slug}`}>
                        {featuredBlog.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-[#78716C] leading-relaxed line-clamp-4">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-[#78716C]">
                    <span className="flex items-center gap-1.5 font-medium text-[#2C2825]">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {featuredBlog.author}
                    </span>
                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="px-4 py-2 bg-[#2C2825] text-white rounded font-medium hover:bg-[#D4AF37] transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Read Briefing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Secondary Reports */}
            {secondaryBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-white rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <Link to={`/blogs/${blog.slug}`} className="block aspect-[16/10] overflow-hidden bg-[#F2EFE9]">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-[#78716C]">
                          <span className="bg-[#FAF8F5] border border-[#D4AF37]/30 px-2 py-0.5 rounded text-[#2C2825] font-semibold text-[11px]">
                            {blog.category}
                          </span>
                          {blog.readTime && (
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-[#D4AF37]" />
                              {blog.readTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-[#D4AF37]" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#2C2825] leading-snug group-hover:text-[#C5A059] transition-colors">
                          <Link to={`/blogs/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-[#78716C]">
                        <span className="flex items-center gap-1.5 font-medium text-[#2C2825] truncate max-w-[150px]">
                          <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span className="truncate">{blog.author}</span>
                        </span>
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="text-[#D4AF37] font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
