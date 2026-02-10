import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Netfluenz/);
});

test('navigation menu works', async ({ page }) => {
    await page.goto('/');

    // Click the Marketplace link
    await page.getByRole('link', { name: 'Marketplace' }).click();
    await expect(page).toHaveURL(/.*marketplace/);

    // Click Campaigns link
    await page.getByRole('link', { name: 'Campaigns' }).click();
    await expect(page).toHaveURL(/.*campaigns/);

    // Click Pricing link
    await page.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/.*pricing/);
});

test('404 page works', async ({ page }) => {
    await page.goto('/unknown-random-page');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
});
