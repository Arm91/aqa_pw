/*
  Разработайте смоук тест-сьют с тестами на REGISTER на странице https://anatoly-karpovich.github.io/demo-login-form/

  Требования:
    Страница регистрации:
      Username: обязательное, от 3 до 40 символов включительно, запрещены префиксные/постфиксные пробелы, как и имя состоящее из одних пробелов
      Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква в верхнем и нижнем регистрах, пароль из одних пробелов запрещен
    Страница логина:
      Username: обязательное
      Password: обязательное
*/

import { test, expect } from "@playwright/test";

interface ICredentials {
  username: string;
  password: string;
}
const validCredentials: ICredentials = {
  username: "validUser",
  password: "validPassword123",
};

test.describe("[REGISTER PAGE]", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page }) => {
    const url = "https://anatoly-karpovich.github.io/demo-login-form/";
    const registerButton = page.locator("#registerOnLogin");
    await page.goto(url);
    await registerButton.click();
  });

  test(
    "Should register successfully with valid username and password",
    { tag: ["@smoke", "@positive"] },
    async ({ page }) => {
      const usernameInput = page.locator("#userNameOnRegister");
      const passwordInput = page.locator("#passwordOnRegister");
      const registerButton = page.locator("#register");
      const successText = page.locator("text=Successfully registered! Please, click Back to return on login page");

      await usernameInput.fill(validCredentials.username);
      await passwordInput.fill(validCredentials.password);
      await registerButton.click();

      await expect(successText).toBeVisible();
    },
  );

  test("Should return to login page after registration", { tag: ["@smoke", "@positive"] }, async ({ page }) => {
    const usernameInput = page.locator("#userNameOnRegister");
    const passwordInput = page.locator("#passwordOnRegister");
    const registerButton = page.locator("#register");
    const backButton = page.locator("#backOnRegister");

    await usernameInput.fill(validCredentials.username);
    await passwordInput.fill(validCredentials.password);
    await registerButton.click();
    await expect(page.locator("#backOnRegister")).toBeVisible();
    await backButton.click();

    await expect(page.locator("#userName")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#submit")).toBeVisible();
  });

  test("Should login successfully with registered credentials", { tag: ["@smoke", "@positive"] }, async ({ page }) => {
    const usernameInput = page.locator("#userNameOnRegister");
    const passwordInput = page.locator("#passwordOnRegister");
    const registerButton = page.locator("#register");
    const backButton = page.locator("#backOnRegister");

    const loginUsernameInput = page.locator("#userName");
    const loginPasswordInput = page.locator("#password");
    const submitButton = page.locator("#submit");
    const successText = page.locator("text=Successfully registered! Please, click Back to return on login page");

    await usernameInput.fill(validCredentials.username);
    await passwordInput.fill(validCredentials.password);
    await registerButton.click();
    await expect(successText).toBeVisible();
    await expect(page.locator("#backOnRegister")).toBeVisible();
    await backButton.click();

    await loginUsernameInput.fill(validCredentials.username);
    await loginPasswordInput.fill(validCredentials.password);
    await submitButton.click();
    await expect(page.locator(`text=Hello, ${validCredentials.username}`)).toBeVisible();
  });
});

/*
Homework 20 Task 2
Разработать тест со следующими шагами:
  - открыть https://anatoly-karpovich.github.io/demo-login-form/
  - Засунуть в localStorage браузера данные test@gmail.com / SecretPw123!@# для логина на сайт
  - Залогиниться с данными что вы вставили в localStorage
  - Завалидировать успешный логин

  Рекоммендации:
  - Для доступа к localStorage используйте https://playwright.dev/docs/evaluating
*/

test.describe("[LOGIN PAGE] Homework 20 Task 2", () => {
  const credentials = {
    name: "test@gmail.com",
    password: "SecretPw123!@#",
  };

  test.beforeEach(async ({ page }) => {
    const url = "https://anatoly-karpovich.github.io/demo-login-form/";
    await page.goto(url);
  });

  test("Local storage test", async ({ page }) => {
    const loginUsernameInput = page.locator("#userName");
    const loginPasswordInput = page.locator("#password");
    const submitButton = page.locator("#submit");

    await page.evaluate((data) => {
      localStorage.setItem(data.name, JSON.stringify(data));
    }, credentials);

    await page.reload();

    await loginUsernameInput.fill(credentials.name);
    await loginPasswordInput.fill(credentials.password);
    await submitButton.click();
    await expect(page.locator(`text=Hello, ${credentials.name}`)).toBeVisible();
  });
});
