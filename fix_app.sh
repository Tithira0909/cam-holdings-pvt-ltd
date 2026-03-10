cat << 'INNER_EOF' > App.tsx
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import Stats from './components/Stats';
import ValueProposition from './components/ValueProposition';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import PropertyDetail from './components/PropertyDetail';
import ServicesList from './components/ServicesList';
import LandsListing from './components/listings/LandsListing';
import HousesListing from './components/houses/HousesListing';
import Newsletter from './components/Newsletter';
import ProjectsListing from './components/listings/ProjectsListing';
import AdminDashboard from './components/admin/Dashboard';
import Login from './components/admin/Login';
import LandDetail from './components/LandDetail';
import HouseDetail from './components/HouseDetail';
import ConsultationModal from './components/ConsultationModal';

// Mock Data APIs
import { mockLands, mockHouses, mockProjects } from './data/mockData';
import { Property } from './types';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Data State
  const [lands, setLands] = useState<Property[]>([]);
  const [houses, setHouses] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Global UI State
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // Auth check on mount
  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('cam_admin_auth');
      if (authState === 'true') {
        setIsAdminAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('cam_admin_auth');
    setIsAdminAuthenticated(false);
    setActivePage('home');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch lands
      const landsRes = await fetch('/api/lands');
      let landsData = [];
      if (landsRes.ok) {
        landsData = await landsRes.json();
      } else {
        console.warn('Backend unavailable, using mock lands data');
        landsData = mockLands;
      }

      // Transform IDs to avoid collisions when merging arrays for unified views (like Featured)
      // Keeping original ID available for detail views if needed
      const transformedLands = landsData.map((l: any) => ({
        ...l,
        _originalId: l.id,
        id: `land-${l.id}`
      }));
      setLands(transformedLands);

      // Fetch houses
      const housesRes = await fetch('/api/houses');
      let housesData = [];
      if (housesRes.ok) {
        housesData = await housesRes.json();
      } else {
        console.warn('Backend unavailable, using mock houses data');
        housesData = mockHouses;
      }
      const transformedHouses = housesData.map((h: any) => ({
        ...h,
        _originalId: h.id,
        id: `house-${h.id}`
      }));
      setHouses(transformedHouses);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if fetch completely fails
      setLands(mockLands.map((l: any) => ({ ...l, _originalId: l.id, id: `land-${l.id}` })));
      setHouses(mockHouses.map((h: any) => ({ ...h, _originalId: h.id, id: `house-${h.id}` })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Simulate projects load (no backend yet)
    setProjects(mockProjects);
  }, []);

  const handleDataUpdate = () => {
    fetchData(); // Refresh data from backend
  };

  const navigateTo = (page: string, propertyId?: number) => {
    setActivePage(page);
    if (propertyId !== undefined) {
      setSelectedPropertyId(propertyId);
    }
    window.scrollTo(0, 0);
  };

  const navigateToLandDetail = (originalId: number) => {
    setSelectedPropertyId(originalId);
    setActivePage('landDetail');
    window.scrollTo(0, 0);
  };

  const navigateToHouseDetail = (originalId: number) => {
    setSelectedPropertyId(originalId);
    setActivePage('houseDetail');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activePage === 'admin') {
      if (!isAdminAuthenticated) {
        return <Login onLogin={handleAdminLogin} />;
      }
      return <AdminDashboard onLogout={handleAdminLogout} onDataUpdate={handleDataUpdate} />;
    }

    if (activePage === 'landDetail' && selectedPropertyId !== null) {
      // Find land by original ID
      const property = lands.find(p => p._originalId === selectedPropertyId || p.id === `land-${selectedPropertyId}`);
      if (property) {
        const recommendedLands = lands.filter(p => p.id !== property.id).slice(0, 3);
        return <LandDetail
                  property={property}
                  onNavigate={(page, id) => {
                    if (page === 'detail' && id) navigateToLandDetail(typeof id === 'string' ? parseInt(id.replace('land-', '')) : id);
                    else navigateTo(page);
                  }}
                  recommendedLands={recommendedLands}
                />;
      }
      return <div className="p-24 text-center">Land not found</div>;
    }

    if (activePage === 'houseDetail' && selectedPropertyId !== null) {
      // Find house by original ID
      const property = houses.find(p => p._originalId === selectedPropertyId || p.id === `house-${selectedPropertyId}`);
      if (property) {
        const recommendedHouses = houses.filter(p => p.id !== property.id).slice(0, 3);
        return <HouseDetail
                  property={property}
                  onNavigate={(page, id) => {
                    if (page === 'detail' && id) navigateToHouseDetail(typeof id === 'string' ? parseInt(id.replace('house-', '')) : id);
                    else navigateTo(page);
                  }}
                  recommendedHouses={recommendedHouses}
                />;
      }
      return <div className="p-24 text-center">House not found</div>;
    }

    if (activePage === 'detail' && selectedPropertyId !== null) {
      // General detail route (legacy/projects)
      const property = [...lands, ...houses, ...projects].find(p => p.id === selectedPropertyId || p._originalId === selectedPropertyId);
      if (property) {
        return <PropertyDetail property={property} onNavigate={navigateTo} />;
      }
      return <div className="p-24 text-center">Property not found</div>;
    }

    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={navigateTo} />
            <SearchSection
               onNavigate={(type, id) => {
                  if (type === 'land') navigateToLandDetail(id);
                  else if (type === 'house') navigateToHouseDetail(id);
               }}
               lands={lands}
               houses={houses}
            />
            <Stats />
            <AboutUs />
            <ValueProposition />
            <Newsletter />
          </>
        );
      case 'lands':
        return <LandsListing
                 properties={lands}
                 onNavigate={(page, id) => {
                    if (page === 'detail' && id) navigateToLandDetail(typeof id === 'string' ? parseInt(id.replace('land-', '')) : id);
                    else navigateTo(page);
                 }}
               />;
      case 'houses':
        return <HousesListing
                 properties={houses}
                 onNavigate={(page, id) => {
                    if (page === 'detail' && id) navigateToHouseDetail(typeof id === 'string' ? parseInt(id.replace('house-', '')) : id);
                    else navigateTo(page);
                 }}
               />;
      case 'projects':
        return <ProjectsListing properties={projects} onNavigate={navigateTo} />;
      case 'services':
        return <ServicesList />;
      case 'contact':
        return <Contact />;
      default:
        return <div className="p-24 text-center">Page not found</div>;
    }
  };

  const isPublicPage = activePage !== 'admin';
  const showHeaderFooter = isPublicPage;

  return (
    <div className="min-h-screen bg-luxury-offwhite flex flex-col font-sans">
      {showHeaderFooter && <Navigation activePage={activePage} onNavigate={navigateTo} onBookConsultation={() => setIsConsultationModalOpen(true)} />}

      {/* Dynamic top padding: pt-0 for home (hero underlaps transparent header), pt-24 (96px) for all other internal pages */}
      <main className={`flex-grow ${activePage === 'home' || !showHeaderFooter ? 'pt-0' : 'pt-24'}`}>
        {renderContent()}
      </main>

      {showHeaderFooter && <Footer onNavigate={navigateTo} />}

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </div>
  );
}

export default App;
INNER_EOF
