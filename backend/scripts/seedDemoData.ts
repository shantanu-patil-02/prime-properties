/**
 * Development-Only Demo Data Seeding Script
 * 
 * Luxury Real Estate Brokerage Inventory:
 * - Flats for Rent & Flats for Sale
 * - Independent Houses for Sale
 * - Penthouses & Villas for Sale
 * 
 * CRITICAL SAFETY RULES:
 * 1. Prohibited in production environments.
 * 2. Every demo record is strictly labeled with ' '.
 * 3. Keeps demo records tagged with `isDemo: true` to prevent mixing with verified records.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Property from '../models/Property.ts';
import Blog from '../models/Blog.ts';
import Admin from '../models/Admin.ts';

dotenv.config();

export async function runDemoSeeder() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SECURITY VIOLATION: Seeding demo data is prohibited in production.');
  }

  console.log('[Seed Script] Commencing safe development demo data seeding...');

  // Ensure DB connected
  if (mongoose.connection.readyState !== 1) {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && !mongoUri.includes('username:password')) {
      await mongoose.connect(mongoUri);
    } else {
      console.log('[Seed Script] No active MongoDB connection available. Skipped database write.');
      return;
    }
  }

  // 1. Seed demo brokerage properties (Flats for Sale/Rent, Houses, Penthouses, Villas)
  const demoProperties = [
    {
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
        '/images/property_residence_bandra_1792781620671.jpg',
        '/images/hero_luxury_mumbai_pune_1792781619397.jpg',
      ],
      amenities: ['Sea Facing', 'Fully Furnished', 'Concierge Service', 'Private Deck', 'Heated Jacuzzi', '2 Stilt Parking'],
      isPublished: true,
      isFeatured: true,
      availability: 'Available',
      isDemo: true,
    },
    {
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
        '/images/property_penta_mumbai_1792781621423.jpg',
      ],
      amenities: ['Arabian Sea View', 'Private Elevator Foyer', 'Clubhouse & Spa', 'Valet Parking', 'Smart Home Automation'],
      isPublished: true,
      isFeatured: true,
      availability: 'Available',
      isDemo: true,
    },
    {
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
        '/images/property_villa_pune_1792781620081.jpg',
      ],
      amenities: ['Private Plot & Garden', 'Private Plunge Pool', 'Solar Power Backup', 'Gated Compound', 'Staff Quarters'],
      isPublished: true,
      isFeatured: true,
      availability: 'Available',
      isDemo: true,
    },
    {
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
        '/images/hero_luxury_mumbai_pune_1792781619397.jpg',
      ],
      amenities: ['Clubhouse & Gym', 'Swimming Pool', 'Modular Kitchen', '2 Covered Car Parks', '24/7 Security'],
      isPublished: true,
      isFeatured: false,
      availability: 'Available',
      isDemo: true,
    },
    {
      title: '  The Imperial Heights Triplex Penthouse for Sale - Worli',
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
        '/images/flat.jpg',
      ],
      amenities: ['Private Infinity Pool', '360° Sea View', 'Private Elevator', 'Valet Parking', 'Concierge Desk'],
      isPublished: true,
      isFeatured: true,
      availability: 'Available',
      isDemo: true,
    },
    {
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
        '/images/property_villa_pune_1792781620081.jpg',
      ],
      amenities: ['Private Swimming Pool', 'Heritage Trees & Lawn', 'Staff Quarters', 'Home Theater', 'Gated Compound'],
      isPublished: true,
      isFeatured: false,
      availability: 'Available',
      isDemo: true,
    },
  ];

  for (const prop of demoProperties) {
    await Property.findOneAndUpdate(
      { slug: prop.slug },
      { $set: prop },
      { upsert: true, new: true }
    );
  }
  console.log(`[Seed Script] Successfully ensured ${demoProperties.length} demo brokerage listings (flats for sale/rent, houses, penthouses, villas) are seeded with   labels.`);

  // 2. Ensure authorized administrator exists
  const adminEmail = 'shantanupatil636@gmail.com';
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('PrimeAdmin@2026#', salt);
    await Admin.create({
      email: adminEmail,
      passwordHash,
      name: 'Shantanu Patil (Authorized Admin)',
    });
    console.log(`[Seed Script] Authorized administrator account created for: ${adminEmail}`);
  }

  // 3. Seed demo editorial blogs
  const demoBlogs = [
    {
      title: '  Mumbai Worli Sea Face & Bandra West: 2026 Luxury Flat Rental Yield Analysis',
      slug: 'demo-mumbai-worli-bandra-luxury-flat-rental-yield-analysis-2026',
      excerpt: 'An in-depth analysis of ultra-high-net-worth tenant demand, corporate expatriate leasing trends, and gross rental yields for sea-facing 4BHK and 5BHK flats.',
      content: `The ultra-luxury residential leasing market across Mumbai's primary coastal corridors—principally Worli Sea Face, Bandra Bandstand, and Carter Road—has witnessed a dramatic resurgence in early 2026. Multinational C-suite relocations, financial institutional heads, and international diplomatic missions have driven corporate flat rental contracts beyond historical benchmarks. Gross rental yields for sea-facing residences currently average 3.8% to 4.4%, making Prime flats a high-yielding, resilient asset class.`,
      coverImage: '/images/hero_luxury_mumbai_pune_1792781619397.jpg',
      category: 'Market Trends',
      author: 'Shantanu Patil, Managing Director',
      isPublished: true,
      isDemo: true,
    },
    {
      title: '  Pune Koregaon Park & Boat Club Road: Independent Houses & Trophy Bungalows Guide',
      slug: 'demo-pune-koregaon-park-boat-club-road-independent-houses-guide',
      excerpt: 'Examining why ultra-wealthy industrialists and tech leaders prioritize independent plots and historic bungalows over sky apartments in Pune.',
      content: `In an era of high-rise residential towers, the true hallmark of prestige in Pune remains the freehold independent house. Koregaon Park (Lanes 1 through 7) and Boat Club Road hold an irreplaceable status among Maharashtra's industrial royalty. Freehold plot parcels ranging from 8,000 to 25,000 sq.ft offer generational privacy and perpetual value compounding.`,
      coverImage: '/images/property_villa_pune_1792781620081.jpg',
      category: 'Pune',
      author: 'Prime Properties Advisory Desk',
      isPublished: true,
      isDemo: true,
    },
    {
      title: '  NRI & Family Office Guide: Stamp Duty & Registration in Maharashtra 2026',
      slug: 'demo-nri-family-office-stamp-duty-registration-maharashtra-2026',
      excerpt: 'A comprehensive regulatory and taxation briefing on acquiring luxury flats and private estates across Mumbai and Pune for non-resident investors.',
      content: `Navigating legal compliance, FEMA regulations, and state fiscal duties is paramount when acquiring ultra-luxury real estate in Maharashtra. In 2026, stamp duty rates stand at 5% plus a 1% Local Body Tax / Metro Cess (total 6%). NRI purchasers must channel acquisition funds through NRE / FCNR accounts with complete repatriation compliance.`,
      coverImage: '/images/property_penta_mumbai_1792781621423.jpg',
      category: 'Investment',
      author: 'Shantanu Patil, Managing Director',
      isPublished: true,
      isDemo: true,
    },
    {
      title: '  The Architecture of Sky Mansions: Penthouse Interior Engineering in Mumbai',
      slug: 'demo-architecture-sky-mansions-penthouse-interior-engineering-mumbai',
      excerpt: 'How premier architects blend acoustic insulation, bespoke Italian travertine, and private infinity pools suspended 60 floors above the Arabian Sea.',
      content: `The modern ultra-luxury penthouse in Mumbai has evolved from a spacious top-floor flat into an engineering masterpiece. These multi-level residences combine panoramic coastal vistas with acoustic wind barriers, cantilevered water bodies, and bespoke travertine stonework designed for coastal longevity.`,
      coverImage: '/images/property_residence_bandra_1792781620671.jpg',
      category: 'Architecture',
      author: 'Prime Properties Design Studio',
      isPublished: true,
      isDemo: true,
    },
  ];

  for (const b of demoBlogs) {
    await Blog.findOneAndUpdate(
      { slug: b.slug },
      { $set: b },
      { upsert: true, new: true }
    );
  }
  console.log(`[Seed Script] Successfully ensured ${demoBlogs.length} demo editorial blogs are seeded.`);
}

export default runDemoSeeder;
