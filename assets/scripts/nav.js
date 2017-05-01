'use strict'
const showLandingPageTemplate = require('./templates/landing-page.handlebars')

const authEvents = require('./auth/events.js')

let firstLoad = true

const landingPage = function () {
  $('.container').append(showLandingPageTemplate)
  authEvents.addHandlers()
}
const doFirstLoad = function () {
  console.log('I am in doFirstLoad')
  if (firstLoad === true) {
    landingPage()
    firstLoad = false
  }
}

module.exports = {
  doFirstLoad,
  landingPage
}
