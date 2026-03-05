import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        await page.goto("http://localhost:3000")

        # Wait for the Properties nav item to appear
        properties_nav = page.locator("text=PROPERTIES").first
        await properties_nav.wait_for()

        # Hover over the Properties nav item
        await properties_nav.hover()

        # Wait for the dropdown to become visible.
        # It should contain LANDS and HOUSES.
        dropdown = page.locator("text=LANDS").first
        await dropdown.wait_for(state="visible", timeout=5000)

        # Capture screenshot of the viewport
        await page.screenshot(path="properties_dropdown.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
