'use strict'
const store = require('./store')
const noteEvents = require('./note/events')
const showHomeTemplate = require('./templates/home.handlebars')
const oneNoteTemplate = require('./templates/note-listing.handlebars')

const clearModal = function () {
  $('.modal').modal('hide')
  $('form').trigger('reset')
  $('.modal').modal('backdrop')
  $('.container').empty()
}
const showHomePage = function () {
  clearModal()
  $('.container').append(showHomeTemplate({ email: store.user.email,
    notes: store.notes }))
  noteEvents.addHandlers()
}
const addNoteToView = function () {
  clearModal()
  $('.container').append(oneNoteTemplate({ notes: store.note }))
}

module.exports = {
  showHomePage,
  addNoteToView,
  clearModal
}
