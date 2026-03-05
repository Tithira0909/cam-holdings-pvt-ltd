import re

with open("App.tsx", "r") as f:
    content = f.read()

# 1. Add error state
content = re.sub(
    r'(const \[currentProperty, setCurrentProperty\] = useState<Property \| null>\(null\);)',
    r'\1\n  const [propertyError, setPropertyError] = useState<string | null>(null);',
    content
)

# 2. Reset error state on navigate
content = re.sub(
    r'(setCurrentProperty\(null\); // Reset while loading)',
    r'\1\n      setPropertyError(null);',
    content
)

# 3. Handle fetch error
fetch_func = """    if (activePage === 'detail' && selectedProjectId) {
      const fetchPropertyDetail = async () => {
        try {
          const res = await fetch(`/api/properties/${selectedProjectId}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentProperty(data);
          } else {
            setPropertyError('Failed to load property details.');
          }
        } catch (err) {
          console.error(err);
          setPropertyError('An error occurred while fetching property details.');
        }
      };
      fetchPropertyDetail();
    }"""
content = re.sub(
    r'    if \(activePage === \'detail\' && selectedProjectId\) \{.*?fetchPropertyDetail\(\);\n    \}',
    fetch_func,
    content,
    flags=re.DOTALL
)

# 4. Render error state
render_error = """          {activePage === 'detail' && selectedProjectId && (
            propertyError ? (
              <div className="pt-32 pb-20 px-mobile min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl text-red-500 font-serif mb-4">{propertyError}</h2>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition">Back to Properties</button>
              </div>
            ) : !currentProperty ? ("""

content = re.sub(
    r'          \{activePage === \'detail\' && selectedProjectId && \(\n            !currentProperty \? \(',
    render_error,
    content
)

# 5. Format price helper
format_helper = """
// Helper to format price nicely if it's purely numerical, otherwise return as is
const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price);
  if (!isNaN(num)) {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(num);
  }
  return price;
};

const App: React.FC = () => {"""

content = re.sub(
    r'const App: React\.FC = \(\) => \{',
    format_helper,
    content
)

# 6. Apply format price
content = re.sub(
    r'\{currentProperty\.price\}</p>',
    r'{formatPrice(currentProperty.price)}</p>',
    content
)

with open("App.tsx", "w") as f:
    f.write(content)
