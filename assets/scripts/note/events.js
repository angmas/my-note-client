'use strict'
const store = require('../store')
const getFormFields = require(`../../../lib/get-form-fields`)

const api = require('./api')
const ui = require('./ui')

const onCreateNote = function (event) {
  event.preventDefault()
  console.log('I am in onCreateNote')
  // set the value of favorite so that the function getFormFields can parse it correctly
  $('input[type="checkbox"]').val($('input[type="checkbox"]').prop('checked'))
  const data = getFormFields(this)
  console.log('onCreateNote data: ', data)

  api.createNote(data)
    .then(ui.createNoteSuccess)
    .catch(ui.createNoteFailure)
}

const onUpdateNote = function (event) {
  // get data-id value from form
  const dataId = $('#note-edit').attr('data-id')
  console.log('onUpdateNote dataId: ', dataId)
  // set the value of favorite so that the function getFormFields can parse it correctly
  $('input[type="checkbox"]').val($('input[type="checkbox"]').prop('checked'))
  const check = $('#favorite').val()
  console.log('value of favorite: ', check)
  const data = getFormFields(this)
  event.preventDefault()
  console.log('onUpdateNote ran! data is: ', data)
  api.updateNote(data, dataId)
    .then(ui.onUpdateNoteSuccess)
    .catch(ui.onUpdateNoteFailure)
}

const onSignOut = function (event) {
  // const data = getFormFields(this)
  event.preventDefault()
  console.log('sign-out ran!')
  api.signOut()
    .then(ui.signOutSuccess)
    .catch(ui.signOutFailure)
}
const onChangePassword = function (event) {
  const data = getFormFields(this)
  event.preventDefault()
  console.log('onChangePassword ran!')
  api.changePassword(data)
    .then(ui.changePasswordSuccess)
    .catch(ui.changePasswordFailure)
}
const getDataId = function (element) {
  const modal = $(element).closest('.modal')
  console.log('I am in getDataId element: ', modal)
  const dataId = $(modal).attr('data-id')
  console.log('Iam in getDataId dataId: ', dataId)
  return dataId
}
const onDestroyNote = function () {
  console.log('I am in onDestroyNote this: ', this)
  const dataId = getDataId(this)
  console.log('I am in onDestroyNote dataId: ', dataId)
  api.destroyNote(dataId)
    .then(ui.destroyNoteSuccess)
    .catch(ui.destroyNoteFailure)
}


const addHandlers = () => {
  console.log('I am in note/addHandlers')
  $('#note-create').on('submit', onCreateNote)
  $('.btn-delete-confirmation').on('click', onDestroyNote)
  $('#note-edit').on('submit', onUpdateNote)
  $('#change-password').on('submit', onChangePassword)
}

module.exports = {
  addHandlers
}
