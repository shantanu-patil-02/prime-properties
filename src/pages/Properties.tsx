import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Building2, Key, Home, Tag } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import SEOHead from '../components/SEOHead';
import { Property } from '../types';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [purposeFilter, setPurposeFilter] = useState('All'); // 'All' | 'sale' | 'rent'
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params: any = {};
        if (purposeFilter !== 'All') params.purpose = purposeFilter;
        if (cityFilter !== 'All') params.city = cityFilter;
        if (typeFilter !== 'All') params.type = typeFilter;
        if (searchQuery) params.search = searchQuery;

        const res = await axios.get('/api/properties', { params });
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setProperties(list);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [purposeFilter, cityFilter, typeFilter, searchQuery]);

  return (
    <>
      <SEOHead
        title="Luxury Flats for Rent & Houses for Sale | Mumbai & Pune Portfolio"
        description="Explore exclusive sea-facing flats for rent, luxury flats for sale, and independent houses in Worli, Bandra, Koregaon Park, and Boat Club Road."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Luxury Brokerage Portfolio</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2825]">Mumbai & Pune Verified Properties</h1>
        <p className="text-[#78716C] text-base">
          Specialized luxury brokerage for outright purchase and high-value leasing: luxury flats for rent, flats for sale, independent houses, penthouses, and private estates.
        </p>
      </div>

      {/* Primary Deal Filter Tabs (Sale vs Rent) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl shadow-sm gap-2">
          <button
            onClick={() => setPurposeFilter('All')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              purposeFilter === 'All'
                ? 'bg-[#2C2825] text-white shadow'
                : 'text-[#78716C] hover:text-[#2C2825]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>All Brokerage Deals</span>
          </button>
          <button
            onClick={() => setPurposeFilter('sale')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              purposeFilter === 'sale'
                ? 'bg-[#2C2825] text-white shadow'
                : 'text-[#78716C] hover:text-[#2C2825]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Flats & Houses for Sale</span>
          </button>
          <button
            onClick={() => setPurposeFilter('rent')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              purposeFilter === 'rent'
                ? 'bg-[#D4AF37] text-[#1A1816] font-bold shadow'
                : 'text-[#78716C] hover:text-[#2C2825]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Flats for Rent / Lease</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area (Worli, Bandra, Koregaon Park...)"
              className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] shrink-0">City:</span>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#D4AF37]/30 flex-1">
              {['All', 'Mumbai', 'Pune'].map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                    cityFilter === city ? 'bg-[#2C2825] text-white shadow-sm' : 'text-[#78716C] hover:text-[#2C2825]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] shrink-0">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
            >
              <option value="All">All Specific Properties</option>
              <option value="Flat">Flats (Sale / Rent)</option>
              <option value="House">Houses & Bungalows (Sale)</option>
              <option value="Penthouse">Sky Penthouses</option>
              <option value="Villa">Private Villas & Estates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-[#F2EFE9]" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D4AF37]/30 p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-[#D4AF37] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#2C2825]">No Matching Properties Found</h3>
          <p className="text-sm text-[#78716C]">
            Try adjusting your search criteria, selecting another city, or switching between "Flats for Rent" and "Flats & Houses for Sale".
          </p>
          <button
            onClick={() => {
              setPurposeFilter('All');
              setCityFilter('All');
              setTypeFilter('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#2C2825] text-white text-xs font-semibold rounded-md hover:bg-[#D4AF37] hover:text-[#1A1816] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
