import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix navigate function to properly handle properties, lands, houses
navigate_search = r"""  const navigate = \(page: Page, id\?: string\) => \{
    setActivePage\(page\);
    if \(page === 'detail' && id\) setSelectedProjectId\(id\);
    if \(page === 'portfolio-detail' && id\) \{
      setSelectedPortfolioId\(id\);
      setCurrentPortfolio\(null\); \/\/ Reset while loading
    \}
    if \(page === 'service-detail' && id\) \{
      setSelectedServiceSlug\(id\);
      setCurrentService\(null\); \/\/ Reset while loading
    \}
    if \(page === 'properties' \|\| page === 'lands' \|\| page === 'houses'\) \{
      window\.history\.pushState\(\{\}, '', page === 'properties' \? '\/properties' : `\/properties/\$\{page\}`\);
    \} else if \(page === 'projects'\) \{
      window\.history\.pushState\(\{\}, '', '\/properties'\);
    \} else if \(page === 'houses'\) \{
      window\.history\.pushState\(\{\}, '', '\/houses'\);
    \} else if \(page === 'portfolio-detail' && id\) \{
      window\.history\.pushState\(\{\}, '', `\/portfolio/\$\{id\}`\);"""

navigate_replace = """  const navigate = (page: Page, id?: string) => {
    setActivePage(page);
    if (page === 'detail' && id) setSelectedProjectId(id);
    if (page === 'portfolio-detail' && id) {
      setSelectedPortfolioId(id);
      setCurrentPortfolio(null); // Reset while loading
    }
    if (page === 'service-detail' && id) {
      setSelectedServiceSlug(id);
      setCurrentService(null); // Reset while loading
    }
    if (page === 'properties' || page === 'lands' || page === 'houses' || page === 'projects') {
      const displayPage = page === 'projects' ? 'properties' : page;
      window.history.pushState({}, '', displayPage === 'properties' ? '/properties' : `/properties/${displayPage}`);
    } else if (page === 'portfolio-detail' && id) {
      window.history.pushState({}, '', `/portfolio/${id}`);"""

content = re.sub(navigate_search, navigate_replace, content)

with open('App.tsx', 'w') as f:
    f.write(content)
