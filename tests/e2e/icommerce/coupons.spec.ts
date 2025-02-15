import { test, expect } from '../../shared-context'
import { config } from '../../config'
import { deleteItem } from '../common-tests'

test.use({ baseURL: config.url + '/coupons' });

const openModal = async (page) => {
    const tr = await page.locator('tbody').locator('.q-tr.tw-bg-white').first();
    await expect(tr).toBeVisible({ timeout: 60000 });
    await tr.getByRole('button').last().click();
}

const fillFields = async (fields, page, fillerText) => {
    // Recorrer los campos y llenarlos con valores
    for (const field of fields) {
        // Obtener el primer campo
        const fieldFirst = field.first()

        // Obtener el tipo de campo
        const type = await fieldFirst.getAttribute('type').catch(error => console.log({ error }))
        // Obtener el rol del campo
        const role = await fieldFirst.getAttribute('role').catch(error => console.log({ error }))

        // Llenar los campos según el tipo de campo
        if (type === 'text') {
            await fieldFirst.fill(fillerText)
            const placeholder = await fieldFirst.getAttribute('placeholder')
            if (placeholder === 'YYYY/MM/DD') {
                await fieldFirst.fill('2022/10/01')
            }
        }

        if (type === 'number') {
            await fieldFirst.fill('70')
        }

        if (role === 'combobox') {
            await fieldFirst.click({ timeout: 5000 }).catch(async error => { console.log({ error }) })
            await page.getByRole('option').nth(1).click({ timeout: 5000 }).catch(async error => {
                await page.getByRole('option').first().click({ timeout: 5000 }).catch(async error => {})
            });
        }
    }
}

test.describe.serial('Test the integrity of the forms', () => {
    test('Created', async ({ page }) => {
        // Clic para abrir el formularios de creación.
        await page.locator('id=new-button-crud').click()
        
        // Esperar a que cargue la página
        await page.waitForLoadState('networkidle')
        
        // Obtener el formulario
        const form = page.locator('form').first()
    
        // Obtener todos los campos del formulario
        const fields = await form.locator('input').all()
    
        await fillFields(fields, page, 'trial coupon')
    
        // Click en el botón de submit
        await form.locator('button').last().click()
    
        // Esperar mensaje confirmando la creación del registro
        await expect(page.getByRole('alert').getByText('Registro creado ID:')).toBeVisible({ timeout: 7000 })
    })
    
    test('Updated', async ({ page }) => {
        await openModal(page)
        await page.locator('a').filter({ hasText: 'Editar' }).click()
        await page.waitForLoadState('networkidle')
        await page.waitForLoadState('load')
    
        // Obtener el formulario
        const form = page.locator('form').first()
    
        // Obtener todos los campos del formulario
        const fields = await form.locator('input').all()
    
        await fillFields(fields, page, 'Updated trial coupon')
    
        // Click en el botón de submit
        await form.locator('button').last().click()
    
        // Esperar mensaje confirmando la creación del registro
        await expect(page.getByRole('alert').getByText('Registro actualizado')).toBeVisible({ timeout: 7000 })
    })
    
    test('Deleted', async ({ page }) => {
        await openModal(page)
    
        await deleteItem(page, expect)
        await expect(page.getByRole('alert').getByText('Registro eliminado')).toBeVisible({ timeout: 7000 })
    })
})
