import re

with open("components/Navbar.tsx", "r") as f:
    content = f.read()

# Fix types to allow 'lands', 'properties', 'houses'
old_props = """  onNavigate: (page: 'home' | 'projects' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'virtual-tour' | 'news' | 'publications' | 'blogs') => void;"""
new_props = """  onNavigate: (page: 'home' | 'properties' | 'lands' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'virtual-tour' | 'news' | 'publications' | 'blogs') => void;"""

content = content.replace(old_props, new_props)

with open("components/Navbar.tsx", "w") as f:
    f.write(content)
