const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login first
  await page.goto('http://127.0.0.1:3000/admin/login');
  await page.fill('input[name="username"]', 'admin@digivents.com');
  await page.fill('input[name="password"]', 'Admin@123456');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation();
  console.log('Login successful');
  
  // Go to creators
  await page.goto('http://127.0.0.1:3000/admin/creators');
  
  // Try to upload
  await page.fill('#nameInput', 'PlaywrightCreator');
  await page.fill('#roleInput', 'Tester');
  await page.setInputFiles('#photoInput', 'test.jpg');
  
  page.on('response', resp => console.log(resp.url(), resp.status()));
  
  await page.click('#submitBtn');
  
  // Wait a bit
  await page.waitForTimeout(2000);
  
  // Check the DOM
  const text = await page.content();
  const errorMsg = await page.evaluate(() => document.getElementById('errorMsg').innerText);
  console.log('Error message if any:', errorMsg);
  
  await browser.close();
})();
