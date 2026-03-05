import re

with open("App.tsx", "r") as f:
    content = f.read()

content = content.replace("              );\n              })()}", "              ))}\n              </div>")
content = content.replace("                return filtered.map(prop => (", "                return filtered.map(prop => (")


# Fix the entire block manually since replacing fragments is messy
old_block = """            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              ))}
              </div>"""

new_block = """            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>"""

content = content.replace(old_block, new_block)

with open("App.tsx", "w") as f:
    f.write(content)
