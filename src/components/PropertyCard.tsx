import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="luxury-card-hover group bg-white rounded-xl overflow-hidden border border-[#D4AF37]/25 shadow-sm flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9]">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          {property.purpose === 'rent' ? (
            <span className="bg-[#D4AF37] text-[#1A1816] text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-md transition-transform duration-300 group-hover:scale-105">
              FOR RENT
            </span>
          ) : (
            <span className="bg-[#1A1816] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded border border-[#D4AF37]/40 shadow-md transition-transform duration-300 group-hover:scale-105">
              FOR SALE
            </span>
          )}
          <span className="bg-white/95 text-[#2C2825] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm">
            {property.propertyType}
          </span>
          <span className="bg-[#1A1816]/80 text-[#FAF8F5] text-[11px] font-medium tracking-wider uppercase px-2 py-1 rounded">
            {property.city}
          </span>
          {property.availability && property.availability !== 'Available' && (
            <span className="bg-amber-600 text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
              {property.availability}
            </span>
          )}
          {property.title?.includes(' ') && (
            <span className="bg-zinc-900/80 text-[#FAF8F5] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              DEMO ONLY
            </span>
          )}
        </div>

        {/* Price Tag at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div>
            <span className="text-xs text-[#FAF8F5]/80 uppercase tracking-wider block">
              {property.purpose === 'rent' ? 'Monthly Rental' : 'Sale Consideration'}
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5] transition-colors duration-300 group-hover:text-[#F4E8C1]">{property.priceDisplay}</span>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-[#1A1816] group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md"
            aria-label={`View ${property.title}`}
          >
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2C2825] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="text-sm text-[#78716C] line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Specs footer */}
        <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-[#2C2825] font-medium">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="w-4 h-4 text-[#D4AF37]" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="w-4 h-4 text-[#D4AF37]" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5" title="Area">
            <Square className="w-4 h-4 text-[#D4AF37]" />
            <span>{property.areaSqFt.toLocaleString()} sq.ft.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
