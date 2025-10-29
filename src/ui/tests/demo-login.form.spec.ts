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

      await usernameInput.fill(validCredentials.username);
      await passwordInput.fill(validCredentials.password);
      await registerButton.click();

      await expect(
        page.locator("text=Successfully registered! Please, click Back to return on login page"),
      ).toBeVisible();
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

    await usernameInput.fill(validCredentials.username);
    await passwordInput.fill(validCredentials.password);
    await registerButton.click();
    await expect(
      page.locator("text=Successfully registered! Please, click Back to return on login page"),
    ).toBeVisible();
    await expect(page.locator("#backOnRegister")).toBeVisible();
    await backButton.click();

    await loginUsernameInput.fill(validCredentials.username);
    await loginPasswordInput.fill(validCredentials.password);
    await submitButton.click();
    await expect(page.locator(`text=Hello, ${validCredentials.username}`)).toBeVisible();
  });
});

/*
Homework 21 Task 1
Создать тест сьют используя DDT подход с негативными тест-кейсами по регистрации на сайте
https://anatoly-karpovich.github.io/demo-login-form/

Требования:
Страница регистрации:
  Username: обязательное, от 3 до 40 символов включительно, запрещены префиксные/постфиксные пробелы, как и имя состоящее из одних пробелов
  Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква в верхнем и нижнем регистрах, пароль из одних пробелов запрещен

Страница логина:
  Username: обязательное
  Password: обязательное
*/

enum RegisterNegativeTestCases {
  EMPTY_USERNAME = "empty username",
  SHORT_USERNAME = "username shorter than 3 chars",
  LONG_USERNAME = "username longer than 40 chars",
  USERNAME_WITH_SPACES = "username has leading or trailing spaces",
  USERNAME_ONLY_SPACES = "username only spaces",
  EMPTY_PASSWORD = "empty password",
  SHORT_PASSWORD = "password shorter than 8 chars",
  LONG_PASSWORD = "password longer than 20 chars",
  PASSWORD_NO_UPPERCASE = "password lacks uppercase",
  PASSWORD_NO_LOWERCASE = "password lacks lowercase",
  PASSWORD_ONLY_SPACES = "password only spaces",
}

const testCases = [
  {
    title: RegisterNegativeTestCases.EMPTY_USERNAME,
    username: "",
    password: "validPassword123",
    error: "Username is required",
  },
  {
    title: RegisterNegativeTestCases.SHORT_USERNAME,
    username: "ab",
    password: "validPassword123",
    error: "Username should contain at least 3 characters",
  },
  {
    title: RegisterNegativeTestCases.LONG_USERNAME,
    username: "123456789012345678901234567890123456789012345678901234567890",
    password: "validPassword123",
    error: "Username should contain at least 3 characters",
  },
  {
    title: RegisterNegativeTestCases.USERNAME_WITH_SPACES,
    username: " validUser ",
    password: "validPassword123",
    error: "Prefix and postfix spaces are not allowed is username",
  },
  {
    title: RegisterNegativeTestCases.USERNAME_ONLY_SPACES,
    username: "   ",
    password: "validPassword123",
    error: "Prefix and postfix spaces are not allowed is username",
  },
  {
    title: RegisterNegativeTestCases.EMPTY_PASSWORD,
    username: "validUser",
    password: "",
    error: "Password is required",
  },
  {
    title: RegisterNegativeTestCases.SHORT_PASSWORD,
    username: "validUser",
    password: "1234567",
    error: "Password should contain at least 8 characters",
  },
  {
    title: RegisterNegativeTestCases.LONG_PASSWORD,
    username: "validUser",
    password: "p12345678901234567890",
    error: "Password should containnot more than 20 characters",
  },
  {
    title: RegisterNegativeTestCases.PASSWORD_NO_UPPERCASE,
    username: "validUser",
    password: "validpassword123",
    error: "Password must contain uppercase and lowercase letters",
  },
  {
    title: RegisterNegativeTestCases.PASSWORD_NO_LOWERCASE,
    username: "validUser",
    password: "VALIDPASSWORD123",
    error: "Password should contain at least one character in lower case",
  },
  {
    title: RegisterNegativeTestCases.PASSWORD_ONLY_SPACES,
    username: "validUser",
    password: "      ",
    error: "Password is required",
  },
];

test.describe("[REGISTER PAGE] - Negative Tests - Homework 21 Task 1 ", () => {
  test.beforeEach("Open register page", async ({ page }) => {
    const registerButton = page.locator("#registerOnLogin");
    const url = "https://anatoly-karpovich.github.io/demo-login-form/";
    await page.goto(url);
    await registerButton.click();
  });

  for (const negativeCase of testCases) {
    test(`${negativeCase.title}`, { tag: ["@negative"] }, async ({ page }) => {
      const usernameInput = page.locator("#userNameOnRegister");
      const passwordInput = page.locator("#passwordOnRegister");
      const registerButton = page.locator("#register");

      await usernameInput.fill(negativeCase.username);
      await passwordInput.fill(negativeCase.password);
      await registerButton.click();

      await expect(page.locator(`text=${negativeCase.error}`)).toBeVisible();
    });
  }
});
