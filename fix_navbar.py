import re

with open("components/Navbar.tsx", "r") as f:
    content = f.read()

# Update navLinks
old_nav_links = """    { label: 'Properties', page: 'dropdown', dropdownItems: [{label: 'Lands', page: 'projects'}, {label: 'Houses', page: 'houses'}] },"""
new_nav_links = """    { label: 'Properties', page: 'properties', hasDropdown: True, dropdownItems: [{label: 'Lands', page: 'lands'}, {label: 'Houses', page: 'houses'}] },"""
content = content.replace(old_nav_links, new_nav_links)

# Update Dropdown Hover logic
old_dropdown_hover_1 = """              <div
                key={idx}
                className="relative group/dropdown"
                ref={link.page === 'dropdown' ? dropdownRef : null}
                onMouseEnter={() => link.page === 'dropdown' && setIsPropertiesDropdownOpen(true)}
                onMouseLeave={() => link.page === 'dropdown' && setIsPropertiesDropdownOpen(false)}
              >
                {link.page === 'dropdown' ? ("""
new_dropdown_hover_1 = """              <div
                key={idx}
                className="relative group/dropdown"
                ref={link.hasDropdown ? dropdownRef : null}
                onMouseEnter={() => link.hasDropdown && setIsPropertiesDropdownOpen(true)}
                onMouseLeave={() => link.hasDropdown && setIsPropertiesDropdownOpen(false)}
              >
                {link.hasDropdown ? ("""
content = content.replace(old_dropdown_hover_1, new_dropdown_hover_1)

# Update dropdown click logic
old_dropdown_logic = """                  <div
                    className={`text-[14px] uppercase tracking-luxury font-bold transition-all relative flex items-center gap-1 cursor-pointer group hover:text-luxury-gold py-4 ${
                      activePage === 'projects' || activePage === 'houses'
                        ? 'text-luxury-gold'
                        : textColorClass
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 group-hover/dropdown:rotate-180`} />
                  </div>"""

new_dropdown_logic = """                  <button
                    onClick={() => onNavigate(link.page as any)}
                    className={`text-[14px] uppercase tracking-luxury font-bold transition-all relative flex items-center gap-1 cursor-pointer group hover:text-luxury-gold py-4 ${
                      activePage === 'properties' || activePage === 'lands' || activePage === 'houses'
                        ? 'text-luxury-gold'
                        : textColorClass
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 group-hover/dropdown:rotate-180`} />
                    <span className={`absolute bottom-3 left-0 w-0 h-0.5 bg-luxury-gold transition-all group-hover:w-full ${activePage === 'properties' || activePage === 'lands' || activePage === 'houses' ? 'w-full' : ''}`}></span>
                  </button>"""
content = content.replace(old_dropdown_logic, new_dropdown_logic)

# Update Mobile Navigation
old_mobile_nav = """                <li key={idx} className="flex flex-col items-center">
                  {link.page === 'dropdown' ? (
                     <>
                        <button onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors flex items-center gap-2">
                           {link.label} <ChevronDown size={24} className={`transition-transform duration-300 ${isPropertiesDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isPropertiesDropdownOpen && ("""

new_mobile_nav = """                <li key={idx} className="flex flex-col items-center w-full">
                  {link.hasDropdown ? (
                     <>
                        <div className="flex items-center justify-center gap-2 w-full">
                            <button
                              onClick={() => { setIsDrawerOpen(false); onNavigate(link.page as any); setIsPropertiesDropdownOpen(false); }}
                              className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors"
                            >
                               {link.label}
                            </button>
                            <button onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)} className="p-2 text-luxury-black hover:text-luxury-gold">
                                <ChevronDown size={28} className={`transition-transform duration-300 ${isPropertiesDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {isPropertiesDropdownOpen && ("""
content = content.replace(old_mobile_nav, new_mobile_nav)


# Fix the dropdown array mapping in desktop
old_dropdown_mapping = """                {link.page === 'dropdown' && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border border-luxury-border z-[110] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 translate-y-2 group-hover/dropdown:translate-y-0">"""

new_dropdown_mapping = """                {link.hasDropdown && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border border-luxury-border z-[110] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 translate-y-2 group-hover/dropdown:translate-y-0">"""
content = content.replace(old_dropdown_mapping, new_dropdown_mapping)


with open("components/Navbar.tsx", "w") as f:
    f.write(content)
