import { expect } from '@playwright/test'
import { acquireAccount } from './auth'

export const login = async (page) => {
    await acquireAccount(page)
    const again = 0

    await expect(page.locator('#titleCrudTable'))
        .toBeVisible({ timeout: 20000 })
        .catch(async error => {
            if (again > 2) error('The login page is not visible')
            await page.reload();
        })
}