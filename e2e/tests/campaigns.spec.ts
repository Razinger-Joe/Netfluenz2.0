import { test, expect } from '@playwright/test';

test('campaigns page loads and filters', async ({ page }) => {
    await page.goto('/campaigns');

    // Check heading
    await expect(page.getByRole('heading', { name: 'Campaigns' })).toBeVisible();

    // Check search input exists
    const searchInput = page.getByPlaceholder('Search campaigns...');
    await expect(searchInput).toBeVisible();

    // Check tabs exist
    await expect(page.getByRole('tab', { name: 'All' })).toBeVisible();
});
