import sys

def update_types():
    with open('types.ts', 'r') as f:
        content = f.read()

    search = """  hotlineNumber?: string;"""
    replace = """  hotlineNumber?: string;
  whatsappNumber?: string;
  logoImage?: string;
  blockPlanImage?: string;
  roadMapImage?: string;
  locationMapImage?: string;
  projectStatusLabel?: string;
  travelHighlights?: { id: string, label: string, time: string }[];
  inquiryEmail?: string;
  relatedLands?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;"""

    if search in content:
        content = content.replace(search, replace)
        with open('types.ts', 'w') as f:
            f.write(content)
        print("Updated types.ts")
    else:
        print("Could not find string to replace in types.ts")

if __name__ == "__main__":
    update_types()