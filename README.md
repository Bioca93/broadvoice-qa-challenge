# 📚 Bertrand E2E Automation Project — Playwright Automation

> **ℹ️ GitHub Repository**
>  
> https://github.com/Bioca93/broadvoice-qa-challenge

---

## 🚀 Tech Stack

- Playwright  
- Node.js  
- JavaScript
- VS Code  

---

## Project Structure
```
project/
│── commands/
│     └── commands.js
│── tests/
│     └── broadvoice.spec.js
│── docs/
│     └── Pratical Exercice - Test Cases.pdf
│── playwright.config.js
│── package.json
│── README.md
```

## 🔧 Installation

Clone the repository:
```
git clone https://github.com/Bioca93/broadvoice-qa-challenge.git
cd broadvoice-qa-challenge
```

Install dependencies:
```
Code
npm install
```
Install Playwright browsers:
```
Code
npx playwright install
```

## ▶️ Running the Tests

Run all tests (headless mode)
```
Code
npx playwright test
```
Run tests with UI
```
Code
npx playwright test --ui
```
Run a specific test
```
Code
npx playwright test --grep "TC02"
```
Open the HTML report
```
Code
npx playwright show-report
```
>
## 📄 Test Case Documentation

> The complete Test Case documentation is available here:  
> 👉 [Pratical Exercice - Test Cases.pdf](./docs/Pratical%20Exercice%20-%20Test%20Cases.pdf)

## 📊 Test Execution Report (Screenshot)

Below is a screenshot of the Playwright test report:

![Report Summary](https://github.com/Bioca93/broadvoice-qa-challenge/blob/main/docs/ReportSummary.png)


## 📌 Assumptions Made During Development

* Exact Title Matching  
Some books have multiple editions with similar titles.
To avoid selecting graphic novels or illustrated editions, I implemented exact title matching using regex anchors (^ and $).

* Author Matching  
The Bertrand website sometimes displays multiple authors (e.g., illustrators, translators).
To ensure accuracy, I capture the first author or filter by the expected author when required.

* Duplicate HTML IDs  
The website uses the same ID (productPageRightSectionTop-author-lnk) for multiple authors.
To avoid strict mode violations, I use .first() or hasText filters.

* Cookies Banner  
A cookie acceptance banner appears on first load.
The test suite automatically detects and closes it.

* Search Behavior  
The search bar auto-submits when pressing Enter or clicking the button.
Both behaviors are supported.

* Network Stability  
Tests assume normal network conditions.
No artificial waits were added; Playwright’s auto-waiting handles synchronization.
