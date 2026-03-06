import sys
import re

def update_admin_properties():
    with open('components/admin/PropertiesList.tsx', 'r') as f:
        content = f.read()

    # Find the filter section or add it below the header
    header_search = """      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-luxury-black">All Properties</h2>
        <button
          onClick={onAddProperty}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-luxury-golddark transition-all shadow-gold-glow"
        >
          <Plus size={16} />
          Add New Property
        </button>
      </div>"""

    header_replace = """      <div className="p-6 border-b border-luxury-border flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-luxury-black">All Properties</h2>
        <button
          onClick={onAddProperty}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-luxury-golddark transition-all shadow-gold-glow"
        >
          <Plus size={16} />
          Add New Property
        </button>
      </div>

      {/* Filters UI */}
      <div className="p-6 border-b border-luxury-border bg-gray-50 flex flex-wrap gap-4 items-center">
         <div className="flex-1 min-w-[200px]">
            <div className="relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-gray" />
               <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all"
               />
            </div>
         </div>
         <div className="w-[150px]">
            <select
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
               className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all"
            >
               <option value="All">All Types</option>
               <option value="Lands">Lands</option>
               <option value="Houses">Houses / Apartments</option>
            </select>
         </div>
      </div>"""

    if header_search in content:
        content = content.replace(header_search, header_replace)

    # Update Table Header
    thead_search = """              <tr>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
              </tr>"""

    thead_replace = """              <tr>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-luxury-gray uppercase tracking-wider">Actions</th>
              </tr>"""

    if thead_search in content:
        content = content.replace(thead_search, thead_replace)

    # Update Table Body row
    tbody_search = """                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-luxury-gold shrink-0" />
                      <span className="line-clamp-1">{prop.location?.split(',')[0]}</span>
                    </div>
                  </td>"""

    tbody_replace = """                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-luxury-gray">{prop.category || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-luxury-gold shrink-0" />
                      <span className="line-clamp-1">{prop.city || prop.district || prop.location?.split(',')[0]}</span>
                    </div>
                  </td>"""

    if tbody_search in content:
        content = content.replace(tbody_search, tbody_replace)

    # Make sure we use status label visually or badges
    status_search = """                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      prop.status === 'Sold'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {prop.status || 'Active'}
                    </span>
                  </td>"""

    status_replace = """                  <td className="px-6 py-4 flex flex-col items-start gap-1">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      prop.isSoldOut || prop.status === 'Sold'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {prop.isSoldOut ? 'Sold Out' : prop.status || 'Active'}
                    </span>
                    {prop.isFeatured && (
                      <span className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-xs font-bold rounded-full">
                        Featured
                      </span>
                    )}
                  </td>"""

    if status_search in content:
        content = content.replace(status_search, status_replace)

    with open('components/admin/PropertiesList.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_admin_properties()