import sys
import re

def update_dashboard():
    with open('components/admin/Dashboard.tsx', 'r') as f:
        content = f.read()

    # Find the stats grid block
    stats_search = """        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">Total Properties</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">{PROPERTIES.length}</h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-gold">
                <Building size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-black">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">Active Projects</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">
                  {activeProjectsCount !== null ? activeProjectsCount : PROJECTS.length}
                </h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-black">
                <FolderOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-luxury-gray font-medium uppercase tracking-wider">New Inquiries</p>
                <h3 className="text-3xl font-bold text-luxury-black mt-1">12</h3>
              </div>
              <div className="p-3 bg-luxury-offwhite rounded-lg text-luxury-gold">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              +4 this week
            </p>
          </div>
        </div>"""

    stats_replace = """        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-gold relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Total Properties</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">{PROPERTIES.length}</h3>
              </div>
              <div className="p-3 bg-luxury-gold/10 rounded-xl text-luxury-gold group-hover:scale-110 transition-transform">
                <Building size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-luxury-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Active Projects</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">
                  {activeProjectsCount !== null ? activeProjectsCount : PROJECTS.length}
                </h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl text-luxury-black group-hover:scale-110 transition-transform">
                <FolderOpen size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">New Inquiries</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">12</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 relative z-10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              +4 this week
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-luxury-gray font-bold uppercase tracking-wider">Total Lands</p>
                <h3 className="text-4xl font-serif font-bold text-luxury-black mt-2">{PROPERTIES.filter(p => p.type === 'Land').length}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
            </div>
          </div>
        </div>"""

    if stats_search in content:
        content = content.replace(stats_search, stats_replace)

    with open('components/admin/Dashboard.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_dashboard()