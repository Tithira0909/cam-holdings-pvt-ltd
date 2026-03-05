from playwright.sync_api import sync_playwright
import time

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800}) # Force desktop
        page.goto('http://localhost:3000')
        page.wait_for_selector('text="Properties"', timeout=5000)

        # We need to click the desktop menu one
        page.locator('div.hidden.lg\\:flex >> text="Properties"').click()
        time.sleep(1) # wait for animation
        page.screenshot(path="after_properties.png", full_page=True)

        page.locator('div.hidden.lg\\:flex >> text="Properties"').hover()
        time.sleep(1) # wait for dropdown
        page.locator('div.hidden.lg\\:flex >> text="Lands"').click()
        time.sleep(1)
        page.screenshot(path="after_lands.png", full_page=True)

        page.locator('div.hidden.lg\\:flex >> text="Properties"').hover()
        time.sleep(1) # wait for dropdown
        page.locator('div.hidden.lg\\:flex >> text="Houses"').click()
        time.sleep(1)
        page.screenshot(path="after_houses.png", full_page=True)

        browser.close()

if __name__ == '__main__':
    test()
