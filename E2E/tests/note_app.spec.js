const { test, describe, expect, beforeEach } = require('@playwright/test')
// Since we have prevented the tests from running in parallel, Playwright runs the tests in order
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        // emptying the DB
        await request.post('/api/testing/reset')
        // creating a new user 

        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
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
        // retreivig the button based on its text
        await page.getByRole('button', { name: 'login' }).click()
        // the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
        // it could have been done with : getAllByRole then accessing an array . or  getByText  ,  but labels are better , or even test_id if we have ones in our input feilds
        await page.getByLabel('username').fill('mluukkai')
        await page.getByLabel('password').fill('salainen')

        await page.getByRole('button', { name: 'login' }).click()

        // now we can add expect bcz we actually entered info 
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })



    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'wrong')
        //this was before :
        // await expect(page.getByText('wrong credentials')).toBeVisible()

        // and this is to make sue that the error css selector is used  
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(errorDiv).toBeVisible()
        // we can also test the styles 
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        // no render of logged in user 
        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })

    describe('when logged in', () => {
        // we're aware this faster method exists, but we're deliberately not switching to it, 
        // because it would require restructuring how the database gets set up, and that's extra complexity we don't want to deal with right now."
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright')).toBeVisible()
        })



        describe('and several notes exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note')
                await createNote(page, 'second note')
                await createNote(page, 'third note')
            })

            test('one of those can be made nonimportant', async ({ page }) => {
                     await page.pause()
                const otherNoteText = page.getByText('second note')
                const otherNoteElement = otherNoteText.locator('..')

                await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(otherNoteElement.getByText('make important')).toBeVisible()

            })

        })


    })

})