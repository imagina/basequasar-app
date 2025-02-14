import { test, expect } from '../../shared-context'
import { config } from '../../config'
import { deleteItem } from '../common-tests'

test.use({ baseURL: config.url + '/ecommerce/products/create' });

const openModal = async (page) => {
    const tr = await page.locator('tbody').locator('.q-tr.tw-bg-white').first();
    await expect(tr).toBeVisible({ timeout: 60000 });
    await tr.getByRole('button').first().click();
}

const waitForLoading = async (page) => {
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('load')
    await page.waitForLoadState('domcontentloaded')
}

const fillFields = async (page) => {
    const form = page.locator('form')

    // Get all the fields
    const fields = await form.locator('input').all()
    
    // Get all textarea type fields
    const textAreaAll = await form.locator('textarea').all()

    // Get ckEditor
    const ckEditorAll = await page.locator('id=ckEditorComponent').all()

    for (const ckEditor of ckEditorAll) {
        if (await ckEditor.isVisible()) {
            // Access the CKEditor iframe
            const ckEditorFrame = ckEditor.frameLocator('iframe.cke_wysiwyg_frame').first()

            // Write to the body of the iframe
            const body = ckEditorFrame.locator('body')

            // Simulates writing to the body of the iframe
            await body.pressSequentially('testing')
        }
    }

    for (const field of fields) {
        const fieldFirst = field.first()
        const type = await fieldFirst.getAttribute('type').catch(error => console.log({ error }))
        const classes = await fieldFirst.getAttribute('class').catch(error => console.log({ error }))

        if (type === 'text') {
            await fieldFirst.fill('testing')
            const placeholder = await fieldFirst.getAttribute('placeholder')
            if (placeholder === 'YYYY/MM/DD') {
                await fieldFirst.fill('2021/09/01')
            }
        }

        if (type === 'number') {
            await fieldFirst.fill('5')
        }

        if (type === 'search') {
            console.log('search')
            // Try to select an option from the "select." If it fails, 
            // attempt to enable the "select" search to find an option to select.

            // const inputValue = await fieldFirst.locator('.q-chip.row.inline.no-wrap').isVisible()
            const inputValue = await fieldFirst.evaluate(node => node.value);

            // Seleccionar el elemento justo arriba de fieldFirst en el DOM
            const elementAbove = await fieldFirst.locator('xpath=preceding-sibling::*[1]').isVisible();
            
            try {
                await fieldFirst.click()
                const options = await page.getByRole('option').all()
                if (options.length > 0) {
                    await page.waitForLoadState('load')
                    await page.waitForLoadState('networkidle')
                    await page.waitForLoadState('domcontentloaded')
                    await page.getByRole('option').first().click({ timeout: 5000 });
                } else {
                    throw new Error("No results found");
                }
            } catch (error) {
                await fieldFirst.click()

                const chip = await fieldFirst.locator('span').locator('.ellipsis').isVisible()
                console.log({ chip })

                await fieldFirst.fill('ab')
                await page.waitForLoadState('networkidle')
                await page.getByRole('option').first().click({ timeout: 5000 })
                    .catch( error => console.error('No results found') )
            }
        }

        if (classes === 'vue-treeselect__input') {
            await fieldFirst.click()
            await page.locator('.vue-treeselect__option').first().click();
        }

        if (type === 'checkbox') {
            // await fieldFirst.check({ timeout: 5000 })
        }
    }

    if (textAreaAll.length > 0) {
        for (const textArea of textAreaAll) {
            if (await textArea.isVisible()) await textArea.fill('testing', { timeout: 5000 })
        }
    }

    // Click on the save button
    await form.locator('button').nth(2).click()

    await waitForLoading(page)

    const visibleForm = await page.locator('form').isVisible()

    if (visibleForm) {
        await fillFields(page)
    } else {
        // The successful creation alert is expected to be displayed
        // await expect(page.getByRole('alert').getByText('Registro creado')).toBeVisible({ timeout: 10000 })
    }
}

test.describe.serial('test product advance form', () => {
    test('Create', async ({ page }) => {
        await page.waitForLoadState('load')
        await page.waitForLoadState('networkidle')
        await page.waitForLoadState('domcontentloaded')

        const grip = page.locator('div').locator('.q-tab-panel')

        const forms = grip.locator('div').locator('.relative-position.card').first()
        await forms.click()
        
        await fillFields(page)
    })

    test('Update', async ({ page }) => {
        await openModal(page)
        await page.locator('a').filter({ hasText: 'Editar' }).click();

        await page.waitForLoadState('networkidle')
    
        const form = page.locator('form').first()
    
        await form.locator('input').first().fill('Updated')
    
        await form.locator('.q-editor__content').first().fill('Updated')

        await form.locator('button').nth(1).click()
    })

    test('Delete', async ({ page }) => {
        await openModal(page)
        // const id: any = await tr.locator('td').nth(2).textContent()

        await deleteItem(page, expect)
        await expect(page.getByRole('alert').getByText('Registro eliminado')).toBeVisible()
        // await expect(page.locator('table').getByText(id)).toBeHidden({ timeout: 60000 });
    })
})