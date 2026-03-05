1. Modify Navbar.tsx:
  - Update `navLinks` so that the `Properties` item supports dropdown functionality.
  - Implement dropdown logic on Desktop (hover) and Mobile (tap).
  - Routes for properties:
    - `PROPERTIES` -> `/properties` (or handle internally as `page: 'properties'`)
    - `LANDS` -> `/properties/lands`
    - `HOUSES` -> `/properties/houses`
    Since the application uses `activePage` state for routing (passed via `onNavigate`), I'll need to modify `App.tsx` and `Navbar.tsx` to handle these specific paths, probably updating `onNavigate` signature.

2. Modify App.tsx:
  - Update `onNavigate` to accept `properties` (all), `properties/lands`, and `properties/houses`.
  - Add logic in the rendering of the `projects` (which is Properties) section to filter based on the `activePage` value.
  - If `activePage === 'properties'`, show all.
  - If `activePage === 'properties/lands'`, filter by `type.toLowerCase() === 'land'`.
  - If `activePage === 'properties/houses'`, filter by `type.toLowerCase() === 'house'`.
  - Also ensure that "Properties" (page='projects') in the main menu points to `properties`. I will replace `projects` with `properties`.

3. Ensure API fetches all properties.
  - The API fetch currently populates the `properties` state. We can filter this state based on the current active page/filter before rendering.

4. Test filtering and navigation:
  - Check desktop hover and mobile drawer.
  - Ensure correct page titles ("All Properties", "Lands", "Houses").

5. Pre-commit steps.

6. Submit.
