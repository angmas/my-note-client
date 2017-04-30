'use strict'
const showLandingPageTemplate = require('./templates/landing-page.handlebars')

let firstLoad = true

const landingPage = function () {
  $('.container').append(showLandingPageTemplate)
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
