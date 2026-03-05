import re
with open("App.tsx", "r") as f:
    content = f.read()

import sys
if 'setPropertyError' not in content:
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

    render_error = """          {activePage === 'detail' && selectedProjectId && (
            propertyError ? (
              <div className="pt-32 pb-20 px-mobile min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl text-red-500 font-serif mb-4">{propertyError}</h2>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition">Back to Properties</button>
              </div>
            ) : !currentProperty ? ("""

    content = content.replace("          {activePage === 'detail' && selectedProjectId && (\n            !currentProperty ? (", render_error)

with open("App.tsx", "w") as f:
    f.write(content)
