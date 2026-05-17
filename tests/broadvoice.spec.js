const { test, expect } = require("@playwright/test");
const {
  searchBook,
  openBookCard,
  getTestData,
  validateBookDetails,
  openCorrectEdition,
  openBookCardExactWithAuthor,
} = require("../commands/commands");

test.beforeEach(async ({ page }) => {
  //Preconditions: User has access to the Bertrand website
  //And step 1: Open the Bertrand homepage
  await page.goto("/");

  const botaoCookies = page.getByRole("button", { name: /Aceitar|Aceito/i });

  if (await botaoCookies.isVisible()) {
    await botaoCookies.click();
  }
});

test('TC01 - Validate book details for "1984"', async ({ page }) => {
  const expected = {
    title: "1984",
    author: "George Orwell",
    isbn: "9789722071550",
    pages: "344",
    dimensions: "156 x 238 x 22 mm",
  };
  // Command to step 1
  await searchBook(page, expected.title);
  // step 2
  const found = await openCorrectEdition(page, expected.title, expected.author);
  expect(found).toBeTruthy();
  // command to step 3
  await validateBookDetails(page, expected);
});

test("TC02 - Validate author consistency between related books", async ({ page }) => {
  const primaryBook = "1984";
  const secondaryBook = "A Quinta dos Animais";
  const expectedAuthor = "George Orwell";

  // Step 1
  await searchBook(page, primaryBook);

  // Step 2
  await openBookCardExactWithAuthor(page, primaryBook, expectedAuthor);

  // Step 3
  const primaryAuthor = (await page
    .locator("#productPageRightSectionTop-author-lnk")
    .first()
    .innerText()).trim();

  // Step 4
  await searchBook(page, secondaryBook);

  // Step 5
  await openBookCardExactWithAuthor(page, secondaryBook, expectedAuthor);

  // Step 6
  const secondaryAuthor = (await page
    .locator("#productPageRightSectionTop-author-lnk")
    .first()
    .innerText()).trim();

  // Step 7
  expect(secondaryAuthor).toBe(primaryAuthor);
});

test('TC03 - Validate language and author information for "Do Not Disturb"', async ({ page }) => {
  const expectedTitle = "Do Not Disturb";
  const expectedAuthor = "Freida McFadden";
  const expectedLanguage = "Inglês";

  // step 1
  await searchBook(page, expectedTitle);

  // step 2 
  await openBookCard(page, expectedTitle);

  // step 3 - Title
  await expect(page.locator("h1")).toContainText(expectedTitle);
  // step 3 - Author
  await expect(
    page.locator("#productPageRightSectionTop-author-lnk"),
  ).toHaveText(expectedAuthor);
  // step 3 - Country flag icon
  await expect(
    page.locator("#productPageRightSectionTop-languageFlag"),
  ).toBeVisible();
  // step 3 - Language
  await expect(
    page.locator("#productPageRightSectionTop-language"),
  ).toContainText(expectedLanguage);
});

test('TC04 - Add book "1984" to cart and validate cart contents', async ({ page }) => {
  const expectedTitle = "1984";
  const expectedAuthor = "George Orwell";

  // step 1
  await searchBook(page, expectedTitle);

  // step 2
  await openBookCard(page, expectedTitle);

  // step 3
  const buyBtn = page.locator(
    "#productPageRightSectionTop-actions-addCart-btn",
  );
  await expect(buyBtn).toBeVisible();
  await expect(buyBtn).toBeEnabled(); 
  await buyBtn.click();

  await expect(page.locator("#badge-shoppingCart")).toHaveText("1");

  // step 4
  const cartButton = page.locator("#cart-button");
  await cartButton.scrollIntoViewIfNeeded();
  await cartButton.click({ force: true });
  const cartItem = page.locator("#product-line-0");
  await expect(cartItem).toBeVisible();

  // step 5 - Book title
  await expect(cartItem).toContainText(expectedTitle);

  // step 5 - Quantity
  const quantityField = cartItem.locator('input[type="number"]');
  await expect(quantityField).toHaveValue("1");
});

test("TC05 - Search for a non-existing book", async ({ page }) => {
  const searchValue = "BJRR123";
  const expectedMessage = "0 resultados.";

  // step 1
  await page.locator('input[name="palavra"]').fill(searchValue);
  //step 2
  await page.click('button[type="submit"]');
  
  //expected results
  await expect(page.locator("h1")).toHaveText("0 resultados.");

  const productCards = page.locator(".product-portlet");
  await expect(productCards).toHaveCount(0);
});


