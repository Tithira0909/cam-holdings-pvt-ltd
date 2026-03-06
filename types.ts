export enum PropertyType {
  LAND = 'Land',
  HOUSE = 'House',
  APARTMENT = 'Apartment'
}

export interface FloorPlan {
  label: string;
  image: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: PropertyType;
  image: string;
  description?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  featured?: boolean;
  floorPlans?: FloorPlan[];
  gallery?: string[];
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