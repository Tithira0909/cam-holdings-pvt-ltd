import sqlite3

def alter_table():
    conn = sqlite3.connect('database/database.sqlite')
    c = conn.cursor()

    columns_to_add = [
        ("logoImage", "TEXT"),
        ("blockPlanImage", "TEXT"),
        ("roadMapImage", "TEXT"),
        ("locationMapImage", "TEXT"),
        ("projectStatusLabel", "TEXT"),
        ("travelHighlights", "TEXT"),
        ("inquiryEmail", "TEXT"),
        ("relatedLands", "TEXT"),
        ("metaTitle", "TEXT"),
        ("metaDescription", "TEXT"),
        ("ogImage", "TEXT"),
        ("whatsappNumber", "TEXT")
    ]

    # Get existing columns
    c.execute("PRAGMA table_info(properties)")
    existing_columns = [row[1] for row in c.fetchall()]

    for col_name, col_type in columns_to_add:
        if col_name not in existing_columns:
            try:
                c.execute(f"ALTER TABLE properties ADD COLUMN {col_name} {col_type}")
                print(f"Added column {col_name}")
            except Exception as e:
                print(f"Failed to add column {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    alter_table()
