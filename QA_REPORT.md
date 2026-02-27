# QA/QC Report

## 1. Feature: Dynamic Hero Image

| Test Case | Description | Status | Notes |
| :--- | :--- | :--- | :--- |
| **TC-01** | Upload valid image via Admin | **Passed** | Image uploads to `/public/uploads` and updates `site_settings`. |
| **TC-02** | Verify image on Homepage | **Passed** | Frontend correctly fetches from `/api/settings/hero` and updates state. |
| **TC-03** | Upload invalid file type | **Passed** | Multer validation handles this (though we could add stricter frontend checks). |
| **TC-04** | Fallback behavior | **Passed** | Default Unsplash image loads if API returns nothing or fails. |
| **TC-05** | Mobile Responsiveness | **Passed** | `bg-cover` ensures image scales correctly on mobile. |

## 2. System Wide Health Check

| Test Case | Description | Status | Notes |
| :--- | :--- | :--- | :--- |
| **TC-06** | Service CRUD | **Passed** | Verified creating and editing services via API endpoints. |
| **TC-07** | Service Detail Page | **Passed** | Verified slug-based routing works. |
| **TC-08** | Property Listings | **Passed** | Properties load correctly from SQLite database. |
| **TC-09** | Image Gallery | **Passed** | Multiple image upload works for properties. |
| **TC-10** | Contact Inquiry | **Passed** | Form submits to `inquiries` table; email sending attempts (mocked). |

## 3. Bug Fixes (Recent Round)

| Test Case | Description | Status | Notes |
| :--- | :--- | :--- | :--- |
| **TC-11** | Property Update Refresh | **Passed** | Updated `Dashboard` to trigger `fetchData` in `App.tsx` upon successful add/edit. Frontend now updates immediately. |
| **TC-12** | Property Detail View | **Passed** | Enhanced `App.tsx` detail view to show description, gallery, status, and price. No longer a placeholder. |
| **TC-13** | Settings Tab Navigation | **Passed** | Verified `activeView === 'settings'` logic in `Dashboard.tsx`. |

## 4. Recommendations

*   **Security:** Add authentication middleware to `/api/admin/*` routes. Currently, they are unprotected.
*   **Performance:** Implement image optimization (WebP conversion) on upload to reduce file size.
*   **UX:** Add a "toast" notification system for better success/error feedback instead of browser alerts.
