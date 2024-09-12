import { test as setup, expect } from '@playwright/test'
import { createSession  } from '../auth'

const URL = 'http://localhost:8080/#/'

setup('authenticate', async ({ page }) => {
    await page.goto(URL);
    await createSession(page)
    await page.reload()

    await expect(page.locator('#titleCrudTable')).toBeVisible({ timeout: 15000 });
})