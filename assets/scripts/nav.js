'use strict'
const showLandingPageTemplate = require('./templates/landing-page.handlebars')

const signUpModal = require('./templates/sign-up-modal.handlebars')

const authEvents = require('./auth/events.js')

let firstLoad = true

const showSignUpModal = function () {
  console.log('I am in signUpModal')
  $('.container').append(signUpModal)
  authEvents.addHandlers()
}
const showLandingPage = function () {
  $('.container').append(showLandingPageTemplate)
  addHandlers()
}
const doFirstLoad = function () {
  console.log('I am in doFirstLoad')
  if (firstLoad === true) {
    showLandingPage()
    firstLoad = false
  }
}
const addHandlers = function () {
  $('#sign-up-btn').on('click', showSignUpModal)
}

module.exports = {
  doFirstLoad,
  showLandingPage
}
