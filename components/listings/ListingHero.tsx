import React from 'react';
import { PageHero } from '../PageHero';

interface ListingHeroProps {
  type: 'Lands' | 'Houses';
}

export const ListingHero: React.FC<ListingHeroProps> = ({ type }) => {
  const bgImage = type === 'Lands'
    ? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920";

  const description = type === 'Lands'
    ? 'Discover premium land parcels in Sri Lanka’s most sought-after locations.'
    : 'Explore luxurious homes and apartments designed for modern premium living.';

  return (
    <PageHero
      title={type}
      description={description}
      bgImage={bgImage}
      breadcrumbs={[
        { label: 'Home', onClick: () => { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); } },
        { label: type }
      ]}
    />
  );
};
