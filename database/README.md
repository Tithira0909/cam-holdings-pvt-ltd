# Database Setup

This directory contains the SQL scripts to set up the MySQL database for the project.

## Files

- `schema.sql`: Contains the database schema (tables for properties, floor_plans, and projects).
- `seed.sql`: Contains the initial data to populate the tables.

## How to use

1.  Create a MySQL database (e.g., `cam_holdings`).
2.  Run the `schema.sql` script to create the tables.
3.  Run the `seed.sql` script to populate the database with initial data.

### Example using command line:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cam_holdings;
USE cam_holdings;

# Run schema
SOURCE /path/to/project/database/schema.sql;

# Run seed data
SOURCE /path/to/project/database/seed.sql;
```

## Tables

- **properties**: Stores property listings (Land, House, Apartment).
- **floor_plans**: Stores floor plan images associated with properties.
- **projects**: Stores portfolio projects.
