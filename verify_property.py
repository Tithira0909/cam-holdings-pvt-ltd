import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Adjust URL to match the running local server
        await page.goto('http://localhost:3004')

        # Wait for the page to load
        await page.wait_for_selector('text=PROPERTIES', timeout=10000)

        print("Hovering over PROPERTIES...")
        await page.hover('text=PROPERTIES')

        print("Clicking HOUSES...")
        await page.click('text=HOUSES')

        # Wait for the houses page to load properties
        await page.wait_for_timeout(2000)
        await page.screenshot(path='/home/jules/verification/properties_houses.png', full_page=True)
        print("Captured properties_houses.png")

        # Click on the first property's "Explore" button
        explore_buttons = await page.query_selector_all('text=/Explore/')
        if explore_buttons:
            print("Found 'Explore' button, clicking...")
            await explore_buttons[0].click()
            await page.wait_for_timeout(3000)
            await page.screenshot(path='/home/jules/verification/property_detail.png', full_page=True)
            print("Captured property_detail.png")
        else:
            print("No 'Explore' button found.")

        await browser.close()

asyncio.run(run())
