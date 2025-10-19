/*
Homework 20 Task 1
Разработать тест со следующими шагами:
  - открыть https://the-internet.herokuapp.com/
  - перейти на страницу Dynamic Controls
  - Дождаться появления кнопки Remove
  - Завалидировать текста в заголовке страницы
  - Чекнуть чекбокс
  - Кликнуть по кнопке Remove
  - Дождаться исчезновения чекбокса
  - Проверить наличие кнопки Add
  - Завалидировать текст It's gone!
  - Кликнуть на кнопку Add
  - Дождаться появления чекбокса
  - Завалидировать текст It's back!
*/

import { expect, test } from "@playwright/test";

test.describe("[HEROKU APP] Homework 20 Task 1", () => {
  test.beforeEach(async ({ page }) => {
    const url = "https://the-internet.herokuapp.com/";
    await page.goto(url);
  });

  test("Test Dynamic Controls", async ({ page }) => {
    const dynamicControlsPage = page.getByRole("link", { name: "Dynamic Controls" });
    const removeButton = page.getByRole("button", { name: "Remove" });
    const headerText = page.getByRole("heading", { name: "Dynamic Controls" });
    const paragraphText = page.locator("p");
    const checkbox = page.getByText("A checkbox");
    const goneMessage = page.locator("#message");
    const addButton = page.getByRole("button", { name: "Add" });

    await dynamicControlsPage.click();
    await removeButton.waitFor({ state: "visible" });
    await expect(headerText).toHaveText("Dynamic Controls");
    await expect(paragraphText).toHaveText(
      "This example demonstrates when elements (e.g., checkbox, input field, etc.) are changed asynchronously.",
    );
    await checkbox.click();
    await removeButton.click();

    await expect(goneMessage).toHaveText("It's gone!");
    await expect(checkbox).not.toBeVisible();
    await expect(addButton).toBeVisible();

    await addButton.click();

    await checkbox.waitFor({ state: "visible" });
    await expect(goneMessage).toHaveText("It's back!");
  });
});
