import { test, expect } from '../shared-context'
import { config } from '../config'

test.use({ baseURL: config.url });

test('Quick start test', async ({ page }) => {
    await expect(page.locator('#subContent').getByRole('button')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.locator('#versionContent')).toBeVisible();
    await expect(page.locator('#siteActionscomponent div').first()).toBeVisible();
    await expect(page.locator('button').first()).toBeVisible();
    await expect(page.locator('button').nth(2)).toBeVisible();

    const menu = page.locator('id=profileButton');
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.getByRole('button', { name: 'Mi Cuenta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Configuraciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
})