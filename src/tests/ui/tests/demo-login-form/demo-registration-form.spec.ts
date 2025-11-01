/*
Создайте ОДИН смоук тест со следующими шагами:

1. Переход на страницу https://anatoly-karpovich.github.io/demo-registration-form/
2. Заполните форму регистрации
3. Проверьте, что пользователь успешно зарегистрирован

*/
import { test, expect } from "@playwright/test";

interface FormFields {
  firstName: { selector: string; value: string };
  lastName: { selector: string; value: string };
  address: { selector: string; value: string };
  email: { selector: string; value: string };
  phone: { selector: string; value: string };
  country: { selector: string; value: string };
  gender: { selector: string; value: string };
  language: { selector: string; value: string };
  skills: { selector: string; value: string };
  hobbies: { selector: string; value: string[] };
  dateOfBirthYear: { selector: string; value: string };
  dateOfBirthMonth: { selector: string; value: string };
  dateOfBirthDay: { selector: string; value: string };
  password: { selector: string; value: string };
  passwordConfirm: { selector: string; value: string };
  submitButton: { selector: string; value: string };
}

const formFields: FormFields = {
  firstName: { selector: "#firstName", value: "Arm" },
  lastName: { selector: "#lastName", value: "Men" },
  address: { selector: "#address", value: "Somewhere str. 123" },
  email: { selector: "#email", value: "arm@example.com" },
  phone: { selector: "#phone", value: "123456789" },
  country: { selector: "#country", value: "USA" },
  gender: { selector: "input[name='gender'][value='", value: "male" },
  language: { selector: "#language", value: "English" },
  skills: { selector: "#skills", value: "JavaScript" },
  hobbies: { selector: "input.hobby", value: ["Travelling", "Movies", "Sports", "Gaming"] },
  dateOfBirthYear: { selector: "#year", value: "1991" },
  dateOfBirthMonth: { selector: "#month", value: "January" },
  dateOfBirthDay: { selector: "#day", value: "1" },
  password: { selector: "#password", value: "123456789" },
  passwordConfirm: { selector: "#password-confirm", value: "123456789" },
  submitButton: { selector: "button[type='submit']", value: "Submit" },
};

test.describe("[REGISTRATION FORM COMPLETE]", { tag: "@smoke" }, () => {
  test.beforeEach(async ({ page }) => {
    const url = "https://anatoly-karpovich.github.io/demo-registration-form/";
    await page.goto(url);
  });

  test("Should register successfully with valid data", { tag: ["@smoke", "@positive"] }, async ({ page }) => {
    const firstNameInput = page.locator(formFields.firstName.selector);
    const lastNameInput = page.locator(formFields.lastName.selector);
    const addressInput = page.locator(formFields.address.selector);
    const emailAddressInput = page.locator(formFields.email.selector);
    const phoneInput = page.locator(formFields.phone.selector);
    const countryDropDown = page.locator(formFields.country.selector);
    const genderRadioButton = page.locator(`${formFields.gender.selector}${formFields.gender.value}']`);
    const hobbiesCheckbox = formFields.hobbies.value;

    const languageInput = page.locator(formFields.language.selector);
    const skillsSelect = page.locator(formFields.skills.selector);
    const dateOfBirthYear = page.locator(formFields.dateOfBirthYear.selector);
    const dateOfBirthMonth = page.locator(formFields.dateOfBirthMonth.selector);
    const dateOfBirthDay = page.locator(formFields.dateOfBirthDay.selector);
    const passwordInput = page.locator(formFields.password.selector);
    const confirmPasswordInput = page.locator(formFields.passwordConfirm.selector);
    const submitButton = page.locator(formFields.submitButton.selector);

    await firstNameInput.fill(formFields.firstName.value);
    await lastNameInput.fill(formFields.lastName.value);
    await addressInput.fill(formFields.address.value);
    await emailAddressInput.fill(formFields.email.value);
    await phoneInput.fill(formFields.phone.value);

    await countryDropDown.selectOption(formFields.country.value);
    await genderRadioButton.check();
    for (const hobby of hobbiesCheckbox) {
      await page.locator(`${formFields.hobbies.selector}[value="${hobby}"]`).check();
    }

    await languageInput.fill(formFields.language.value);
    await skillsSelect.selectOption([formFields.skills.value]);

    await dateOfBirthYear.selectOption(formFields.dateOfBirthYear.value);
    await dateOfBirthMonth.selectOption(formFields.dateOfBirthMonth.value);
    await dateOfBirthDay.selectOption(formFields.dateOfBirthDay.value);

    await passwordInput.fill(formFields.password.value);
    await confirmPasswordInput.fill(formFields.passwordConfirm.value);

    await submitButton.click();

    await expect(page.locator("text=Registration Details")).toBeVisible();
    await expect(page.getByRole("button", { name: "Back to Form" })).toBeVisible();
    await expect(page.locator("#fullName")).toHaveText(`${formFields.firstName.value} ${formFields.lastName.value}`);
    await expect(page.locator("#address")).toHaveText(formFields.address.value);
    await expect(page.locator("#email")).toHaveText(formFields.email.value);
    await expect(page.locator("#phone")).toHaveText(formFields.phone.value);
    await expect(page.locator("#country")).toHaveText(formFields.country.value);
    await expect(page.locator("#gender")).toHaveText(formFields.gender.value);
    await expect(page.locator("#language")).toHaveText(formFields.language.value);
    await expect(page.locator("#skills")).toHaveText(formFields.skills.value);
    await expect(page.locator("#hobbies")).toHaveText(formFields.hobbies.value.join(", "));
    await expect(page.locator("#dateOfBirth")).toHaveText(
      `${formFields.dateOfBirthDay.value} ${formFields.dateOfBirthMonth.value} ${formFields.dateOfBirthYear.value}`,
    );
    const maskedPassword = "*".repeat(formFields.password.value.length);
    await expect(page.locator("#password")).toHaveText(maskedPassword);
  });
});
