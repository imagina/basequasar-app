export const deleteItem = async (page, expect) => {
    await page.locator('a').filter({ hasText: 'Eliminar' }).click();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByText('¿Estás seguro que quieres eliminar este registro?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();
    await page.getByRole('button', { name: 'Eliminar' }).click();

    // await expect(page.getByText('Record NOT deleted')).not.toBeVisible();
    // await expect(page.getByText('Record deleted')).toBeVisible();
}