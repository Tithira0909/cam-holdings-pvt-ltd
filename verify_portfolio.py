import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to homepage
        await page.goto("http://localhost:3000/")
        await page.wait_for_load_state("networkidle")

        # Click on Portfolio in Navbar
        print("Clicking on Portfolio nav item...")
        await page.get_by_text("Portfolio", exact=True).first.click()
        await page.wait_for_load_state("networkidle")

        print("Waiting for 'View Project' buttons to appear...")
        # Wait for the view project button to appear
        view_project_btn = page.locator("button:has-text('View Project')").first
        await view_project_btn.wait_for(state="visible", timeout=10000)

        print("Clicking the first 'View Project' button...")
        await view_project_btn.click(force=True)
        await page.wait_for_load_state("networkidle")

        print("Waiting for 'Back to Portfolio' button...")
        # Wait for the detailed view to load (Back to Portfolio button)
        back_btn = page.locator("button:has-text('Back to Portfolio')")
        await back_btn.wait_for(state="visible", timeout=10000)

        print("Taking screenshot of the portfolio detail page...")
        await page.screenshot(path="portfolio_detail.png", full_page=True)
        print("Done!")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
