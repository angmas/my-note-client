'use strict'
const store = require('./store')
const showHomeTemplate = require('./templates/home.handlebars')
const showNoteCreateModalTemplate = require('./templates/note-create-modal.handlebars')

const clearModal = function () {
  $('.modal').modal('hide')
  $('form').trigger('reset')
  $('.modal').modal('backdrop')
  $('.container').empty()
}
const showHomePage = function () {
  clearModal()
  $('.container').append(showHomeTemplate({ email: store.user.email }))
  addHandlers()
}

const showNoteCreateModal = function () {
  $('.container').append(showNoteCreateModalTemplate)
  // addHandlers()
}

const addHandlers = function () {
  console.log('am in navPages/addHandlers')
  $('#note-create-btn').on('click', showNoteCreateModal)
}

module.exports = {
  showHomePage,
  showNoteCreateModal
}
