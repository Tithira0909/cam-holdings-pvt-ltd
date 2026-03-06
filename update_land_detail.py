import sys
import re

def update_land_detail():
    with open('components/LandDetail.tsx', 'r') as f:
        content = f.read()

    # Add import
    import_search = "import LandCard from './LandCard';"
    import_replace = "import LandCard from './LandCard';\nimport LoanCalculator from './LoanCalculator';"
    if import_search in content and "import LoanCalculator" not in content:
        content = content.replace(import_search, import_replace)

    # Add to main content area
    loan_search = """               {/* 4. Plan / Map / Location Tabs */}"""
    loan_replace = """               {/* 5. Loan Calculator */}
               <section>
                  <LoanCalculator initialAmount={Number(property.price?.replace(/[^0-9]/g, '')) || 5000000} />
               </section>

               {/* 4. Plan / Map / Location Tabs */}"""

    if loan_search in content:
        content = content.replace(loan_search, loan_replace)

    with open('components/LandDetail.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_land_detail()