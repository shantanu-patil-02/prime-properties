/**
 * Property Service: Core business logic and database persistence for luxury brokerage properties
 * Handles broker listings: Flats (Sale & Rent), Houses (Sale), Penthouses, and Villas.
 */
import mongoose from 'mongoose';
import Property, { IProperty } from '../models/Property.ts';

// In-memory fallback dataset for development when MongoDB is connecting or in standalone mode
let memoryProperties: any[] = [
  {
    _id: 'demo-prop-1',
    title: '  Sea-Facing 4BHK Luxury Flat for Rent - Bandra West',
    slug: 'demo-sea-facing-4bhk-luxury-flat-rent-bandra-west',
    description: 'Bespoke 4BHK fully furnished sea-facing flat available for long-term lease on Bandra Bandstand. Featuring Italian marble flooring, high-end Miele appliances, private sea-view deck, and 2 dedicated stilt parking slots.',
    city: 'Mumbai',
    location: 'Bandra Bandstand, Bandra West, Mumbai',
    propertyType: 'Flat',
    purpose: 'rent',
    price: 350000,
    priceDisplay: '₹3.5 Lac / month',
    priceApproved: true,
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3200,
    images: [
      '/src/assets/images/property_residence_bandra_1792781620671.jpg',
      '/src/assets/images/hero_luxury_mumbai_pune_1792781619397.jpg',
    ],
    amenities: ['Sea Facing', 'Fully Furnished', 'Concierge Service', 'Private Deck', 'Heated Jacuzzi', '2 Stilt Parking'],
    isPublished: true,
    isFeatured: true,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-prop-2',
    title: '  Ultra-Luxury 4BHK Flat for Sale - Worli Seaface',
    slug: 'demo-ultra-luxury-4bhk-flat-sale-worli-seaface',
    description: 'Prestigious 4BHK luxury flat for outright sale in a landmark Worli tower with uninterrupted Arabian Sea views. Vastu compliant layout with Italian marble, double-height ceilings, and private elevator foyer.',
    city: 'Mumbai',
    location: 'Worli Seaface, Mumbai',
    propertyType: 'Flat',
    purpose: 'sale',
    price: 320000000,
    priceDisplay: '₹32 Cr',
    priceApproved: true,
    bedrooms: 4,
    bathrooms: 5,
    areaSqFt: 4600,
    images: [
      '/src/assets/images/property_penta_mumbai_1792781621423.jpg',
    ],
    amenities: ['Arabian Sea View', 'Private Elevator Foyer', 'Clubhouse & Spa', 'Valet Parking', 'Smart Home Automation'],
    isPublished: true,
    isFeatured: true,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-prop-3',
    title: '  Independent Luxury House with Private Lawn for Sale - Koregaon Park',
    slug: 'demo-independent-luxury-house-sale-koregaon-park-pune',
    description: 'Exclusive independent bungalow/house for outright purchase in Koregaon Park Lane 7, Pune. Set on an independent 12,000 sq.ft private plot with manicured tropical gardens, private plunge pool, and servant quarters.',
    city: 'Pune',
    location: 'Lane 7, Koregaon Park, Pune',
    propertyType: 'House',
    purpose: 'sale',
    price: 280000000,
    priceDisplay: '₹28 Cr',
    priceApproved: true,
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 7500,
    images: [
      '/src/assets/images/property_villa_pune_1792781620081.jpg',
    ],
    amenities: ['Private Plot & Garden', 'Private Plunge Pool', 'Solar Power Backup', 'Gated Compound', 'Staff Quarters'],
    isPublished: true,
    isFeatured: true,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-prop-4',
    title: '  Premium 3BHK Flat for Rent - Kalyani Nagar Pune',
    slug: 'demo-premium-3bhk-flat-rent-kalyani-nagar-pune',
    description: 'Expansive 3BHK luxury flat available for lease in Pune’s top residential gated enclave in Kalyani Nagar. Fully air-conditioned, designer modular kitchen, serene green canopy view, and clubhouse privileges.',
    city: 'Pune',
    location: 'Kalyani Nagar, Pune',
    propertyType: 'Flat',
    purpose: 'rent',
    price: 135000,
    priceDisplay: '₹1.35 Lac / month',
    priceApproved: true,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2400,
    images: [
      '/src/assets/images/hero_luxury_mumbai_pune_1792781619397.jpg',
    ],
    amenities: ['Clubhouse & Gym', 'Swimming Pool', 'Modular Kitchen', '2 Covered Car Parks', '24/7 Security'],
    isPublished: true,
    isFeatured: false,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-prop-5',
    title: '    Triplex Penthouse for Sale - Worli',
    slug: 'demo-imperial-heights-triplex-penthouse-sale-worli',
    description: 'Ultra-exclusive 5BHK triplex sky penthouse for sale in Worli with 360-degree sea views, private heated infinity pool, private elevator, and Italian marble finishes.',
    city: 'Mumbai',
    location: 'Worli, Mumbai',
    propertyType: 'Penthouse',
    purpose: 'sale',
    price: 450000000,
    priceDisplay: '₹45 Cr',
    priceApproved: true,
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 6200,
    images: [
      '/src/assets/images/property_penta_mumbai_1792781621423.jpg',
    ],
    amenities: ['Private Infinity Pool', '360° Sea View', 'Private Elevator', 'Valet Parking', 'Concierge Desk'],
    isPublished: true,
    isFeatured: true,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-prop-6',
    title: '  Royal Palms Colonial Villa for Sale - Boat Club Road Pune',
    slug: 'demo-royal-palms-colonial-villa-sale-boat-club-road-pune',
    description: 'A stately colonial-style luxury villa with sprawling wrap-around verandahs, private swimming pool, and heritage trees in Pune’s most prestigious Boat Club Road corridor.',
    city: 'Pune',
    location: 'Boat Club Road, Pune',
    propertyType: 'Villa',
    purpose: 'sale',
    price: 240000000,
    priceDisplay: '₹24 Cr',
    priceApproved: true,
    bedrooms: 6,
    bathrooms: 7,
    areaSqFt: 8200,
    images: [
      '/src/assets/images/property_villa_pune_1792781620081.jpg',
    ],
    amenities: ['Private Swimming Pool', 'Heritage Trees & Lawn', 'Staff Quarters', 'Home Theater', 'Gated Compound'],
    isPublished: true,
    isFeatured: false,
    availability: 'Available',
    isDemo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export interface PropertyQueryParams {
  city?: string;
  type?: string;
  purpose?: string; // 'sale' | 'rent' | 'All'
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
}

export async function getPublicProperties(params: PropertyQueryParams) {
  if (isConnected()) {
    const query: any = { isPublished: true };

    if (params.city && params.city !== 'All') {
      query.city = params.city;
    }

    if (params.type && params.type !== 'All') {
      query.propertyType = params.type;
    }

    if (params.purpose && params.purpose !== 'All') {
      query.purpose = params.purpose.toLowerCase();
    }

    if (params.featured !== undefined) {
      query.isFeatured = params.featured;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      query.price = {};
      if (params.minPrice !== undefined) query.price.$gte = Number(params.minPrice);
      if (params.maxPrice !== undefined) query.price.$lte = Number(params.maxPrice);
    }

    if (params.search && params.search.trim()) {
      const searchRegex = new RegExp(params.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    return await Property.find(query).sort({ createdAt: -1 });
  }

  // Fallback in-memory filter
  let results = memoryProperties.filter((p) => p.isPublished);

  if (params.city && params.city !== 'All') {
    results = results.filter((p) => p.city.toLowerCase() === params.city?.toLowerCase());
  }

  if (params.type && params.type !== 'All') {
    results = results.filter((p) => p.propertyType.toLowerCase() === params.type?.toLowerCase());
  }

  if (params.purpose && params.purpose !== 'All') {
    results = results.filter((p) => p.purpose.toLowerCase() === params.purpose?.toLowerCase());
  }

  if (params.featured !== undefined) {
    results = results.filter((p) => p.isFeatured === params.featured);
  }

  if (params.minPrice !== undefined) {
    results = results.filter((p) => p.price >= (params.minPrice || 0));
  }

  if (params.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= (params.maxPrice || Infinity));
  }

  if (params.search && params.search.trim()) {
    const s = params.search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }

  return results;
}

export async function getPropertyByIdOrSlug(idOrSlug: string) {
  if (isConnected()) {
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      const prop = await Property.findById(idOrSlug);
      if (prop) return prop;
    }
    return await Property.findOne({ slug: idOrSlug });
  }

  return memoryProperties.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function getAllPropertiesAdmin() {
  if (isConnected()) {
    return await Property.find().sort({ createdAt: -1 });
  }
  return memoryProperties;
}

export async function createProperty(data: Partial<IProperty>) {
  if (!data.slug && data.title) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  if (data.purpose) {
    data.purpose = data.purpose.toLowerCase() as 'sale' | 'rent';
  }

  if (isConnected()) {
    return await Property.create(data);
  }

  const newProp = {
    ...data,
    _id: 'prop-' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryProperties.unshift(newProp);
  return newProp;
}

export async function updateProperty(id: string, data: Partial<IProperty>) {
  if (data.purpose) {
    data.purpose = data.purpose.toLowerCase() as 'sale' | 'rent';
  }

  if (isConnected()) {
    return await Property.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  const index = memoryProperties.findIndex((p) => p._id === id);
  if (index !== -1) {
    memoryProperties[index] = { ...memoryProperties[index], ...data, updatedAt: new Date() };
    return memoryProperties[index];
  }
  return null;
}

export async function togglePublishStatus(id: string, isPublished: boolean) {
  return await updateProperty(id, { isPublished });
}

export async function updateAvailability(id: string, availability: 'Available' | 'Under Offer' | 'Sold') {
  return await updateProperty(id, { availability });
}

export async function deleteProperty(id: string) {
  if (isConnected()) {
    return await Property.findByIdAndDelete(id);
  }

  const index = memoryProperties.findIndex((p) => p._id === id);
  if (index !== -1) {
    const deleted = memoryProperties.splice(index, 1);
    return deleted[0];
  }
  return null;
}

export default {
  getPublicProperties,
  getPropertyByIdOrSlug,
  getAllPropertiesAdmin,
  createProperty,
  updateProperty,
  togglePublishStatus,
  updateAvailability,
  deleteProperty,
};
