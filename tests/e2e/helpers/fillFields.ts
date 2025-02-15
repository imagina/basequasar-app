
const removeAccents = (str: string): string => {
    if (!str) return str;
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const removeTrailingAsterisk = (str: string): string => {
    if (!str) return str;
    return str.replace(/\*$/, '');
}

const waitForLoading = async (page) => {
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('load')
    await page.waitForLoadState('domcontentloaded')
}

export const fillFields = async (page, expect, update=false) => {
    console.log({ update })
    const fillerText = update ? 'updated' : 'testing'

    console.log({ fillerText })

    const forms = await page.getByTestId('crud-form').all()
    
    // Traverse both columns of the form
    for (const form of forms) {
        await expect(form).toBeVisible()
        const fieldsContainer = form.locator('div').locator('id=dynamicFieldComponent')
        const map = form.locator('div').locator('id=dynamicFieldComponent').locator('id=map')
        const ckEditor = page.locator('id=ckEditorComponent')

        // Get all the fields
        const fields = await fieldsContainer.locator('input').all()
    
        // Get all textarea type fields
        const textAreaAll = await fieldsContainer.locator('textarea').all()

        if (textAreaAll.length > 0) {
            for (const textArea of textAreaAll) {
                if (await textArea.isVisible()) await textArea.fill(fillerText, { timeout: 5000 })
            }
        }

        if (await ckEditor.isVisible()) {
            // Access the CKEditor iframe
            const ckEditorFrame = page.frameLocator('iframe.cke_wysiwyg_frame')

            // Write to the body of the iframe
            const body = ckEditorFrame.locator('body')

            // Simulates writing to the body of the iframe
            await body.pressSequentially('test')
        }
    
        const medias = await fieldsContainer.locator('id=selectMediaComponent').all()

        // If there are media fields, select the first file
        if (medias.length > 0) {
            for (const media of medias) {
                if (await media.isVisible()) {
                    // Open the file selection modal
                    await media.locator('button').first().click()
            
                    await waitForLoading(page)

                    const filesContainer = page.getByTestId('file-list').getByTestId('files-container')
            
                    // Get the file container
                    const checkboxFile = filesContainer.locator('.row').locator('div').locator('.file-card_img.img-as-bg')
                    
                    // Select the first file
                    await checkboxFile.first().click()

                    // Click on the selection button
                    await page.locator('id=masterModalContent').getByTestId('modal-actions').locator('button').first().click()
                }
            }
        }
    
        // Traverse all the fields
        for (const field of fields) {
            const fieldFirst = field.first()
            const type = await fieldFirst.getAttribute('type').catch(error => console.log({ error }))
            const classes = await fieldFirst.getAttribute('class').catch(error => console.log({ error }))
    
            if (type === 'text') {
                await fieldFirst.fill(fillerText)
                const placeholder = await fieldFirst.getAttribute('placeholder')
                if (placeholder === 'YYYY/MM/DD') {
                    await fieldFirst.fill('2021/09/01')
                }
            }
    
            if (type === 'number') {
                await fieldFirst.fill('5')
            }
    
            const ariaLabel = removeAccents(await fieldFirst.getAttribute('aria-label'))?.trim()?.toLowerCase()
            const ariaLabelClean = removeTrailingAsterisk(ariaLabel)
            if (type === 'search') {
                // Try to select an option from the "select." If it fails, 
                // attempt to enable the "select" search to find an option to select.
                try {
                    await fieldFirst.click()
                    const options = await page.getByRole('option').all()
                    if (options.length > 0) {
                        await waitForLoading(page)
                        await page.getByRole('option').first().click({ timeout: 5000 });
                    } else {
                        throw new Error("No results found");
                    }
                } catch (error) {
                    if (ariaLabelClean === 'pais') {
                        await fieldFirst.click()
                        await fieldFirst.fill('colombia')
                        await waitForLoading(page)
                        await page.getByRole('option').first().click({ timeout: 5000 })
                            .catch( error => console.error('No results found') )
                    } else if (ariaLabelClean === 'departamento/provincia/estado') {
                        await fieldFirst.click()
                        await fieldFirst.fill(update ? 'Huila' : 'Tolima')
                        await page.waitForLoadState('networkidle')
                        await page.getByRole('option').first().click({ timeout: 5000 })
                            .catch( error => console.error('No results found') )
                    } else if (ariaLabelClean === 'ciudad') {
                        await fieldFirst.click()
                        await fieldFirst.fill(update ? 'Pitalito' : 'Ibague')
                        await page.waitForLoadState('networkidle')
                        await page.getByRole('option').first().click({ timeout: 5000 })
                            .catch( error => console.error('No results found') )
                    } else {
                        await fieldFirst.click()
                        await fieldFirst.fill('ab')
                        await page.waitForLoadState('networkidle')
                        await page.getByRole('option').first().click({ timeout: 5000 })
                            .catch( error => console.error('No results found') )
                    }
                    
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

        // If the map is visible, search for a location
        if (await map.isVisible()) {
            const searchMap = map.locator('input').first()
            await searchMap.fill('Ibague')
            await page.waitForLoadState('networkidle')
            await page.getByRole('option').first().click({ timeout: 5000 })
                .catch( error => console.error('No results found'))
            await page.waitForTimeout(2000)
        }
    }
}