import { expect } from '@playwright/test'
import { acquireAccount } from './auth'

export const login = async (page) => {
    await acquireAccount(page)

    await expect(page.locator('#titleCrudTable')).toBeVisible({ timeout: 15000 });
}