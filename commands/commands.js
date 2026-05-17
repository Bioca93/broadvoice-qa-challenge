// commands/commands.js

const { expect } = require('@playwright/test');

// Search the book
async function searchBook(page, query) {
  await page.locator('input[name="palavra"]').fill(query);
  await page.click('button[type="submit"]');
  await page.waitForSelector('.product-portlet');
};

// Open book card
async function openBookCard(page, title) {
  const card = page.locator('.product-portlet', { hasText: title }).first();
  await card.locator('.title-product a').click();
  await expect(page).toHaveURL(/livro/);
};


// Validate single test data (ISBN, Páginas, Dimensões)
async function getTestData(page, label, expectedValue) {
  const field = page.locator(`text=${label}`).locator('xpath=..');
  await expect(field).toContainText(expectedValue);
};

// Validate all book details (ISBN, Páginas, Dimensões)
async function validateBookDetails(page, expected) {
  await getTestData(page, 'ISBN', expected.isbn);
  await getTestData(page, 'Páginas', expected.pages);
  await getTestData(page, 'Dimensões', expected.dimensions);
};

//Open correct Edition 
async function openCorrectEdition(page, title, expectedAuthor) {
  const cards = page.locator('.product-portlet');
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    // abrir edição
    await card.locator('.title-product a').click();
    await expect(page).toHaveURL(/livro/);

    // capturar autor
    const authorLocator = page.locator('#productPageRightSectionTop-author-lnk');
    const author = (await authorLocator.innerText()).trim();

    // se for a edição correta → parar
    if (author === expectedAuthor) {
      return true;
    }

    // senão → voltar atrás e continuar
    await page.goBack();
    await page.waitForSelector('.product-portlet');
  }

  return false; // nenhuma edição corresponde
};

async function openBookCardExactWithAuthor(page, exactTitle, exactAuthor) {
  const card = page.locator(".product-portlet", {
    has: page.locator(".title-product a", {
      hasText: new RegExp(`^${exactTitle}$`, "i"),
    }),
    hasText: exactAuthor,
  }).first();

  await card.locator(".title-product a").click();
  await expect(page).toHaveURL(/livro/);
}


module.exports = {
  searchBook,
  openBookCard,
  getTestData,
  validateBookDetails,
  openCorrectEdition,
  openBookCardExactWithAuthor
};
