import sys

def update_schema():
    with open('database/sqlite_schema.sql', 'r') as f:
        content = f.read()

    search = """  hotlineNumber TEXT,
  sortOrder INTEGER DEFAULT 0,"""
    replace = """  hotlineNumber TEXT,
  whatsappNumber TEXT,
  logoImage TEXT,
  blockPlanImage TEXT,
  roadMapImage TEXT,
  locationMapImage TEXT,
  projectStatusLabel TEXT,
  travelHighlights TEXT,
  inquiryEmail TEXT,
  relatedLands TEXT,
  metaTitle TEXT,
  metaDescription TEXT,
  ogImage TEXT,
  sortOrder INTEGER DEFAULT 0,"""

    if search in content:
        content = content.replace(search, replace)
        with open('database/sqlite_schema.sql', 'w') as f:
            f.write(content)
        print("Updated database/sqlite_schema.sql")
    else:
        print("Could not find string to replace in database/sqlite_schema.sql")

    with open('database/schema.sql', 'r') as f:
        content = f.read()

    search = """  hotlineNumber VARCHAR(50),
  sortOrder INT DEFAULT 0,"""
    replace = """  hotlineNumber VARCHAR(50),
  whatsappNumber VARCHAR(50),
  logoImage VARCHAR(255),
  blockPlanImage VARCHAR(255),
  roadMapImage VARCHAR(255),
  locationMapImage VARCHAR(255),
  projectStatusLabel VARCHAR(255),
  travelHighlights TEXT,
  inquiryEmail VARCHAR(255),
  relatedLands TEXT,
  metaTitle VARCHAR(255),
  metaDescription TEXT,
  ogImage VARCHAR(255),
  sortOrder INT DEFAULT 0,"""

    if search in content:
        content = content.replace(search, replace)
        with open('database/schema.sql', 'w') as f:
            f.write(content)
        print("Updated database/schema.sql")
    else:
        print("Could not find string to replace in database/schema.sql")

if __name__ == "__main__":
    update_schema()