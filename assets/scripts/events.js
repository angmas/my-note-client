'use strict'
const store = require('./store')
const getFormFields = require(`../../lib/get-form-fields`)
const navPages = require('./navPages')
const authApi = require('./auth/api')
const authUi = require('./auth/ui')

const noteApi = require('./note/api')
const noteUi = require('./note/ui')

const helper = require('./helper')

const onSignUp = function (event) {
  event.preventDefault()
  console.log('I am in onSignUp')
  const data = getFormFields(this)
  store.autoSignIn = data

  authApi.signUp(data)
    .then(autoSignIn)
    .catch(authUi.signUpFailure)
}

const autoSignIn = function () {
  console.log('In autoSignIn')

  authApi.signIn(store.autoSignIn)
    .then(onSignInSuccess)
    .catch(authUi.signInFailure)
}

const onSignIn = function (event) {
  const data = getFormFields(this)
  event.preventDefault()
  console.log('sign-in ran!')
  authApi.signIn(data)
    .then(onSignInSuccess)
    .catch(authUi.signInFailure)
}

const onSignInSuccess = function (data) {
  store.user = data.user
  delete store.autoSignIn
  console.log('I am in onSignInSuccess store: ', store)
  onShowNotes()
}

const onSignOut = function (event) {
  // const data = getFormFields(this)
  event.preventDefault()
  console.log('onSignOut ran!')
  authUi.signOut()
    .then(onShowLandingPage)
    .catch(authUi.signOutFailure)
}
const onChangePassword = function (event) {
  const data = getFormFields(this)
  event.preventDefault()
  console.log('onChangePassword ran!')
  authUi.changePassword(data)
    .then(authUi.changePasswordSuccess)
    .catch(authUi.changePasswordFailure)
}

const onShowNotes = function () {
  console.log('I am in onShowNotes')
  noteApi.showNotes()
    .then(onShowNotesSuccess)
    .catch(noteUi.showNotesFailure)
}
const onShowNotesSuccess = function (data) {
  store.notes = data.user.notes
  console.log('I am in onShowNotesSuccess store: ', store)
  onShowHomePage()
}
const onDestroyNote = function () {
  console.log('I am in onDestroyNote this: ', this)
  const dataId = helper.getDataId(this)
  console.log('I am in onDestroyNote dataId: ', dataId)
  noteApi.destroyNote(dataId)
    .then(onShowNotes)
    .catch(noteUi.destroyNoteFailure)
}
const setCheckbox = function () {
  $('input[type="checkbox"]').val($('input[type="checkbox"]').prop('checked'))
}
const onCreateNote = function (event) {
  event.preventDefault()
  console.log('I am in onCreateNote')
  // set the value of favorite so that the function getFormFields can parse it correctly
  setCheckbox()
  const data = getFormFields(this)
  console.log('onCreateNote data: ', data)

  noteApi.createNote(data)
    .then(onShowNotes)
    .catch(noteUi.createNoteFailure)
}

const onUpdateNote = function (event) {
  event.preventDefault()
  // get data-id value from form
  const dataId = $('#note-edit').attr('data-id')
  console.log('onUpdateNote dataId: ', dataId)
  // set the value of favorite so that the function getFormFields can parse it correctly
  setCheckbox()
  // $(checkbox).val($('checkbox').prop('checked'))
  // const check = $(checkbox).val()
  // console.log('value of favorite: ', check)
  const data = getFormFields(this)

  console.log('onUpdateNote ran! data is: ', data)
  noteApi.updateNote(data, dataId)
    .then(onShowNotes)
    .catch(noteUi.updateNoteFailure)
}

const addHomeHandlers = () => {
  console.log('I am in note/addHandlers')
  $('#note-create').on('submit', onCreateNote)
  $('.btn-delete-confirmation').on('click', onDestroyNote)
  $('#note-edit').on('submit', onUpdateNote)
  $('#sign-out').on('submit', onSignOut)
  $('#change-password').on('submit', onChangePassword)
}

const addLandingPageHandlers = () => {
  console.log('I am in addLandingPageHandlers')
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
}

const onShowLandingPage = function () {
  navPages.showLandingPage()
  addLandingPageHandlers()
}

const onShowHomePage = function (data) {
  helper.saveNotesData
  navPages.showHomePage()
  addHomeHandlers()
}

module.exports = {
  onShowLandingPage
}
