import sys
import re

def update_app():
    with open('App.tsx', 'r') as f:
        content = f.read()

    # Add import
    import_search = "import PropertyCard from './components/PropertyCard';"
    import_replace = "import PropertyCard from './components/PropertyCard';\nimport LandCard from './components/LandCard';"
    if import_search in content and "import LandCard" not in content:
        content = content.replace(import_search, import_replace)

    # Replace the lands section entirely
    lands_search = """        {/* 4. Properties Page */}
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses' || activePage === 'projects') && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">
                {activePage === 'lands' ? 'Lands' : activePage === 'houses' ? 'Houses' : 'All Properties'}
              </h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto mb-8">
                {activePage === 'lands'
                  ? 'Explore our exclusive land projects in prime locations that offer immense potential for investment and development.'
                  : activePage === 'houses'
                    ? 'Discover luxurious homes and apartments that combine comfort and design, ideal for families seeking premium living.'
                    : 'Explore our complete portfolio of premium properties, including exclusive lands and luxurious homes.'}
              </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {properties.filter(p => {
                const t = (p.type || "").trim().toLowerCase();
                if (activePage === 'lands') return t === 'land' || t === 'lands';
                if (activePage === 'houses') return t === 'house' || t === 'houses' || t === 'apartment';
                return true; // 'properties' shows all
              }).map(prop => (
                <div key={prop.id} className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-[20px] text-left flex flex-col flex-grow">
                    <h3 className="text-[22px] font-serif font-bold text-[#333] mb-2">{prop.title}</h3>
                    <p className="text-[16px] text-[#777] mb-1">Location: {prop.location.split(',')[0]}</p>
                    <p className="text-[16px] text-[#777] mb-6 font-bold">Price: {prop.price}</p>
                    <div className="mt-auto">
                      <button onClick={() => navigate('detail', prop.id)} className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}"""

    lands_replace = """        {/* 4. Properties Page */}
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses' || activePage === 'projects') && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pb-24">

            {/* Conditional Hero based on active page */}
            {activePage === 'lands' ? (
              <div className="relative w-full bg-luxury-black mb-16 h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600" alt="Lands Hero" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                 <div className="relative z-10 text-center px-mobile pt-20">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase tracking-tight mb-4">Premium Lands</h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto font-light">
                      Explore our exclusive land projects in prime locations offering immense potential for investment and development.
                    </p>
                 </div>
              </div>
            ) : (
              <div className="pt-32 mb-16 px-mobile max-w-7xl mx-auto text-center">
                <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">
                  {activePage === 'houses' ? 'Houses' : 'All Properties'}
                </h2>
                <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto mb-8">
                  {activePage === 'houses'
                      ? 'Discover luxurious homes and apartments that combine comfort and design, ideal for families seeking premium living.'
                      : 'Explore our complete portfolio of premium properties, including exclusive lands and luxurious homes.'}
                </p>
              </div>
            )}

            <div className="max-w-7xl mx-auto px-mobile">

              {/* Optional: Add Filters UI here if lands */}
              {activePage === 'lands' && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-12 flex flex-wrap gap-4 items-center border border-gray-100">
                  <div className="flex-1 min-w-[200px]">
                     <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Search</label>
                     <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" />
                        <input type="text" placeholder="Keyword or Location" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all" />
                     </div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                     <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">District</label>
                     <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all appearance-none text-luxury-black font-medium">
                        <option value="">All Districts</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kalutara">Kalutara</option>
                     </select>
                  </div>
                   <div className="flex-1 min-w-[200px]">
                     <label className="block text-xs font-bold text-luxury-gray uppercase tracking-wider mb-2">Category</label>
                     <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all appearance-none text-luxury-black font-medium">
                        <option value="">All Categories</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                     </select>
                  </div>
                  <div className="w-full md:w-auto flex items-end">
                     <button className="w-full md:w-auto bg-luxury-gold text-white px-8 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-luxury-golddark transition-all shadow-md">
                        Filter Lands
                     </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {properties.filter(p => {
                  const t = (p.type || "").trim().toLowerCase();
                  if (activePage === 'lands') return t === 'land' || t === 'lands';
                  if (activePage === 'houses') return t === 'house' || t === 'houses' || t === 'apartment';
                  return true; // 'properties' shows all
                }).map(prop => (
                  activePage === 'lands' ? (
                    <LandCard
                      key={prop.id}
                      property={prop}
                      onClick={() => navigate('detail', prop.id)}
                    />
                  ) : (
                    <div key={prop.id} className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-[20px] text-left flex flex-col flex-grow">
                        <h3 className="text-[22px] font-serif font-bold text-[#333] mb-2">{prop.title}</h3>
                        <p className="text-[16px] text-[#777] mb-1">Location: {prop.location.split(',')[0]}</p>
                        <p className="text-[16px] text-[#777] mb-6 font-bold">Price: {prop.price}</p>
                        <div className="mt-auto">
                          <button onClick={() => navigate('detail', prop.id)} className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark">View Details</button>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}"""

    if lands_search in content:
        content = content.replace(lands_search, lands_replace)

    with open('App.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_app()