from playwright.sync_api import sync_playwright
import time

def test_portfolio_navbar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3004')
        page.wait_for_selector('text="Portfolio Properties"')

        # Click on Portfolio Properties
        page.click('text="Portfolio Properties"')
        time.sleep(2)

        # Take screenshot
        page.screenshot(path='portfolio_navbar.png', full_page=False)
        browser.close()

if __name__ == "__main__":
    test_portfolio_navbar()
