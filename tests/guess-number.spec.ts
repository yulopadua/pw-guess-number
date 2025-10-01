import { test, expect } from '@playwright/test';

test.describe('guess the number', () => {

  test.beforeEach('', async ({ page }) => {
    await page.goto('https://mapleqa.com/js22/?randomParam=12')
  })

  test('TS888-001: Verify Initial Application State on Load', async ({ page }) => {
    //   Verify the card front displays "Guess the card value" and "**".
    await expect(page.locator('#frontCardTitle')).toContainText('Guess the card value');
    await expect(page.locator('#frontCardValue')).toContainText('**');

    //   Verify the input field `[data-testid="guessField"]` is empty, enabled, and has focus.
    await expect(page.locator('[data-testid="guessField"]')).toBeEmpty();
    await expect(page.locator('[data-testid="guessField"]')).toBeEnabled();
    await expect(page.locator('[data-testid="guessField"]')).toBeFocused();

    //   Verify the `[data-testid="guessButton"]` button displays "GUESS" and is **disabled**.
    await expect(page.locator('[data-testid="guessButton"]')).toContainText('GUESS');
    await expect(page.locator('[data-testid="guessButton"]')).toBeDisabled();

    //   Verify the `[data-testid="messageArea"]` is empty.
    //   Verify the `[data-testid="guesses"]` container is empty.
    //   Verify the `[data-testid="showAttempts"]` attempts counter is in its initial state (e.g., " / 10").
    await expect(page.locator('[data-testid="messageArea"]')).toBeEmpty();
    await expect(page.locator('[data-testid="guesses"]')).toBeEmpty();
    await expect(page.locator('[data-testid="showAttempts"]')).toBeEmpty();
  })

})
