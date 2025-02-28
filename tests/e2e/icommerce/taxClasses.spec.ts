import { test, expect } from '../../shared-context'
import { config } from '../../config'
import { deleteItem } from '../common-tests'

test.use({ baseURL: config.url + '/ecommerce/tax-classes' });

const openModal = async (page) => {
    const tr = await page.locator('tbody').locator('.q-tr.tw-bg-white').first();
    await expect(tr).toBeVisible({ timeout: 60000 });
    await tr.getByRole('button').first().click();
}

test.describe.serial('test tax form integrity', () => {
    test('Create', async ({ page }) => {
        await page.locator('id=new-button-crud').click()
        
        await page.waitForLoadState('networkidle')
    
        const form = page.locator('form').first()
    
        await form.locator('input').first().fill('Testing')
    
        await form.locator('.q-editor__content').first().fill('Testing')

        // Add new tax rate
        await form.locator('button').first().click()

        // Display the selection
        await form.locator('.vue-treeselect__input').first().click()

        // Select the first option
        await page.locator('.vue-treeselect__option').first().click();

        await form.locator('input').nth(3).fill('1')
    
        // Click on the save button
        await form.locator('button').nth(2).click()

        // Esperar mensaje confirmando la creación del registro
        await expect(page.getByRole('alert').getByText('Registro creado')).toBeVisible({ timeout: 7000 })
    })

    test('Update', async ({ page }) => {
        await openModal(page)
        await page.locator('a').filter({ hasText: 'Editar' }).click();

        await page.waitForLoadState('networkidle')
    
        const form = page.locator('form').first()
    
        // Verificar que el campo tiene datos
        await expect(form.locator('input').first()).toHaveValue('Testing')
        // Actualizar el campo
        await form.locator('input').first().fill('Updated')

        // Verificar que el campo tiene datos
        await expect(form.locator('.q-editor__content').first()).toHaveText('Testing')
        // Actualizar el campo
        await form.locator('.q-editor__content').first().fill('Updated')
        
        // Verificar que el campo tiene datos
        await expect(form.locator('input').nth(3)).toHaveValue('1')
        // Actualizar el campo de la tasa
        await form.locator('input').nth(3).fill('2')

        // Click en el botón de submit
        await form.locator('button').nth(2).click() 

        // Esperar mensaje confirmando la actualización del registro
        await expect(page.getByRole('alert').getByText('Registro actualizado')).toBeVisible({ timeout: 7000 })
    })

    test('Delete', async ({ page }) => {
        await openModal(page)
        
        // Get the id of the first row
        const id: any = await page.locator('td').nth(0).textContent()

        await deleteItem(page, expect)
        await expect(page.getByRole('alert').getByText('Registro eliminado')).toBeVisible()

        // Verify that the row is no longer visible
        await expect(page.locator('table').getByText(id)).toBeHidden({ timeout: 60000 });
    })
})
