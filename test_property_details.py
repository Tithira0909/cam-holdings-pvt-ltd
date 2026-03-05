import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        print("Navigating to properties page...")
        await page.goto("http://localhost:3000/properties")
        await page.wait_for_load_state("networkidle")

        # Hide any overlays or modals
        await page.evaluate("""
            const modals = document.querySelectorAll('.fixed.inset-0');
            modals.forEach(m => m.style.display = 'none');
        """)

        print("Clicking the first 'View Details' button...")
        view_details_btn = page.locator("button:has-text('View Details')").first
        await view_details_btn.wait_for(state="visible", timeout=10000)
        await view_details_btn.click()
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Force hide any overlays or modals that pop up on the detail page
        await page.evaluate("""
            const modals = document.querySelectorAll('.fixed.inset-0.z-\\\\[100\\\\]');
            modals.forEach(m => m.style.display = 'none');
        """)

        print("Taking detail screenshot...")
        await page.screenshot(path="debug_property_detail.png", full_page=True)

        # Test clicking a gallery image
        print("Clicking a gallery image...")
        gallery_image = page.locator("img[alt^='Gallery image']").first
        if await gallery_image.is_visible():
            await gallery_image.click()
            await page.wait_for_timeout(1000)
            print("Taking modal screenshot...")
            await page.screenshot(path="debug_property_detail_modal.png", full_page=True)
        else:
            print("No gallery image found.")

        print("Done!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
