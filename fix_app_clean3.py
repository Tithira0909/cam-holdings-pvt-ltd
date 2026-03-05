import re

with open("App.tsx", "r") as f:
    content = f.read()

# Fix the condition to show the properties section
old_condition = """        {/* 4. Properties Page */}
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses' || activePage === 'projects') && ("""
new_condition = """        {/* 4. Properties Page */}
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses') && ("""
content = content.replace(old_condition, new_condition)

# Fix the duplicate 'projects' check later
old_condition_2 = """        {/* 4. Properties Page */}
        {activePage === 'projects' && ("""
new_condition_2 = """        {/* 4. Properties Page Duplicate Remove */}
        {false && ("""
content = content.replace(old_condition_2, new_condition_2)

with open("App.tsx", "w") as f:
    f.write(content)
