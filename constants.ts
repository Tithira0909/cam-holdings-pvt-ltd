import { Property, PropertyType, Project } from './types';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Sovereign Estate',
    location: 'Colombo 07, Sri Lanka',
    price: 'LKR 450,000,000',
    type: PropertyType.HOUSE,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    beds: 6,
    baths: 5,
    sqft: 8500,
    featured: true,
    floorPlans: [
      { label: 'Ground Floor', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200' },
      { label: 'First Floor', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&q=80&w=1200' }
    ]
  },
  {
    id: '2',
    title: 'Azure Heights Penthouse',
    location: 'Bambalapitiya, Colombo 04',
    price: 'LKR 125,000,000',
    type: PropertyType.APARTMENT,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    beds: 3,
    baths: 3,
    sqft: 2400,
    featured: true,
    floorPlans: [
      { label: 'Unit Layout', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&q=80&w=1200' }
    ]
  },
  {
    id: '3',
    title: 'Emerald Grove Plots',
    location: 'Athurugiriya, Malabe',
    price: 'LKR 2,500,000 per perch',
    type: PropertyType.LAND,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    featured: false
  },
  {
    id: '4',
    title: 'Minimalist Sanctuary',
    location: 'Rajagiriya, Sri Jayawardenepura',
    price: 'LKR 85,000,000',
    type: PropertyType.HOUSE,
    image: 'https://images.unsplash.com/photo-1600607687940-467f4b637779?auto=format&fit=crop&q=80&w=1200',
    beds: 4,
    baths: 4,
    sqft: 3200,
    featured: true,
    floorPlans: [
      { label: 'Main Level', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200' }
    ]
  },
  {
    id: '5',
    title: 'Marine Drive Residences',
    location: 'Colombo 03',
    price: 'LKR 75,000,000',
    type: PropertyType.APARTMENT,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    beds: 2,
    baths: 2,
    sqft: 1800,
    featured: false
  },
  {
    id: '6',
    title: 'Heritage Villa',
    location: 'Kandy, Central Province',
    price: 'LKR 110,000,000',
    type: PropertyType.HOUSE,
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
    beds: 5,
    baths: 4,
    sqft: 5500,
    featured: false
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'The Zenith Residence',
    category: 'Architecture',
    location: 'Colombo 03',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    description: 'A 42-story architectural marvel redefining the Colombo skyline with sustainable design.'
  },
  {
    id: 'p2',
    title: 'Nuera Gated Community',
    category: 'Urban Planning',
    location: 'Battaramulla',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    description: 'Boutique residential enclave focused on privacy, security, and tropical modernism.'
  },
  {
    id: 'p3',
    title: 'Ocean View Condominiums',
    category: 'Construction',
    location: 'Negombo',
    year: '2021',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    description: 'Premier seaside luxury living with high-durability coastal construction materials.'
  },
  {
    id: 'p4',
    title: 'The Heritage Pavilion',
    category: 'Restoration',
    location: 'Kandy',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200',
    description: 'Sensitive restoration of a colonial-era manor into a modern boutique luxury hotel.'
  }
];