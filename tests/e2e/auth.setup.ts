import { test as setup, expect } from '@playwright/test'
import { createSession  } from '../auth'
import { config } from '../config'

setup('authenticate', async ({ page }) => {
    await page.goto(config.url);
    await createSession(page)
    await page.reload()

    await expect(page.locator('#titleCrudTable')).toBeVisible({ timeout: 15000 });
})