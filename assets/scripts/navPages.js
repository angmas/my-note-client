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

const getDataId = function (element) {
  const li = $(element).parent()
  const dataId = $(li).attr('data-id')
  return dataId
}
const parseTitle = function (element) {
  let title
  console.log('parseTitle this: ', element)
  // The note title will exist in span element.
  // If the note item favorite=true, then the
  // the span will be a child of the strong element
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
const passDataToModal = function () {
  const title = parseTitle(this)
  const dataId = getDataId(this)
  console.log('I am in passDataModal title: ', title)
  console.log('I am in passDataModal dataId: ', dataId)
  $('.modal-body #delete-title').text(title)
  $('#confirm-delete-modal').attr('data-id', dataId)
}
const addHandlers = function () {
  $('.btn-remove-class').on('click', passDataToModal)
}

module.exports = {
  showHomePage,
  addNoteToView,
  clearModal
}
