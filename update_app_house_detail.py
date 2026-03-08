import re

with open("App.tsx", "r") as f:
    content = f.read()

# Add import
import_statement = "import HouseDetail from './components/HouseDetail';\n"
if "import HouseDetail" not in content:
    content = content.replace("import LandDetail from './components/LandDetail';", "import LandDetail from './components/LandDetail';\n" + import_statement)

# Update detail view rendering
detail_view_search = """              {currentProperty.type?.toLowerCase() === 'land' || currentProperty.type?.toLowerCase() === 'lands' ? (
                <LandDetail
                  property={currentProperty}
                  onNavigate={navigate}
                  recommendedLands={properties.filter(p => p.id !== currentProperty.id && (p.type?.toLowerCase() === 'land' || p.type?.toLowerCase() === 'lands'))}
                  onOpenConsultation={() => setIsModalOpen(true)}
                  setSelectedImage={setSelectedImage}
                />
              ) : ("""

detail_view_replace = """              {currentProperty.type?.toLowerCase() === 'land' || currentProperty.type?.toLowerCase() === 'lands' ? (
                <LandDetail
                  property={currentProperty}
                  onNavigate={navigate}
                  recommendedLands={properties.filter(p => p.id !== currentProperty.id && (p.type?.toLowerCase() === 'land' || p.type?.toLowerCase() === 'lands'))}
                  onOpenConsultation={() => setIsModalOpen(true)}
                  setSelectedImage={setSelectedImage}
                />
              ) : currentProperty.type?.toLowerCase() === 'house' || currentProperty.type?.toLowerCase() === 'apartment' ? (
                <HouseDetail
                  property={currentProperty}
                  onNavigate={navigate}
                  recommendedHouses={properties.filter(p => p.id !== currentProperty.id && (p.type?.toLowerCase() === 'house' || p.type?.toLowerCase() === 'apartment'))}
                  onOpenConsultation={() => setIsModalOpen(true)}
                  setSelectedImage={setSelectedImage}
                />
              ) : ("""

content = content.replace(detail_view_search, detail_view_replace)

with open("App.tsx", "w") as f:
    f.write(content)
