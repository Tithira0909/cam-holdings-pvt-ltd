import re

with open("App.tsx", "r") as f:
    content = f.read()

# Fix app types and page names
old_active_page_init = """    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';
    if (path.startsWith('/houses')) return 'houses';"""

new_active_page_init = """    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';"""

content = content.replace(old_active_page_init, new_active_page_init)

old_popstate = """      if (path.startsWith('/properties')) {
        setActivePage('properties');
      } else if (path.startsWith('/houses')) {
        setActivePage('houses');
      }"""

new_popstate = """      if (path.startsWith('/properties/lands')) {
        setActivePage('lands');
      } else if (path.startsWith('/properties/houses')) {
        setActivePage('houses');
      } else if (path.startsWith('/properties')) {
        setActivePage('properties');
      }"""
content = content.replace(old_popstate, new_popstate)


old_navigate = """    if (page === 'properties' || page === 'lands' || page === 'houses' || page === 'projects') {
      const displayPage = page === 'projects' ? 'properties' : page;
      window.history.pushState({}, '', displayPage === 'properties' ? '/properties' : `/properties/${displayPage}`);
    }"""

new_navigate = """    if (page === 'properties' || page === 'lands' || page === 'houses') {
      window.history.pushState({}, '', page === 'properties' ? '/properties' : `/properties/${page}`);
    }"""
content = content.replace(old_navigate, new_navigate)

with open("App.tsx", "w") as f:
    f.write(content)
