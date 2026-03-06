export enum PropertyType {
  LAND = 'Land',
  HOUSE = 'House',
  APARTMENT = 'Apartment'
}

export interface FloorPlan {
  id?: string;
  title?: string;
  type?: string;
  label?: string;
  image: string;
  description?: string;
}

export interface Property {
  id: string;
  title: string;
  slug?: string;
  location: string;
  price: string;
  type: PropertyType | string;
  image: string;
  description?: string;

  // New premium fields
  category?: string;
  district?: string;
  city?: string;
  locationLabel?: string;
  priceLabel?: string;
  bedrooms?: number;
  bathrooms?: number;
  isFeatured?: boolean;
  isSoldOut?: boolean;
  amenities?: { id: string, icon: string, label: string }[];
  locationHighlights?: { id: string, label: string }[];
  floorPlans?: FloorPlan[];
  brochureFiles?: { id: string, name: string, fileUrl: string }[];
  videoUrl?: string;
  hotlineNumber?: string;
  whatsappNumber?: string;
  logoImage?: string;
  blockPlanImage?: string;
  roadMapImage?: string;
  locationMapImage?: string;
  projectStatusLabel?: string;
  travelHighlights?: { id: string, label: string, time: string }[];
  inquiryEmail?: string;
  relatedLands?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  sortOrder?: number;
  shortDescription?: string;
  fullDescription?: string;

  // Legacy fields
  beds?: number;
  baths?: number;
  sqft?: number;
  featured?: boolean;
  status?: string;
  images?: { id: number; image_url: string }[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  location?: string;
  year?: string;
}

export interface NavItem {
  label: string;
  href: string;
}