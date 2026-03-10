import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 2000})
        await page.goto("http://localhost:3000")

        # Click on LANDS explicitly based on memory instructions
        await page.click("text=LANDS")

        await page.wait_for_timeout(2000)

        await page.screenshot(path="lands_page.png", full_page=True)
        await browser.close()

asyncio.run(run())
