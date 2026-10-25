export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  city: 'Mumbai' | 'Pune';
  location: string;
  propertyType: 'Flat' | 'House' | 'Penthouse' | 'Villa';
  purpose: 'sale' | 'rent';
  price: number;
  priceDisplay: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  amenities: string[];
  isPublished: boolean;
  isFeatured: boolean;
  availability: 'Available' | 'Under Offer' | 'Sold';
  createdAt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Market Trends' | 'Architecture' | 'Investment' | 'Lifestyle' | 'Mumbai' | 'Pune';
  author: string;
  isPublished: boolean;
  isDemo?: boolean;
  readTime?: string;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  propertyTitle?: string;
  city: string;
  inquiryType: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  emailNotificationSent: boolean;
  emailError?: string;
  notificationAttempts?: number;
  lastNotificationAttemptAt?: string;
  privacyConsent?: boolean;
  createdAt: string;
}
