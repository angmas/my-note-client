'use strict'
const store = require('./store')
const noteEvents = require('./note/events')
const showHomeTemplate = require('./templates/home.handlebars')
const oneNoteTemplate = require('./templates/note-listing.handlebars')
const noteEditFields = require('./templates/note-partial.handlebars')

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
const passDataToDelConfModal = function () {
  const title = parseTitle(this)
  const dataId = getDataId(this)
  console.log('I am in passDataModal title: ', title)
  console.log('I am in passDataModal dataId: ', dataId)
  $('.modal-body #delete-title').text(title)
  $('#confirm-delete-modal').attr('data-id', dataId)
}

const passNoteToEditModal = function () {
  const dataId = getDataId(this)
  // find the exact note item from store
  const noteItem = store.notes.find(e => e.id === parseInt(dataId))
  // set data-id on form so it can get passed on Save
  $('#note-edit').attr('data-id', dataId)
  // since the fieldset is appended, it needs to be cleared out so multiple field sets are not appended
  $('fieldset').empty()
  $('fieldset').append(noteEditFields({note: noteItem}))

  // manually set checkbox. checkboxes suck
  $('input[type="checkbox"]').prop('checked', noteItem.favorite)
}

const addHandlers = function () {
  $('.btn-remove-class').on('click', passDataToDelConfModal)
  $('.btn-edit-class').on('click', passNoteToEditModal)
}

module.exports = {
  showHomePage,
  addNoteToView,
  clearModal
}
