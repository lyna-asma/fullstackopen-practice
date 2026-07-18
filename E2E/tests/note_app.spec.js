const { test, expect , describe } = require('@playwright/test')


describe('Note app', () => {
test('front page can be opened', async ({ page }) => {
    //First, the test opens the application with the method page.goto. After this, 
    // it uses the page.getByText to get a locator that corresponds to the element where the text Notes is found.
  await page.goto('http://localhost:5173')

  // This doesn't immediately search the DOM and hand you back an element. Instead,
  //  it creates an object that knows how to find an element matching "text is 'Notes'"
  // whenever you actually need it to. When you later call something on it (like .click(), .isVisible(), or expect(locator).toBeVisible()), Playwright runs the actual search at that moment.

  const locator = page.getByText('Notes')
    // The method toBeVisible ensures that the element corresponding to the locator is visible at the page.
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
})

// opening login form
 test('user can log in', async ({ page }) => {
    await page.goto('http://localhost:5173')
// retreivig the button based on its text
    await page.getByRole('button', { name: 'login' }).click()
// the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
  await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    
// now we can add expect bcz we actually entered info 
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })


  
})