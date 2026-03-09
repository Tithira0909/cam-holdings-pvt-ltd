from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800}) # Force desktop
        page.goto('http://localhost:3000')
        page.wait_for_selector('div.hidden.lg\\:flex button:has-text("Lands")', timeout=5000)

        page.locator('div.hidden.lg\\:flex button:has-text("Lands")').click()
        time.sleep(1)
        page.screenshot(path="after_lands.png", full_page=True)

        page.locator('div.hidden.lg\\:flex button:has-text("Houses")').click()
        time.sleep(1)
        page.screenshot(path="after_houses.png", full_page=True)

        browser.close()

if __name__ == '__main__':
    test()
