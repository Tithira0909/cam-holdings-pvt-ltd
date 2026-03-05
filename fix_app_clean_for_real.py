import re

with open("App.tsx", "r") as f:
    content = f.read()

# Replace the specific mapping of properties for the new condition.
old_full = """        {/* 4. Properties Page */}
        {activePage === 'projects' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">OUR PROPERTIES</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto mb-8">Explore our exclusive land projects in prime locations that offer immense potential for investment and development.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {properties.map(prop => (
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

new_full = """        {/* 4. Properties Page */}
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses') && (
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
              {(() => {
                const filtered = properties.filter(p => {
                  const normalized = (p.type || "").trim().toLowerCase();
                  const landMatch = normalized === "land" || normalized === "lands";
                  const houseMatch = normalized === "house" || normalized === "houses";

                  if (activePage === 'lands') return landMatch;
                  if (activePage === 'houses') return houseMatch;
                  return true; // 'properties' shows all
                });
                console.log("Route filter:", activePage, "Total:", properties.length, "Filtered:", filtered.length);
                return filtered.map(prop => (
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
                ));
              })()}
            </div>
          </div>
        )}"""

content = content.replace(old_full, new_full)


# Fix duplicate Houses section block completely
old_houses_block = """        {/* 5. Houses Page */}
        {activePage === 'houses' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">HOUSES</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto mb-8">Discover luxurious homes and apartments that combine comfort and design, ideal for families seeking premium living.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {properties.filter(p => p.type === PropertyType.HOUSE || p.type === PropertyType.APARTMENT).map(prop => (
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

content = content.replace(old_houses_block, "")
content = content.replace("{/* 5. Houses Page */}", "")

# Fix app types and page names
old_active_page_init = """    if (path.startsWith('/properties')) return 'projects';
    if (path.startsWith('/houses')) return 'houses';"""

new_active_page_init = """    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';"""

content = content.replace(old_active_page_init, new_active_page_init)


old_popstate = """      if (path.startsWith('/properties')) {
        setActivePage('projects');
      } else if (path.startsWith('/houses')) {
        setActivePage('houses');
      }"""

new_popstate = """      if (path.startsWith('/properties/lands')) {
        setActivePage('lands');
      } else if (path.startsWith('/properties/houses')) {
        setActivePage('houses');
      } else if (path.startsWith('/properties')) {
        setActivePage('properties');
      }"""
content = content.replace(old_popstate, new_popstate)


old_navigate = """    if (page === 'projects' || page === 'houses') {
      const displayPage = page === 'projects' ? 'properties' : 'houses';
      window.history.pushState({}, '', `/${displayPage}`);
    }"""

new_navigate = """    if (page === 'properties' || page === 'lands' || page === 'houses') {
      window.history.pushState({}, '', page === 'properties' ? '/properties' : `/properties/${page}`);
    }"""
content = content.replace(old_navigate, new_navigate)


with open("App.tsx", "w") as f:
    f.write(content)
