//all the console.log into 2 methods , one for logging infos an one for logging errors

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }