import re

with open("components/Hero.tsx", "r") as f:
    content = f.read()

# Add useEffect and state to fetch the hero image from site settings
imports = "import React, { useState, useEffect } from 'react';\nimport { MapPin, Home } from 'lucide-react';"

state_and_effect = """
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/site');
        if (res.ok) {
          const data = await res.json();
          if (data.hero_image_url) {
            setHeroImage(data.hero_image_url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch site settings for hero image', err);
      }
    };
    fetchSettings();
  }, []);
"""

content = re.sub(r'import React from \'react\';\nimport \{ MapPin, Home \} from \'lucide-react\';', imports, content)
content = re.sub(r'const Hero: React.FC<HeroProps> = \(\{ onNavigate \}\) => \{', 'const Hero: React.FC<HeroProps> = ({ onNavigate }) => {' + state_and_effect, content)

# Use the heroImage in the backgroundImage style
bg_style = """        style={{
          backgroundImage: `url(${heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600'})`,
          animation: 'cinematicMotion 25s linear infinite'
        }}"""

content = re.sub(
    r'        style=\{\{ \n          backgroundImage: `url\(\'https://images\.unsplash\.com/photo-1600585154340-be6161a56a0c\?auto=format&fit=crop&q=80&w=1600\'\)`,\n          animation: \'cinematicMotion 25s linear infinite\'\n        \}\}',
    bg_style,
    content
)

with open("components/Hero.tsx", "w") as f:
    f.write(content)
