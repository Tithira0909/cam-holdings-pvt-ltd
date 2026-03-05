from playwright.sync_api import sync_playwright
import time

def test_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs to see filter debugging
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        # Wait longer for initial load to let data fetch
        print("Navigating to Properties...")
        page.goto("http://localhost:3000/properties", wait_until="networkidle")
        time.sleep(2) # Give React time to render if API is slow
        try:
            page.wait_for_selector('h2:has-text("All Properties")', timeout=10000)
            page.screenshot(path="after_properties.png", full_page=True)
        except Exception as e:
            print(f"Error on Properties: {e}")
            page.screenshot(path="error_properties.png", full_page=True)

        print("Navigating to Lands...")
        page.goto("http://localhost:3000/properties/lands", wait_until="networkidle")
        time.sleep(2)
        try:
            page.wait_for_selector('h2:has-text("Lands")', timeout=10000)
            page.screenshot(path="after_lands.png", full_page=True)
        except Exception as e:
            print(f"Error on Lands: {e}")
            page.screenshot(path="error_lands.png", full_page=True)

        print("Navigating to Houses...")
        page.goto("http://localhost:3000/properties/houses", wait_until="networkidle")
        time.sleep(2)
        try:
            page.wait_for_selector('h2:has-text("Houses")', timeout=10000)
            page.screenshot(path="after_houses.png", full_page=True)
        except Exception as e:
            print(f"Error on Houses: {e}")
            page.screenshot(path="error_houses.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    test_navigation()
