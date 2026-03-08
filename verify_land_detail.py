from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 900})

        # Go to properties/lands
        page.goto("http://localhost:3000/properties/lands")
        page.wait_for_load_state("networkidle")

        # Click the first EXPLORE button
        print("Looking for EXPLORE button...")
        explore_button = page.locator("button:has-text('EXPLORE')").first
        if explore_button.count() == 0:
            print("EXPLORE button not found.")
            page.screenshot(path="debug5.png")
            browser.close()
            return

        print("Clicking EXPLORE button...")
        explore_button.click()

        # Wait for the detail page to load
        page.wait_for_load_state("networkidle")

        # Scroll a bit down to show the content
        page.evaluate("window.scrollBy(0, 300)")

        # Take a screenshot
        page.screenshot(path="land_detail_screenshot.png", full_page=True)
        print("Screenshot saved to land_detail_screenshot.png")

        browser.close()

if __name__ == "__main__":
    run()
