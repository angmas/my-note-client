'use strict'
const showLandingPageTemplate = require('./templates/landing-page.handlebars')

const authEvents = require('./auth/events.js')

const showLandingPage = function () {
  $('.container').append(showLandingPageTemplate)
  authEvents.addHandlers()
}

module.exports = {
  showLandingPage
}
