import re

# Looks like grid-cols are already responsive using tailwind prefixes (e.g., grid-cols-1 md:grid-cols-2).
# Let's ensure Navbar mobile drawer padding is good.

with open("components/Navbar.tsx", "r") as f:
    content = f.read()

# Let's check the mobile navigation drawer sizing:
if 'w-64' in content and 'lg:hidden' in content: # Usually mobile drawers are w-64 or w-[80%]
    pass # They look standard

with open("Navbar.tsx", "r") as f:
    root_content = f.read()

# Ensure images don't overflow on property details
with open("App.tsx", "r") as f:
    app_content = f.read()

app_content = app_content.replace('className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"', 'className="max-w-[100vw] max-h-[90vh] object-contain rounded-md shadow-2xl"')

with open("App.tsx", "w") as f:
    f.write(app_content)
