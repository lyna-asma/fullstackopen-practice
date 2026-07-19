
const loginWith = async (page, username, password)  => {
        // retreivig the button based on its text
        await page.getByRole('button', { name: 'login' }).click()
        // the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
        // it could have been done with : getAllByRole then accessing an array . or  getByText  ,  but labels are better , or even test_id if we have ones in our input feilds
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)

        await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
    await page.getByText(content).waitFor()
}

export { loginWith, createNote }