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

  test('TS888-002: Verify "GUESS" Button Enables/Disables with Input', async ({ page }) => {
    //1.  Observe the initial state of the "GUESS" button.
    //   Verify it is **disabled**.
    await expect(page.locator('[data-testid="guessButton"]')).toBeDisabled();

    //2.  Enter the value "1" into the input field.
    //   Verify the button becomes **enabled**.
    await page.locator('[data-testid="guessField"]').fill('1');
    await expect(page.locator('[data-testid="guessButton"]')).toBeEnabled();

    //3.  Clear the input field.
    //   Verify the button becomes **disabled** again.
    await page.locator('[data-testid="guessField"]').fill('');
    await expect(page.locator('[data-testid="guessButton"]')).toBeDisabled();
  })

  test('TS888-003: Verify Correct Guess on First Attempt (Win Condition)', async ({ page }) => {
    //1.  Enter the correct number `12`.
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('12');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the card flips (element `#card` has class `flipped`), revealing the number 12.
    await expect(page.locator('#card')).toHaveClass(/flipped/);

    //   Verify the message area displays: **"Congratulations! You guessed the number!"**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('Congratulations! You guessed the number!');

    //   Verify the "GUESS" button is replaced with a "RESET" button.
    await expect(page.locator('[data-testid="guessButton"]')).not.toBeAttached();
    await expect(page.locator('[data-testid="reset"]')).toBeAttached();

    //   Verify the guess `12` appears in the previous guesses area with a special `.guessed` class.
    await expect(page.locator('[data-testid="guesses"]').locator('.guessed')).toContainText('12');

    //   Verify the input field is disabled.
    await expect(page.locator('[data-testid="guessField"]')).toBeDisabled();

    //   Verify the attempts counter shows **"1 / 10"**.
    await expect(page.locator('[data-testid="showAttempts"]')).toContainText('1 / 10');
  })

  test('TS888-004: Verify "My number is larger" Feedback (Too Low)', async ({ page }) => {
    //1.  Enter a valid number less than 12 (e.g., `5`).
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('5');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the message area displays: **"My number is larger.\n Try Again!"**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('My number is larger. Try Again!');

    //   Verify the guess `5` is added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toContainText('5');

    //   Verify the attempts counter increments (e.g., to "1 / 10").
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).not.toContainText('0');

    //   Verify the input field is cleared and retains focus.
    await expect(page.locator('[data-testid="guessField"]')).toContainText('');
    await expect(page.locator('[data-testid="guessField"]')).toBeFocused();
  })

  test('TS888-005: Verify "My number is smaller" Feedback (Too High)', async ({ page }) => {
    //1.  Enter a valid number greater than 12 (e.g., `20`).
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('20');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the message area displays: **"My number is smaller.\n Try Again!"**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('My number is smaller. Try Again!');

    //   Verify the guess `20` is added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toContainText('20');

    //   Verify the attempts counter increments.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).not.toContainText('0');

    //   Verify the input field is cleared and retains focus.
    await expect(page.locator('[data-testid="guessField"]')).toContainText('');
    await expect(page.locator('[data-testid="guessField"]')).toBeFocused();
  })

  test('TS888-006: Validate Input Boundary (Lower): Number 1', async ({ page }) => {
    //1.  Enter the value `1`.
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('1');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the input is processed as a valid guess (no error message).
    await expect(page.locator('[data-testid="messageArea"]')).not.toContainText('error');

    //   Verify the attempts counter increments.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).not.toContainText('0');
  })

  test('TS888-007: Validate Input Boundary (Upper): Number 50', async ({ page }) => {
    //1.  Enter the value `50`.
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('50');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the input is processed as a valid guess (no error message).
    await expect(page.locator('[data-testid="messageArea"]')).not.toContainText('error');
  
    //   Verify the attempts counter increments.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).not.toContainText('0');
  })

  test('TS888-008: Verify Error for Out-of-Range Input (Low: 0)', async ({ page }) => {
    //1.  Enter the value `0`.
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('0');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the message area displays: **"ERROR:\nInput should be between 1 & 50"**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('ERROR:Input should be between 1 & 50');

    //   Verify the attempts counter does **not** increment.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).toContainText('0');

    //   Verify the guess is **not** added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toHaveText('');
  })

  test('TS888-009: Verify Error for Out-of-Range Input (High: 51)', async ({ page }) => {
    //1.  Enter the value `51`.
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('51');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the message area displays: **"ERROR:\nInput should be between 1 & 50"**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('ERROR:Input should be between 1 & 50');

    //   Verify the attempts counter does **not** increment.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).toContainText('0');

    //   Verify the guess is **not** added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toHaveText('');
  })

  test('TS888-010: Verify Error for Negative Input', async ({ page }) => {
    //1.  Enter a negative value (e.g., `-5`).
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('-5');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the message area displays the out-of-range error message.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('ERROR:Input should be between 1 & 50');

    //   Verify the attempts counter does **not** increment.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).toContainText('0');

    //   Verify the guess is **not** added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toHaveText('');
  })

  test('TS888-011: Verify Error for Non-Numeric Input', async ({ page }) => {
    //1.  Enter a non-numeric value (e.g., `abc`).
    //2.  Click the "GUESS" button.
    await page.locator('[data-testid="guessField"]').fill('ab');
    await page.locator('[data-testid="guessButton"]').click();

    //   Verify the application displays an error.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText('ERROR:Input should be between 1 & 50');

    //   Verify the attempts counter does **not** increment.
    await expect(page.locator('[data-testid="showAttempts"]').locator('.rotateAttempt')).toContainText('0');

    //   Verify the guess is **not** added to the previous guesses list.
    await expect(page.locator('[data-testid="guesses"]')).toHaveText('');
  })

  test('TS888-012: Verify Game Over After 10 Incorrect Attempts (Lose Condition)', async ({ page }) => {
    //1.  Enter 10 incorrect guesses (e.g., numbers that are not 12).
    for (let i = 1; i <= 10; i++) {
      await page.locator('[data-testid="guessField"]').fill(String(i));
      await page.locator('[data-testid="guessButton"]').click();
    }

    //   Verify on the 10th attempt, the card flips, revealing the secret number (12).
    await expect(page.locator('#card')).toHaveClass(/flipped/);
    await expect(page.locator('#cardValue')).toContainText('12');

    //   Verify the message area displays: **"Game Over! You've used all your attempts."**.
    await expect(page.locator('[data-testid="messageArea"]')).toContainText("Game Over! You've used all your attempts.");

    //   Verify the "GUESS" button is replaced with a "RESET" button.
    await expect(page.locator('[data-testid="guessButton"]')).not.toBeAttached();
    await expect(page.locator('[data-testid="reset"]')).toBeAttached();

    //   Verify the input field is disabled.
    await expect(page.locator('[data-testid="guessField"]')).not.toBeEnabled();

    //   Verify the attempts counter shows **"10 / 10"**.
    await expect(page.locator('[data-testid="showAttempts"]')).toContainText('10 / 10');
  })

})
