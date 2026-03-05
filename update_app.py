import re

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Update onNavigate signature inside App
# Find `const [activePage, setActivePage] = useState<Page>('home');` and related routing logic

content = re.sub(
    r"const queryParam = activePage === 'projects' \? '\?type=Land' : activePage === 'houses' \? '\?type=House,Apartment' : '';",
    r"const queryParam = '';",
    content
)

content = re.sub(
    r"if \(path\.startsWith\('/properties'\)\) return 'projects';",
    r"if (path.startsWith('/properties/lands')) return 'lands';\n    if (path.startsWith('/properties/houses')) return 'houses';\n    if (path.startsWith('/properties')) return 'properties';",
    content
)

# Update page state handling
content = re.sub(
    r"if \(page === 'projects'\) \{",
    r"if (page === 'properties' || page === 'lands' || page === 'houses') {\n      window.history.pushState({}, '', page === 'properties' ? '/properties' : `/properties/${page}`);\n    } else if (page === 'projects') {",
    content
)

content = re.sub(
    r"setActivePage\('projects'\);",
    r"setActivePage('properties');",
    content
)

# Replace the "Lands Page" and "Houses Page" with a unified "Properties Page" logic or update existing
projects_page_regex = r"\{\/\* 4\. Lands Page \*\/\}.*?(?=\{\/\* 4b\. Houses Page \*\/\})"
houses_page_regex = r"\{\/\* 4b\. Houses Page \*\/\}.*?(?=\{\/\* 5\. Contact Page \*\/\})"

properties_page_replacement = """        {/* 4. Properties Page */}
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
                if (activePage === 'lands') return p.type === PropertyType.LAND || p.type.toLowerCase() === 'land';
                if (activePage === 'houses') return p.type === PropertyType.HOUSE || p.type === PropertyType.APARTMENT || p.type.toLowerCase() === 'house';
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
        )}
"""

content = re.sub(projects_page_regex, properties_page_replacement, content, flags=re.DOTALL)
content = re.sub(houses_page_regex, "", content, flags=re.DOTALL)


with open('App.tsx', 'w') as f:
    f.write(content)
