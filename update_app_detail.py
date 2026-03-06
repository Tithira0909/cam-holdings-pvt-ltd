import sys
import re

def update_app_detail():
    with open('App.tsx', 'r') as f:
        content = f.read()

    # Add import
    import_search = "import LandCard from './components/LandCard';"
    import_replace = "import LandCard from './components/LandCard';\nimport LandDetail from './components/LandDetail';"
    if import_search in content and "import LandDetail" not in content:
        content = content.replace(import_search, import_replace)

    # Replace the detail view block (part 1: find the detail view)
    detail_search = """        {/* 8. Detail Page View */}
        {activePage === 'detail' && (
          <div className="animate-in fade-in duration-500 bg-[#f4f4f4] pb-32">
            {propertyError ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <p className="text-xl text-red-500 font-serif mb-4">{propertyError}</p>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition">Back to Properties</button>
              </div>
            ) : !currentProperty ? (
              <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                <Loader2 size={48} className="animate-spin" />
              </div>
            ) : ("""

    # We replace from the top of the detail block down to the end of it

    # We'll use a regex to match the whole block since it's quite large
    pattern = r"\{\/\*\s*8\.\s*Detail\s*Page\s*View\s*\*\/\}.*?(?=</main>)"

    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print("Could not find detail block in App.tsx")
        return

    original_block = match.group(0)

    new_block = """{/* 8. Detail Page View */}
        {activePage === 'detail' && (
          <div className="animate-in fade-in duration-500 bg-[#f4f4f4] pb-32">
            {propertyError ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <p className="text-xl text-red-500 font-serif mb-4">{propertyError}</p>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition shadow-md">Back to Properties</button>
              </div>
            ) : !currentProperty ? (
              <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                <Loader2 size={48} className="animate-spin" />
              </div>
            ) : (
              (currentProperty.type?.toLowerCase() === 'land' || currentProperty.type?.toLowerCase() === 'lands') ? (
                 <LandDetail
                    property={currentProperty}
                    onNavigate={navigate}
                    recommendedLands={properties.filter(p => p.id !== currentProperty.id && (p.type?.toLowerCase() === 'land' || p.type?.toLowerCase() === 'lands')).slice(0, 3)}
                    onOpenConsultation={() => setIsModalOpen(true)}
                    setSelectedImage={setSelectedImage}
                 />
              ) : (
                <>
                  {/* Image Gallery Hero */}
                  <div className="w-full bg-luxury-black">
                    <div className="max-w-[1920px] mx-auto relative h-[50vh] md:h-[70vh] overflow-hidden group">
                      <img
                        src={currentProperty.image}
                        className="w-full h-full object-cover"
                        alt={currentProperty.title}
                        onClick={() => setSelectedImage(currentProperty.image)}
                      />
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    </div>

                    {/* Thumbnails Strip */}
                    {currentProperty.images && currentProperty.images.length > 0 && (
                      <div className="max-w-7xl mx-auto px-mobile py-4 flex gap-4 overflow-x-auto container-overflow-fix snap-x">
                        <div
                          className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-luxury-gold shadow-md snap-start"
                          onClick={() => setSelectedImage(currentProperty.image)}
                        >
                           <img src={currentProperty.image} className="w-full h-full object-cover" alt="Cover" />
                        </div>
                        {currentProperty.images.map((img) => (
                          <div
                            key={img.id}
                            className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-luxury-gold/50 transition-colors shadow-md snap-start"
                            onClick={() => setSelectedImage(img.image_url)}
                          >
                            <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="max-w-7xl mx-auto px-mobile pt-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                      {/* Main Content Column */}
                      <div className="flex-1 w-full">
                        {/* Title & Badge Row */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <h1 className="text-3xl md:text-5xl font-serif text-luxury-black font-bold uppercase tracking-tight">{currentProperty.title}</h1>
                          {currentProperty.status && (
                            <span className="px-4 py-1.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                              {currentProperty.status}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-luxury-gray mb-8">
                          <MapPin size={20} className="text-luxury-gold" />
                          <span className="text-lg uppercase tracking-wider">{currentProperty.location}</span>
                        </div>

                        {/* Prominent Price */}
                        {currentProperty.price && (
                          <div className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-luxury-gold">
                            <p className="text-sm text-luxury-gray uppercase tracking-widest font-bold mb-2">Asking Price</p>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">{formatPrice(currentProperty.price)}</p>
                          </div>
                        )}

                        {/* Key Info Blocks */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                          {currentProperty.type && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Property Type</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.type}</span>
                            </div>
                          )}
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Location</span>
                            <span className="text-luxury-black font-serif text-lg md:text-xl font-bold line-clamp-1">{currentProperty.location}</span>
                          </div>
                          {currentProperty.beds !== undefined && currentProperty.beds !== null && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Bedrooms</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.beds}</span>
                            </div>
                          )}
                          {currentProperty.sqft !== undefined && currentProperty.sqft !== null && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Area</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.sqft} sqft</span>
                            </div>
                          )}
                        </div>

                        {/* About the Property Section */}
                        {currentProperty.description && (
                          <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
                            <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight border-b border-luxury-border pb-4">
                              About the Property
                            </h2>
                            <div className="prose prose-lg max-w-none text-luxury-gray font-light leading-relaxed whitespace-pre-line">
                              {currentProperty.description}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Sidebar Inquiry Form (Desktop Sticky) */}
                      <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
                        <div className="bg-luxury-black text-white p-8 rounded-xl shadow-xl shadow-black/10">
                          <h3 className="text-2xl font-serif font-bold mb-2">Interested?</h3>
                          <p className="text-white/70 text-sm mb-6">Contact our sales team to schedule a viewing or request more information.</p>

                          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Your Name</label>
                              <input type="text" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="John Doe" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Email Address</label>
                              <input type="email" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="john@example.com" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Phone Number</label>
                              <input type="tel" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="+94 77 XXX XXXX" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Message</label>
                              <textarea rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors resize-none" placeholder={`I'm interested in ${currentProperty.title}...`}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-luxury-gold text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white hover:text-luxury-black transition-colors mt-4 shadow-md">
                              Send Inquiry
                            </button>
                          </form>
                        </div>
                      </div>

                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}
      """

    content = content.replace(original_block, new_block)

    with open('App.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_app_detail()