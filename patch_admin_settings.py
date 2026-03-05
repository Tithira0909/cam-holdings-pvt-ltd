import re

with open("components/admin/settings/SettingsSite.tsx", "r") as f:
    content = f.read()

# Replace variables
content = content.replace("logoPreview", "heroPreview")
content = content.replace("setLogoPreview", "setHeroPreview")
content = content.replace("handleLogoChange", "handleHeroChange")

# Replace fetchSiteSettings parsing
content = content.replace("data.site_logo_url", "data.hero_image_url")

# Replace upload URL
content = content.replace("'/api/settings/site/logo'", "'/api/settings/site/hero'")
content = content.replace("'logo'", "'hero_image'") # FormData key
content = content.replace("data.logo_url", "data.hero_image_url")

# Replace message string
content = content.replace("'Logo uploaded successfully'", "'Hero image uploaded successfully'")
content = content.replace("'Failed to upload logo'", "'Failed to upload hero image'")
content = content.replace("'An error occurred while uploading logo'", "'An error occurred while uploading hero image'")

# Replace JSX
jsx_to_replace = """            {/* Logo Upload Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
              <div className="flex-1 space-y-2">
                <label className="block font-bold text-luxury-black">Site Logo</label>
                <p className="text-sm text-gray-500">Upload your brand logo. Recommended size: 200x50px (PNG or SVG with transparent background).</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleHeroChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 border border-luxury-border rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} /> Upload New Logo
                </button>
              </div>

              <div className="w-full md:w-64 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                {heroPreview ? (
                  <img src={heroPreview} alt="Site Logo" className="max-w-full max-h-full object-contain p-4" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <span className="text-xs font-medium">No logo uploaded</span>
                  </div>
                )}
              </div>
            </div>"""

new_jsx = """            {/* Hero Image Upload Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
              <div className="flex-1 space-y-2">
                <label className="block font-bold text-luxury-black">Hero Section Image</label>
                <p className="text-sm text-gray-500">Upload the main hero/banner image for the homepage. Recommended size: 1920×900 (JPG/PNG).</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleHeroChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 border border-luxury-border rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} /> Upload Hero Image
                  </button>
                  {heroPreview && (
                    <button
                      type="button"
                      onClick={() => setHeroPreview(null)}
                      className="mt-4 px-4 py-2 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-96 aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative">
                {heroPreview ? (
                  <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                    <span className="text-xs font-medium">No hero image uploaded</span>
                  </div>
                )}
              </div>
            </div>"""

content = content.replace(jsx_to_replace, new_jsx)

# In handleSave, we need to pass the heroPreview to formData since it might have been removed
save_func_old = """  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });"""

save_func_new = """  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hero_image_url: heroPreview })
      });"""

content = content.replace(save_func_old, save_func_new)


with open("components/admin/settings/SettingsSite.tsx", "w") as f:
    f.write(content)
