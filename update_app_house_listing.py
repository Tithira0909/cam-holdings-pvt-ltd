import re

with open("App.tsx", "r") as f:
    content = f.read()

# Add import
import_statement = "import HouseCard from './components/HouseCard';\n"
if "import HouseCard" not in content:
    content = content.replace("import PropertyCard from './components/PropertyCard';", "import PropertyCard from './components/PropertyCard';\n" + import_statement)

# Update grid rendering
grid_search = """                        {activePage === 'lands' ? (
                          paginated.map(property => (
                            <LandCard
                              key={property.id}
                              property={property}
                              onClick={() => navigate('detail', property.id)}
                            />
                          ))
                        ) : (
                          paginated.map(property => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onClick={() => navigate('detail', property.id)}
                            />
                          ))
                        )}"""

grid_replace = """                        {activePage === 'lands' ? (
                          paginated.map(property => (
                            <LandCard
                              key={property.id}
                              property={property}
                              onClick={() => navigate('detail', property.id)}
                            />
                          ))
                        ) : activePage === 'houses' ? (
                          paginated.map(property => (
                            <HouseCard
                              key={property.id}
                              property={property}
                              onClick={() => navigate('detail', property.id)}
                            />
                          ))
                        ) : (
                          paginated.map(property => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onClick={() => navigate('detail', property.id)}
                            />
                          ))
                        )}"""

content = content.replace(grid_search, grid_replace)

with open("App.tsx", "w") as f:
    f.write(content)
