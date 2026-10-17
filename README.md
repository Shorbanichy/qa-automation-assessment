# Automation Testing Assessment

| Part | Tool | Target |
|------|------|--------|
| UI automation (Q1, Q2, Q3) | **Playwright + TypeScript** (Page Object Model) | https://www.saucedemo.com |
| API automation (Q3-Q8) | **Postman collection + Newman (CLI)** | https://reqres.in/api |

## Prerequisites
- Node.js 18+ (`node -v`)
- Java 8+ only if you want the Allure report

## Setup
```bash
npm install
npx playwright install chromium
```

## Run

### UI tests
```bash
npm run test:q1        # Q1  locked_out_user error message
npm run test:q2        # Q2  standard_user full purchase
npm run test:q3        # Q3  performance_glitch_user, sort Z-A, purchase
npm run test:ui        # all 3 UI tests, sequentially (1 worker): q1 -> q2 -> q3
npm run test:ui:headed # same, with a visible browser
```

### API tests (Newman, from the command line)
```bash
npm run api:test
# or directly:
npx newman run postman/reqres.postman_collection.json -e postman/reqres.postman_environment.json
```
You can also import `postman/reqres.postman_collection.json` and `postman/reqres.postman_environment.json` into the Postman app.

> **API key:** reqres.in now requires an `x-api-key` header. A collection-level pre-request script adds it from the `apiKey` environment variable (default `reqres-free-v1`). If you get 401/403, create a free key at https://app.reqres.in and put it in `postman/reqres.postman_environment.json`.

### Everything together (UI sequential, then API)
```bash
npm run test:all
```

## Reports (generated after every execution)
| Report | Location | Open with |
|--------|----------|-----------|
| Playwright HTML | `playwright-report/` | `npm run report:html` |
| Allure (raw results) | `allure-results/` | `npm run allure:generate && npm run allure:open` |
| API HTML (Newman htmlextra) | `reports/newman/api-report.html` | `npm run report:api` |
| API JSON | `reports/newman/api-report.json` | - |

Screenshots, video and trace are saved automatically for failed UI tests.

## What each test covers

**Q1** - Login as `locked_out_user`; assert `Epic sadface: Sorry, this user has been locked out.` and that the user stays on the login page.

**Q2** - Login `standard_user` -> Reset App State -> add 3 items -> cart -> checkout info -> on the overview page assert product names, prices, item total, 8% tax and the final Total -> Finish -> assert "Thank you for your order!" -> Reset App State -> Logout.

**Q3 (UI)** - Login `performance_glitch_user` -> Reset App State -> sort Name (Z to A) and verify the order -> add the first product -> checkout overview verification of the name and total -> Finish -> success message -> Reset App State -> Logout.

**API** (every request asserts the status code, response time and body):

| # | Request | Assertions |
|---|---------|-----------|
| Q3 | `POST /login` | 200, token present, stored as `authToken` |
| Q4 | `GET /users/{userId}` | 200, id, name and email match expected |
| Q5 | `PUT /users/{userId}` | 200, name/job echoed, `updatedAt` is a valid, recent ISO timestamp |
| Q6 | `PATCH /users/{userId}` | 200, only `job` (+ `updatedAt`) is returned, `name` untouched |
| Q8 | 6 bad requests using stored data (email, password, userId, authToken) | each returns 4xx (400 / 404 / 401-403) plus its error message |

Requests run in order because Q3 stores `authToken`, which Q8 reuses.

## Project structure
```
pages/          Page objects (Login, Inventory, Cart, Checkout, Menu)
tests/          q1, q2, q3 Playwright specs
data/           users, checkout info, expected messages
postman/        collection + environment JSON
scripts/        run-all.js (UI then API)
playwright.config.ts
```

## Push to GitHub
```bash
git init
git add .
git commit -m "Automation assessment: Playwright UI + Postman API"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Make the repository **Public** and submit the URL.
