'use strict'
const store = require('./store')
const showHomeTemplate = require('./templates/home.handlebars')

const clearModal = function () {
  $('.modal').modal('hide')
  $('.modal').modal('backdrop')
  $('.container').empty()
}
const showHomePage = function () {
  clearModal()
  $('.container').append(showHomeTemplate({ email: store.user.email }))
  // addHandlers()
}

// const addHandlers = function () {
//   $('#sign-up-btn').on('click', showSignUpModal)
// }

module.exports = {
  showHomePage}
