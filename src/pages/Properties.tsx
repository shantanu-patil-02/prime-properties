import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Building2, Key, Home, Tag, IndianRupee, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
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

  // Price filters & sorting
  const [selectedPricePreset, setSelectedPricePreset] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default'); // 'default' | 'price-asc' | 'price-desc' | 'area-desc'
  const [showCustomPrice, setShowCustomPrice] = useState<boolean>(false);

  // Price presets dynamically tailored based on deal purpose
  const pricePresets = useMemo(() => {
    if (purposeFilter === 'rent') {
      return [
        { id: 'all', label: 'All Rental Budgets', min: '', max: '' },
        { id: 'rent-under-2l', label: 'Under ₹2 Lac/mo', min: '', max: '200000' },
        { id: 'rent-2l-4l', label: '₹2 Lac – ₹4 Lac/mo', min: '200000', max: '400000' },
        { id: 'rent-above-4l', label: 'Above ₹4 Lac/mo', min: '400000', max: '' },
      ];
    }
    if (purposeFilter === 'sale') {
      return [
        { id: 'all', label: 'All Sale Budgets', min: '', max: '' },
        { id: 'sale-under-25cr', label: 'Under ₹25 Cr', min: '', max: '250000000' },
        { id: 'sale-25cr-35cr', label: '₹25 Cr – ₹35 Cr', min: '250000000', max: '350000000' },
        { id: 'sale-above-35cr', label: 'Above ₹35 Cr', min: '350000000', max: '' },
      ];
    }
    return [
      { id: 'all', label: 'All Budgets', min: '', max: '' },
      { id: 'all-under-5cr', label: 'Under ₹5 Cr (Rentals & Entry)', min: '', max: '50000000' },
      { id: 'all-5cr-30cr', label: '₹5 Cr – ₹30 Cr', min: '50000000', max: '300000000' },
      { id: 'all-above-30cr', label: 'Above ₹30 Cr (Trophy Assets)', min: '300000000', max: '' },
    ];
  }, [purposeFilter]);

  // When purposeFilter changes, reset preset if not applicable
  const handlePurposeChange = (newPurpose: string) => {
    setPurposeFilter(newPurpose);
    setSelectedPricePreset('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPricePreset(presetId);
    const match = pricePresets.find((p) => p.id === presetId);
    if (match) {
      setMinPrice(match.min);
      setMaxPrice(match.max);
    }
  };

  const handleCustomPriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedPricePreset('custom');
  };

  const handleClearPrice = () => {
    setSelectedPricePreset('all');
    setMinPrice('');
    setMaxPrice('');
  };

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params: any = {};
        if (purposeFilter !== 'All') params.purpose = purposeFilter;
        if (cityFilter !== 'All') params.city = cityFilter;
        if (typeFilter !== 'All') params.type = typeFilter;
        if (searchQuery) params.search = searchQuery;
        if (minPrice) params.minPrice = Number(minPrice);
        if (maxPrice) params.maxPrice = Number(maxPrice);

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
  }, [purposeFilter, cityFilter, typeFilter, searchQuery, minPrice, maxPrice]);

  // Client-side sorting on retrieved properties
  const sortedProperties = useMemo(() => {
    const list = [...properties];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      list.sort((a, b) => (b.areaSqFt || 0) - (a.areaSqFt || 0));
    }
    return list;
  }, [properties, sortBy]);

  const activePriceLabel = useMemo(() => {
    if (selectedPricePreset !== 'all' && selectedPricePreset !== 'custom') {
      const match = pricePresets.find((p) => p.id === selectedPricePreset);
      return match ? match.label : null;
    }
    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) return `₹${Number(minPrice).toLocaleString('en-IN')} – ₹${Number(maxPrice).toLocaleString('en-IN')}`;
      if (minPrice) return `Min: ₹${Number(minPrice).toLocaleString('en-IN')}+`;
      if (maxPrice) return `Up to ₹${Number(maxPrice).toLocaleString('en-IN')}`;
    }
    return null;
  }, [selectedPricePreset, minPrice, maxPrice, pricePresets]);

  return (
    <>
      <SEOHead
        title="Luxury Flats for Rent & Houses for Sale | Mumbai & Pune Portfolio"
        description="Explore exclusive sea-facing flats for rent, luxury flats for sale, and independent houses in Worli, Bandra, Koregaon Park, and Boat Club Road."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">
            Luxury Brokerage Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2825]">
            Mumbai & Pune Verified Properties
          </h1>
          <p className="text-[#78716C] text-sm sm:text-base leading-relaxed">
            Specialized luxury brokerage for outright purchase and high-value leasing: luxury flats for rent, flats for sale, independent houses, penthouses, and private estates.
          </p>
        </div>

        {/* Primary Deal Filter Tabs (Sale vs Rent) */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap p-1.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl shadow-xs gap-1.5 sm:gap-2">
            <button
              onClick={() => handlePurposeChange('All')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                purposeFilter === 'All'
                  ? 'bg-[#2C2825] text-white shadow-xs'
                  : 'text-[#78716C] hover:text-[#2C2825]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>All Deals</span>
            </button>
            <button
              onClick={() => handlePurposeChange('sale')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                purposeFilter === 'sale'
                  ? 'bg-[#2C2825] text-white shadow-xs'
                  : 'text-[#78716C] hover:text-[#2C2825]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Flats & Houses for Sale</span>
            </button>
            <button
              onClick={() => handlePurposeChange('rent')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                purposeFilter === 'rent'
                  ? 'bg-[#D4AF37] text-[#1A1816] font-bold shadow-xs'
                  : 'text-[#78716C] hover:text-[#2C2825]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Flats for Rent / Lease</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-5 sm:p-6 shadow-sm space-y-6">
          {/* Row 1: Search, City, Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#78716C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area (Worli, Bandra, Koregaon Park...)"
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-sm text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] shrink-0">
                City:
              </span>
              <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#D4AF37]/30 flex-1">
                {['All', 'Mumbai', 'Pune'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      cityFilter === city
                        ? 'bg-[#2C2825] text-white shadow-xs'
                        : 'text-[#78716C] hover:text-[#2C2825]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] shrink-0">
                Type:
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-xl text-sm font-medium text-[#2C2825] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-2xs cursor-pointer"
              >
                <option value="All">All Property Formats</option>
                <option value="Flat">Flats (Sale / Rent)</option>
                <option value="House">Houses & Bungalows (Sale)</option>
                <option value="Penthouse">Sky Penthouses</option>
                <option value="Villa">Private Villas & Estates</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price Filter (Preset Brackets & Custom Range Inputs) */}
          <div className="pt-4 border-t border-[#F2EFE9] space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#D4AF37]/15 text-[#B38F27] flex items-center justify-center">
                  <IndianRupee className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C2825]">
                  Filter by Price Range:
                </span>
              </div>

              {/* Toggle custom input */}
              <button
                type="button"
                onClick={() => setShowCustomPrice(!showCustomPrice)}
                className="text-xs text-[#B38F27] hover:text-[#2C2825] font-semibold flex items-center gap-1.5 self-start lg:self-auto transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showCustomPrice ? 'Hide Custom Inputs' : 'Enter Custom Min/Max'}</span>
              </button>
            </div>

            {/* Quick Price Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {pricePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    selectedPricePreset === preset.id
                      ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#2C2825] border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#F2EFE9]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              {activePriceLabel && (
                <button
                  onClick={handleClearPrice}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#78716C] hover:text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
                  title="Clear price filter"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Price</span>
                </button>
              )}
            </div>

            {/* Custom Min / Max Price Inputs */}
            {showCustomPrice && (
              <form
                onSubmit={handleCustomPriceApply}
                className="p-4 bg-[#FAF8F5] rounded-xl border border-[#D4AF37]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end animate-in fade-in duration-200"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] mb-1">
                    Minimum Price (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-semibold">₹</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setSelectedPricePreset('custom');
                      }}
                      placeholder="e.g. 200000 or 250000000"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-[#D4AF37]/40 rounded-lg text-xs text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#78716C] mb-1">
                    Maximum Price (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#78716C] font-semibold">₹</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setSelectedPricePreset('custom');
                      }}
                      placeholder="e.g. 500000 or 450000000"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-[#D4AF37]/40 rounded-lg text-xs text-[#2C2825] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-[#2C2825] text-white rounded-lg text-xs font-semibold hover:bg-[#D4AF37] hover:text-[#1A1816] transition-colors"
                  >
                    Apply Price Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleClearPrice}
                    className="py-2 px-3 bg-[#F2EFE9] text-[#78716C] hover:text-[#2C2825] rounded-lg text-xs font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Results Bar: Count, Active Filters & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#2C2825]">
              {loading ? 'Searching portfolio...' : `${sortedProperties.length} ${sortedProperties.length === 1 ? 'property' : 'properties'} found`}
            </span>

            {/* Active filter badges */}
            {cityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2C2825] text-white">
                City: {cityFilter}
                <button onClick={() => setCityFilter('All')} className="hover:text-[#D4AF37]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {typeFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2C2825] text-white">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter('All')} className="hover:text-[#D4AF37]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activePriceLabel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37] text-[#1A1816]">
                Price: {activePriceLabel}
                <button onClick={handleClearPrice} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-[#78716C] font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#D4AF37]" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#2C2825] focus:outline-none focus:border-[#D4AF37] shadow-2xs cursor-pointer"
            >
              <option value="default">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Area: Largest Sq.Ft.</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-[#F2EFE9]" />
            ))}
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-12 text-center space-y-4 shadow-sm">
            <Building2 className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2C2825]">
              No Matching Luxury Properties Found
            </h3>
            <p className="text-sm text-[#78716C] max-w-md mx-auto">
              No listings matched your active price range or filters. Try expanding your price brackets, choosing another city, or resetting filters.
            </p>
            <button
              onClick={() => {
                setPurposeFilter('All');
                setCityFilter('All');
                setTypeFilter('All');
                setSearchQuery('');
                handleClearPrice();
                setSortBy('default');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2C2825] text-white text-xs font-semibold rounded-lg hover:bg-[#D4AF37] hover:text-[#1A1816] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sortedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
