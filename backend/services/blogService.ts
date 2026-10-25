/**
 * Blog Service: Manages luxury real estate insights and market reports
 * Covers Mumbai and Pune ultra-prime markets, flat rental yields, and bungalow investments.
 */
import mongoose from 'mongoose';
import Blog, { IBlog } from '../models/Blog.ts';

let memoryBlogs: any[] = [
  {
    _id: 'demo-blog-1',
    title: '  Mumbai Worli Sea Face & Bandra West: 2026 Luxury Flat Rental Yield Analysis',
    slug: 'demo-mumbai-worli-bandra-luxury-flat-rental-yield-analysis-2026',
    excerpt: 'An in-depth analysis of ultra-high-net-worth tenant demand, corporate expatriate leasing trends, and gross rental yields for sea-facing 4BHK and 5BHK flats.',
    content: `The ultra-luxury residential leasing market across Mumbai's primary coastal corridors—principally Worli Sea Face, Bandra Bandstand, and Carter Road—has witnessed a dramatic resurgence in early 2026. Multinational C-suite relocations, financial institutional heads, and international diplomatic missions have driven corporate flat rental contracts beyond historical benchmarks.

### Rental Yields vs Capital Appreciation in Prime Mumbai
While conventional residential real estate in Mumbai typically commands gross rental yields of 2.2% to 2.8%, turnkey sea-facing ultra-luxury flats in Bandra West and Worli are commanding stabilized yields between 3.8% and 4.4%. High demand for fully furnished, interior-architected residences with panoramic Arabian Sea views has created a scarcity premium.

Key drivers include:
- **Zero-Friction Tenancy**: Corporate lease agreements funded by Fortune 500 balance sheets with 24- to 36-month lock-ins.
- **Bespoke Interior Outfitting**: High demand for residences featuring Italian marble slabs, automated climate control by Lutron, and Gaggenau/Miele culinary suites.
- **Micro-Market Concentration**: Restricted new coastal inventory due to stringent CRZ norms guarantees capital protection for landlords.

### Advisory Perspective
For HNIs holding unencumbered luxury flats in South and West Mumbai, the rental market currently offers optimal yields while positioning the asset for long-term compounding capital appreciation.`,
    coverImage: '/src/assets/images/hero_luxury_mumbai_pune_1792781619397.jpg',
    category: 'Market Trends',
    author: 'Shantanu Patil, Managing Director',
    isPublished: true,
    isDemo: true,
    readTime: '6 min read',
    createdAt: new Date('2026-02-15T10:00:00Z'),
    updatedAt: new Date('2026-02-15T10:00:00Z'),
  },
  {
    _id: 'demo-blog-2',
    title: '  Pune Koregaon Park & Boat Club Road: Independent Houses & Trophy Bungalows Guide',
    slug: 'demo-pune-koregaon-park-boat-club-road-independent-houses-guide',
    excerpt: 'Examining why ultra-wealthy industrialists and tech leaders prioritize independent plots and historic bungalows over sky apartments in Pune.',
    content: `In an era of ubiquitous high-rise residential towers, the true hallmark of prestige in Pune remains the freehold independent house. Specifically, Koregaon Park (Lanes 1 through 7) and Boat Club Road hold an irreplaceable status among Maharashtra's industrial royalty and technology founders.

### The Scarcity of Freehold Land in Pune Central
Unlike high-density apartment blocks, independent bungalows in Koregaon Park and Boat Club Road offer irreplaceable freehold land parcels ranging from 8,000 to 25,000 square feet. With canopy-shaded private roads, strict FSI zoning, and zero commercial intrusion, these estates ensure total privacy.

Highlights of the current prime bungalow market:
- **Plot Valuations**: Core lanes in Koregaon Park command valuations ranging from ₹25 Cr to ₹55 Cr depending on street frontage and mature botanical landscaping.
- **Heritage & Modern Fusion**: Discerning purchasers are opting to preserve colonial facades while re-engineering interiors with private plunge pools, solar microgrids, and multi-car underground collectors garages.
- **Generational Wealth Preservation**: Family offices treat Pune's prime residential land parcels as non-depreciating trophy assets.

### Prime Properties Advisory
Prime Properties maintains off-market discretion for private bungalow acquisitions, ensuring both buyers and legacy owners complete transactions with absolute institutional confidentiality.`,
    coverImage: '/src/assets/images/property_villa_pune_1792781620081.jpg',
    category: 'Pune',
    author: 'Prime Properties Advisory Desk',
    isPublished: true,
    isDemo: true,
    readTime: '7 min read',
    createdAt: new Date('2026-02-28T14:30:00Z'),
    updatedAt: new Date('2026-02-28T14:30:00Z'),
  },
  {
    _id: 'demo-blog-3',
    title: '  NRI & Family Office Guide: Stamp Duty & Registration in Maharashtra 2026',
    slug: 'demo-nri-family-office-stamp-duty-registration-maharashtra-2026',
    excerpt: 'A comprehensive regulatory and taxation briefing on acquiring luxury flats and private estates across Mumbai and Pune for non-resident investors.',
    content: `Navigating legal compliance, FEMA regulations, and state fiscal duties is paramount when acquiring ultra-luxury real estate in Maharashtra. This advisory briefing outlines essential statutory considerations for Non-Resident Indians (NRIs) and Overseas Citizens of India (OCIs).

### 1. Maharashtra Stamp Duty & Surcharge Framework
In 2026, stamp duty rates for residential properties within municipal corporation limits of Mumbai and Pune stand at 5% plus a 1% Local Body Tax / Metro Cess, bringing the effective duty to 6% of the agreement value or ready reckoner rate (whichever is higher).

- **Women Co-Owners**: A 1% concession applies when residential property is registered exclusively in a female owner's name.
- **Registration Fees**: Capped at ₹30,000 for properties valued above ₹30 Lakh.

### 2. Banking Channels & Repatriation (FEMA Compliance)
NRI purchasers must channel acquisition funds through inward remittances via normal banking channels, or through funds held in NRE / FCNR(B) accounts. Repatriation of sales proceeds for up to two residential properties is permitted under the general permission of the Reserve Bank of India (RBI).

### 3. Power of Attorney (POA) Best Practices
For overseas clients unable to travel to Mumbai or Pune for physical registration, Prime Properties coordinates consulate-adjudicated specific Power of Attorney documentation, enabling authorized representatives to execute biometric verification seamlessly.`,
    coverImage: '/src/assets/images/property_penta_mumbai_1792781621423.jpg',
    category: 'Investment',
    author: 'Shantanu Patil, Managing Director',
    isPublished: true,
    isDemo: true,
    readTime: '8 min read',
    createdAt: new Date('2026-03-10T09:15:00Z'),
    updatedAt: new Date('2026-03-10T09:15:00Z'),
  },
  {
    _id: 'demo-blog-4',
    title: '  The Architecture of Sky Mansions: Penthouse Interior Engineering in Mumbai',
    slug: 'demo-architecture-sky-mansions-penthouse-interior-engineering-mumbai',
    excerpt: 'How premier architects blend acoustic insulation, bespoke Italian travertine, and private infinity pools suspended 60 floors above the Arabian Sea.',
    content: `The modern ultra-luxury penthouse in Mumbai has evolved from a spacious top-floor flat into an engineering masterpiece. Known in global architectural circles as 'Sky Mansions', these multi-level residences combine panoramic coastal vistas with unyielding structural discretion.

### Engineering Challenges at 250 Meters
Designing outdoor private decks and infinity pools atop super-tall skyscrapers requires sophisticated structural dampening:
- **Acoustic Wind Barriers**: Multi-laminated, low-iron acoustic glass balustrades that deflect coastal wind shear while preserving crystal-clear sightlines across Back Bay and the Bandra-Worli Sea Link.
- **Cantilevered Water Bodies**: Hydrostatic balance systems ensuring private swimming pools do not exert resonance frequencies on the residential core.
- **Travertine & Teak Longevity**: Specialized marine-grade sealants that protect imported European natural stone from monsoon salt spray.

Prime Properties partners with premier architectural practices to advise collectors on both acquiring and transforming iconic duplex and triplex sky residences.`,
    coverImage: '/src/assets/images/property_residence_bandra_1792781620671.jpg',
    category: 'Architecture',
    author: 'Prime Properties Design Studio',
    isPublished: true,
    isDemo: true,
    readTime: '5 min read',
    createdAt: new Date('2026-03-20T11:45:00Z'),
    updatedAt: new Date('2026-03-20T11:45:00Z'),
  },
];

function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function getPublishedBlogs(filters?: { category?: string; search?: string }) {
  if (isConnected()) {
    const query: any = { isPublished: true };
    if (filters?.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    if (filters?.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [{ title: regex }, { excerpt: regex }, { content: regex }, { author: regex }];
    }
    return await Blog.find(query).sort({ createdAt: -1 });
  }

  let list = memoryBlogs.filter((b) => b.isPublished);
  if (filters?.category && filters.category !== 'All') {
    list = list.filter((b) => b.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getBlogBySlug(slug: string) {
  if (isConnected()) {
    return await Blog.findOne({ slug, isPublished: true });
  }
  return memoryBlogs.find((b) => b.slug === slug && b.isPublished) || null;
}

export async function getAllBlogsAdmin() {
  if (isConnected()) {
    return await Blog.find().sort({ createdAt: -1 });
  }
  return memoryBlogs;
}

export async function createBlog(data: Partial<IBlog>) {
  if (!data.slug && data.title) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  if (isConnected()) {
    return await Blog.create(data);
  }

  const newBlog = {
    ...data,
    _id: 'blog-' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryBlogs.unshift(newBlog);
  return newBlog;
}

export async function updateBlog(id: string, data: Partial<IBlog>) {
  if (isConnected()) {
    return await Blog.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  const index = memoryBlogs.findIndex((b) => b._id === id);
  if (index !== -1) {
    memoryBlogs[index] = { ...memoryBlogs[index], ...data, updatedAt: new Date() };
    return memoryBlogs[index];
  }
  return null;
}

export async function deleteBlog(id: string) {
  if (isConnected()) {
    return await Blog.findByIdAndDelete(id);
  }

  const index = memoryBlogs.findIndex((b) => b._id === id);
  if (index !== -1) {
    const removed = memoryBlogs.splice(index, 1);
    return removed[0];
  }
  return null;
}

export default {
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
};
