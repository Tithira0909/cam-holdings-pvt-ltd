# Database Setup

This directory contains the SQL files to set up the MySQL database for the Real Estate application.

## Prerequisites

- MySQL Server installed and running.
- A MySQL client (CLI or GUI like MySQL Workbench, DBeaver).

## Instructions

1.  **Create the Database and Tables:**
    Run the `schema.sql` file to create the database (`real_estate_db`) and the required tables (`properties`, `floor_plans`, `projects`).

    ```bash
    mysql -u your_username -p < schema.sql
    ```

2.  **Seed the Database:**
    Run the `seed.sql` file to populate the tables with initial data.

    ```bash
    mysql -u your_username -p < seed.sql
    ```

## Schema Overview

-   **properties**: Stores property listings (Land, House, Apartment).
-   **floor_plans**: Stores floor plan images related to properties.
-   **projects**: Stores company projects.
