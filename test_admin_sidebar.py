from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800}) # Force desktop

        # Go to homepage
        page.goto('http://localhost:3000')

        # Set admin state in local storage to bypass login
        page.evaluate("window.localStorage.setItem('isAdmin', 'true')")

        # Go directly to admin route
        page.goto('http://localhost:3000/admin')

        # Wait for dashboard to load
        page.wait_for_selector('text="Dashboard Overview"', timeout=5000)

        # Verify the logo exists and is an image
        page.wait_for_selector('img[alt="CAM Admin Panel"]', timeout=5000)

        # Screenshot to visually verify
        page.screenshot(path="admin_sidebar_logo.png")

        # Test the click handler goes to dashboard view
        # First navigate away from dashboard view
        page.locator('button:has-text("Lands")').click()
        time.sleep(1)
        # Verify we changed view
        page.wait_for_selector('text="All Properties"', timeout=5000)

        # Click the logo div
        page.locator('img[alt="CAM Admin Panel"]').locator('..').click()
        time.sleep(1)

        # Verify we are back on the dashboard view
        page.wait_for_selector('text="Dashboard Overview"', timeout=5000)

        print("Admin sidebar test passed!")
        browser.close()

if __name__ == '__main__':
    test()
