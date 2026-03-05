import re

with open('Navbar.tsx', 'r') as f:
    content = f.read()

# Change onNavigate signature in NavbarProps
content = re.sub(
    r"onNavigate: \(page: 'home' \| 'projects' \| 'detail' \| 'services' \| 'about' \| 'contact' \| 'portfolio' \| 'virtual-tour'\) => void;",
    r"onNavigate: (page: 'home' | 'properties' | 'lands' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'virtual-tour') => void;",
    content
)

# Update navLinks
navLinks_replacement = """  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Virtual Tour', page: 'virtual-tour' },
    { label: 'Portfolio', page: 'portfolio' },
    {
      label: 'Properties',
      page: 'properties',
      dropdown: [
        { label: 'Lands', page: 'lands' },
        { label: 'Houses', page: 'houses' }
      ]
    },
    { label: 'Contact Us', page: 'contact' },
  ];"""

content = re.sub(
    r"const navLinks = \[\s*\{ label: 'Home', page: 'home' \},\s*\{ label: 'Services', page: 'services' \},\s*\{ label: 'Virtual Tour', page: 'virtual-tour' \},\s*\{ label: 'Portfolio', page: 'portfolio' \},\s*\{ label: 'Properties', page: 'projects' \},\s*\{ label: 'Contact Us', page: 'contact' \},\s*\];",
    navLinks_replacement,
    content
)

# Update desktop menu
desktop_menu_search = r"""          {/\* Menu \*/}
          <div className="hidden lg:flex items-center gap-8 ml-auto">
            \{navLinks\.map\(\(link, idx\) => \(
              <button
                key=\{idx\}
                onClick=\{\(\) => onNavigate\(link\.page as any\)\}
                className=\{`text-\[16px\] uppercase tracking-luxury font-bold transition-all relative group hover:text-luxury-gold \$\{
                  activePage === link\.page
                    \? 'text-luxury-gold'
                    : textColorClass
                \}`\}
              >
                \{link\.label\}
                <span className=\{`absolute -bottom-1 left-0 w-0 h-0\.5 bg-luxury-gold transition-all group-hover:w-full \$\{activePage === link\.page \? 'w-full' : ''\}`\}><\/span>
              <\/button>
            \)\)\}
          <\/div>"""

desktop_menu_replacement = """          {/* Menu */}
          <div className="hidden lg:flex items-center gap-8 ml-auto">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative group/dropdown">
                <button
                  onClick={() => onNavigate(link.page as any)}
                  className={`text-[16px] uppercase tracking-luxury font-bold transition-all relative group hover:text-luxury-gold ${
                    (activePage === link.page || (link.dropdown && link.dropdown.some(d => d.page === activePage)))
                      ? 'text-luxury-gold'
                      : textColorClass
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all group-hover:w-full ${(activePage === link.page || (link.dropdown && link.dropdown.some(d => d.page === activePage))) ? 'w-full' : ''}`}></span>
                </button>
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform origin-top border-t-2 border-luxury-gold z-[150]">
                    {link.dropdown.map((sub, subIdx) => (
                      <button
                        key={subIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(sub.page as any);
                        }}
                        className={`block w-full text-left px-6 py-4 text-[14px] uppercase tracking-widest font-bold transition-colors ${
                          activePage === sub.page ? 'text-luxury-gold bg-gray-50' : 'text-luxury-black hover:text-luxury-gold hover:bg-gray-50'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>"""

content = re.sub(desktop_menu_search, desktop_menu_replacement, content)

# Update mobile menu
mobile_menu_search = r"""            <ul className="space-y-8 px-10">
              \{navLinks\.map\(\(link, idx\) => \(
                <li key=\{idx\}>
                  <button onClick=\{\(\) => \{ setIsDrawerOpen\(false\); onNavigate\(link\.page as any\); \}\} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors block w-full">
                    \{link\.label\}
                  <\/button>
                <\/li>
              \)\)\}
            <\/ul>"""

mobile_menu_replacement = """            <ul className="space-y-8 px-10">
              {navLinks.map((link, idx) => (
                <li key={idx} className="flex flex-col">
                  <button onClick={() => { setIsDrawerOpen(false); onNavigate(link.page as any); }} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors block w-full">
                    {link.label}
                  </button>
                  {link.dropdown && (
                    <div className="mt-4 flex flex-col space-y-4 border-t border-luxury-border/30 pt-4">
                      {link.dropdown.map((sub, subIdx) => (
                        <button
                          key={subIdx}
                          onClick={() => { setIsDrawerOpen(false); onNavigate(sub.page as any); }}
                          className="text-lg font-bold uppercase tracking-brand text-luxury-gray hover:text-luxury-gold transition-colors block w-full"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>"""

content = re.sub(mobile_menu_search, mobile_menu_replacement, content)

with open('Navbar.tsx', 'w') as f:
    f.write(content)
