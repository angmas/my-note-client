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
  addHandlers()
}
const addNoteToView = function () {
  clearModal()
  $('.container').append(oneNoteTemplate({ notes: store.note }))
}

const passTitleToModal = function () {
  const title = parseTitle(this)
  console.log('I am in passTitleModal title: ', title)
  $('.modal-body #delete-title').text(title)
}

const parseTitle = function (element) {
  let title
  console.log('parseTitle this: ', element)
  const note = $(element).parent()
  const noteSpan = $(note).children('span')
  const strong = $(note).children('strong')
  const strongSpan = $(strong).children('span')

  if (strong.length === 0) {
    title = $(noteSpan).text()
  } else {
    title = $(strongSpan).text()
    title.trimLeft()
  }
  return title
  // console.log('In passTitleToModal span.length: ', noteSpan.length)
  // console.log('In passTitleToModal strong.length:', strong.length)
  // console.log('In passTitleModal title: ', title)
}

const addHandlers = function () {
  $('.btn-remove-class').on('click', passTitleToModal)
}

module.exports = {
  showHomePage,
  addNoteToView,
  clearModal
}
