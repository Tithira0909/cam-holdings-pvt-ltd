from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Using context to handle localstorage properly
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Go to homepage
        page.goto('http://localhost:3000/admin')

        # We should be on login screen. Fill it.
        page.wait_for_selector('input[type="text"]', timeout=5000)
        page.fill('input[type="text"]', 'admin')
        page.fill('input[type="password"]', 'admin123')

        # Submit
        page.click('button[type="submit"]')

        # Wait for dashboard to load
        page.wait_for_selector('text="Dashboard Overview"', timeout=5000)

        # Verify the logo exists and is an image
        page.wait_for_selector('img[alt="CAM Admin Panel"]', timeout=5000)

        # Screenshot to visually verify
        page.screenshot(path="admin_sidebar_logo.png")

        # Test the click handler goes to dashboard view
        # First navigate away from dashboard view
        page.locator('button >> text="Properties"').click()
        time.sleep(1)

        # Click the logo div
        page.locator('img[alt="CAM Admin Panel"]').locator('..').click()
        time.sleep(1)

        # Verify we are back on the dashboard view
        page.wait_for_selector('text="Dashboard Overview"', timeout=5000)

        print("Admin sidebar test passed!")
        context.close()
        browser.close()

if __name__ == '__main__':
    test()
