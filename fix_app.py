import re

with open("App.tsx", "r") as f:
    content = f.read()

# Fix properties filtering
old_filtering = """            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {properties.filter(p => {
                if (activePage === 'lands') return p.type === PropertyType.LAND || p.type.toLowerCase() === 'land';
                if (activePage === 'houses') return p.type === PropertyType.HOUSE || p.type === PropertyType.APARTMENT || p.type.toLowerCase() === 'house';
                return true; // 'properties' shows all
              }).map(prop => ("""

new_filtering = """            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                return filtered.map(prop => ("""

content = content.replace(old_filtering, new_filtering)

# Close the new map block properly
old_close_map = """                  </div>
                </div>
              ))}
            </div>"""

new_close_map = """                  </div>
                </div>
              ));
              })()}
            </div>"""

content = content.replace(old_close_map, new_close_map)

# Fix app types and page names
old_active_page_init = """    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';
    if (path.startsWith('/houses')) return 'houses';"""

new_active_page_init = """    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';"""

content = content.replace(old_active_page_init, new_active_page_init)

old_popstate = """      if (path.startsWith('/properties')) {
        setActivePage('properties');
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


old_navigate = """    if (page === 'properties' || page === 'lands' || page === 'houses' || page === 'projects') {
      const displayPage = page === 'projects' ? 'properties' : page;
      window.history.pushState({}, '', displayPage === 'properties' ? '/properties' : `/properties/${displayPage}`);
    }"""

new_navigate = """    if (page === 'properties' || page === 'lands' || page === 'houses') {
      window.history.pushState({}, '', page === 'properties' ? '/properties' : `/properties/${page}`);
    }"""
content = content.replace(old_navigate, new_navigate)


with open("App.tsx", "w") as f:
    f.write(content)
