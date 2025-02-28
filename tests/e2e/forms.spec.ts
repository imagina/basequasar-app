import { test, expect } from '../shared-context'
import { config } from '../config'
import { deleteItem } from './common-tests'
import { fillFields } from './helpers'

test.use({ baseURL: config.url + '/ecommerce/warehouses' });

const openModal = async (page) => {
    const tr = await page.locator('tbody').locator('.q-tr.tw-bg-white').first();
    await expect(tr).toBeVisible({ timeout: 60000 });
    await tr.getByRole('button').last().click();
}

const routes = [
    '/ecommerce/products',
    '/ecommerce/warehouses',
    '/ecommerce/quantity-classes',
]

const create = async (page) => {
    await page.locator('id=new-button-crud').click()
        
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')

    await fillFields(page, expect)

    // Click on the save button
    await page.getByTestId('modal-actions').locator('button').nth(1).click()

    // The successful creation alert is expected to be displayed
    await expect(page.getByRole('alert').getByText('Registro creado')).toBeVisible({ timeout: 15000 })
}

const update = async (page) => {
    await openModal(page)
    await page.locator('a').filter({ hasText: 'Editar' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('load')
    await fillFields(page, expect, true)

    // Click on the save button
    await page.getByTestId('modal-actions').locator('button').nth(1).click()

    // The successful creation alert is expected to be displayed
    await expect(page.getByRole('alert').getByText('Registro actualizado')).toBeVisible({ timeout: 10000 })
}

const deleteTest = async (page) => {
    await openModal(page)
    // const id: any = await tr.locator('td').nth(2).textContent()

    await deleteItem(page, expect)
    await expect(page.getByRole('alert').getByText('Registro eliminado')).toBeVisible({ timeout: 7000 })
    // await expect(page.locator('table').getByText(id)).toBeHidden({ timeout: 60000 });
}

test.describe.serial('Test the integrity of the forms', () => {
    test('Create', async ({ page }) => {
        await create(page)
    })

    test('Update', async ({ page }) => {
        await openModal(page)
        await page.locator('a').filter({ hasText: 'Editar' }).click()
        await page.waitForLoadState('networkidle')
        await page.waitForLoadState('load')
        await fillFields(page, expect, true)

        // Click on the save button
        await page.getByTestId('modal-actions').locator('button').nth(1).click()
    
        // The successful creation alert is expected to be displayed
        await expect(page.getByRole('alert').getByText('Registro actualizado')).toBeVisible({ timeout: 10000 })
    })

    test('Delete', async ({ page }) => {
        await openModal(page)
        // const id: any = await tr.locator('td').nth(2).textContent()

        await deleteItem(page, expect)
        await expect(page.getByRole('alert').getByText('Registro eliminado')).toBeVisible({ timeout: 7000 })
        // await expect(page.locator('table').getByText(id)).toBeHidden({ timeout: 60000 });
    })
})

test('Check the integrity of the forms', async ({ page }) => {
    for (const route of routes) {
        await page.goto('/#' + route)
        await create(page)
        try {
            await update(page)
        } catch {
            await update(page)
        }
        await page.locator('#titleCrudTable').click();
        await deleteTest(page)
    }
})
