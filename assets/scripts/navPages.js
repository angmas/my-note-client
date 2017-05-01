'use strict'

const showHomeTemplate = require('./templates/home.handlebars')

const showHomePage = function () {
  // const options = {show: false}
  $('.modal').modal('hide')
  $('.modal').modal('backdrop')
  $('.container').empty()
  $('.container').append(showHomeTemplate)
  // addHandlers()
}

// const addHandlers = function () {
//   $('#sign-up-btn').on('click', showSignUpModal)
// }

module.exports = {
  showHomePage}
