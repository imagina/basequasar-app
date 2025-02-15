import { test } from '../../shared-context'
import { config } from '../../config'

test.use({ baseURL: config.url + '/ecommerce/products/create' });

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

    console.log({ fields })

    for (const field of fields) {
        const fieldFirst = field.first()
        const type = fieldFirst.isVisible() 
            ? await fieldFirst.getAttribute('type', { timeout: 5000 })
                .catch(error => console.log({ error })) 
            : ''
        const classes = fieldFirst.isVisible() 
            ? await fieldFirst.getAttribute('class', { timeout: 5000 })
                .catch(error => console.log({ error })) 
            : ''

        console.log({ type })

        if (type === 'text') {
            await fieldFirst.fill('testing')
            const placeholder = await fieldFirst.getAttribute('placeholder')
            if (placeholder === 'YYYY/MM/DD') {
                await fieldFirst.fill('2021/09/01')
            }
        }

        if (type === 'number') {
            await fieldFirst.fill('5', { timeout: 5000 })
                .catch( error => console.error('Failed to fill field'))
        }

        if (type === 'search') {
            console.log('search')
            // Try to select an option from the "select." If it fails, 
            // attempt to enable the "select" search to find an option to select.
            
            try {
                // await fieldFirst.click()
                const options = await page.getByRole('option').all()
                console.log({ options })
                if (options.length > 0) {
                    console.log('options.length > 0')
                    await waitForLoading(page)
                    // await page.getByRole('option').first().click({ timeout: 5000 });
                } else {
                    throw new Error("No results found");
                }
            } catch (error) {
                // await page.waitForTimeout(5000)
                await fieldFirst.click()

                // const chip = await fieldFirst.locator('span').locator('.ellipsis').isVisible()
                // console.log({ chip })

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
    await form.locator('button').filter({ hasText: 'Guardar y regresar' }).click()

    await waitForLoading(page)

    const visibleForm = await page.locator('form').isVisible()

    // Registro NO creado
    const alert = await page.getByRole('alert').getByText('Registro NO creado').isVisible()
    
    if (alert) {
        throw new Error('Failed to save record')
    }

    if (visibleForm) {
        console.log('visibleForm')
        await fillFields(page)
    } else {
        // The successful creation alert is expected to be displayed
        // await expect(page.getByRole('alert').getByText('Registro creado')).toBeVisible({ timeout: 10000 })
    }
}

test.describe.serial('test product advance form', () => {
    test('Create', async ({ page }) => {
        await waitForLoading(page)

        const grip = page.locator('div').locator('.q-tab-panel')

        const forms = grip.locator('div').locator('.relative-position.card').nth(4)
        await forms.click()
        
        await fillFields(page)
    })
})