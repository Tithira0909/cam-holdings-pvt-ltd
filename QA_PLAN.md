# QA/QC Plan - Hero Image Feature & System Health

## 1. Feature: Dynamic Hero Image

### 1.1 Requirements
- Admin should be able to upload a new hero image from the dashboard.
- The public homepage (Hero component) should fetch and display this image.
- If no custom image is set, it should fall back to the default Unsplash image.
- Supported formats: JPG, PNG, WEBP.
- Max size: 5MB (to prevent server overload).

### 1.2 Test Cases
- [ ] **TC-01**: Upload a valid image via Admin Dashboard. Verify success message.
- [ ] **TC-02**: Verify the new image appears on the Homepage.
- [ ] **TC-03**: Upload an invalid file type (e.g., PDF). Verify error handling.
- [ ] **TC-04**: Verify fallback behavior when no image is set in the database.
- [ ] **TC-05**: Mobile Responsiveness - Check how the new image looks on mobile screens.

## 2. System Wide QA/QC (Bug Hunt)

### 2.1 Services
- [ ] **TC-06**: Verify Service creation, editing, and deletion.
- [ ] **TC-07**: Verify Service Detail page loads correctly.

### 2.2 Properties
- [ ] **TC-08**: Verify Property listing and detail views.
- [ ] **TC-09**: Check image gallery loading.

### 2.3 Inquiries
- [ ] **TC-10**: Submit a contact form inquiry. Verify it appears in Admin.

### 2.4 Performance & Security
- [ ] **TC-11**: Check for large layout shifts (CLS) on image load.
- [ ] **TC-12**: Ensure API endpoints handle errors gracefully (500/404).

## 3. Reporting
- All findings will be documented in `QA_REPORT.md`.
