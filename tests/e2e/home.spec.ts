import { test, expect } from '../shared-context'

const URL = 'http://localhost:8080/#/'

test.use({ baseURL: URL });

test('Quick start test', async ({ page }) => {
    await expect(page.locator('#subContent').getByRole('button')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.locator('#versionContent')).toBeVisible();
    await expect(page.locator('#siteActionscomponent div').first()).toBeVisible();
    await expect(page.locator('button').first()).toBeVisible();
    await expect(page.locator('button').nth(2)).toBeVisible();
    await expect(page.getByRole('button', { name: 'michael' })).toBeVisible();
    await page.getByRole('button', { name: 'michael' }).click();
    await expect(page.getByRole('button', { name: 'Mi Cuenta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Configuraciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
})