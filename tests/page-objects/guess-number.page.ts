import { Locator, Page } from "@playwright/test";

export default class guessPage {
  page: Page
  getTextfrontCardTitle: Locator
  getTextfrontCardValue: Locator
  getGuessField: Locator
  getGuessButton: Locator
  getMessageArea: Locator
  getGuesses: Locator
  getShowAttempts: Locator
  getContainerCard: Locator
  getResetButton: Locator
  getCardValue: Locator

  constructor (page: Page) {
    this.page = page

    this.getTextfrontCardTitle = page.locator('#frontCardTitle')
    this.getTextfrontCardValue = page.locator('#frontCardValue')
    this.getGuessField = page.getByTestId('guessField')
    this.getGuessButton = page.getByTestId('guessButton')
    this.getMessageArea = page.getByTestId('messageArea')
    this.getGuesses = page.getByTestId('guesses')
    this.getShowAttempts = page.getByTestId('showAttempts')

    this.getContainerCard = page.locator('#card')
    this.getCardValue = page.locator('#cardValue')

    this.getResetButton = page.getByTestId('reset')
  }

}
