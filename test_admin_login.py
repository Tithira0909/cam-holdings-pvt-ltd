from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Using context to handle localstorage properly
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Go to homepage
        page.goto('http://localhost:3000')
        page.wait_for_selector('div.hidden.lg\\:flex button:has-text("Lands")', timeout=5000)

        page.evaluate("""() => {
           const footerLoginBtn = document.querySelector('button.text-luxury-gray.hover\\\\:text-white.text-sm');
           if (footerLoginBtn && footerLoginBtn.textContent.includes('Admin Login')) {
               footerLoginBtn.click();
           } else {
               // Fallback if not found, simulate clicking the hidden trigger
               const nav = document.querySelector('nav');
               if (nav) {
                 // The app uses state for routing, not easily dispatchable from outside without the react component
                 // But we know there's a footer link for Admin Login
                 document.body.innerHTML += '<button id="hack-nav" onclick="document.querySelector(\\'button.text-luxury-gray.hover\\\\\\\\:text-white.text-sm\\').click()">hack</button>';
                 document.getElementById('hack-nav').click();
               }
           }
        }""")

        time.sleep(1)
        # We should be on login screen. Fill it.
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
        page.locator('button:has-text("Lands")').click() # Click a sidebar item to navigate away from dashboard
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
