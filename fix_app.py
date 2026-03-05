import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Make sure we don't have multiple copies
# Fix the popstate listener parsing
fix_popstate = """  const getInitialPage = (): Page => {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';
    if (path.startsWith('/portfolio')) return 'portfolio';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/virtual-tour')) return 'virtual-tour';
    if (path.startsWith('/testimonials')) return 'testimonials';
    if (path.startsWith('/kyc')) return 'kyc';
    if (path.startsWith('/privacy')) return 'privacy';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/publications')) return 'publications';
    if (path.startsWith('/blogs')) return 'blogs';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  };"""

content = re.sub(
    r"  const getInitialPage = \(\): Page => \{.*?(?=  const \[activePage)",
    fix_popstate + "\n",
    content,
    flags=re.DOTALL
)

with open('App.tsx', 'w') as f:
    f.write(content)
