'use strict'
const store = require('./store')
const moment = require('moment')
const getFormFields = require(`../../lib/get-form-fields`)
const navPages = require('./navPages')
const authApi = require('./auth/api')
const authUi = require('./auth/ui')

const noteApi = require('./note/api')
const noteUi = require('./note/ui')

const helper = require('./helper')
const errorMsg = {
  emailRequired: 'Email: required',
  passwordRequired: 'Password: required',
  pwConfirmRequired: 'Password Confirmation: required',
  pwConfirmNotEq: 'Password Confirmation: must match password'
}
const setFieldError = function (input, error) {
  $(input).parent().addClass('has-error')
  $(input).parent().find('.glyphicon').addClass('glyphicon-remove')
  $(input).parent().find('.help-block').text(error)
  console.log('setErrorClasses input: ', input)
  console.log('parent: ', $(input).parent())
  console.log('find glyph: ', $(input).parent().find('.glyphicon'))
  console.log('helptext: ', $(input).parent().find('.help-block'))
}
const isFieldEmpty = function (field) {
  if ($(field).val() === undefined || $(field).val().trim() === '') {
    return true
  }
}
const isEmailInvalid = function (email) {
  console.log('In isEmailInvalid email: ', email)
  if (isFieldEmpty(email)) {
    setFieldError(email, errorMsg.emailRequired)
    return true
  }   // add validation for e-mail pattern.
}
const isPasswordInvalid = function (password) {
  console.log('In isPasswordInvalid password: ', password)
  if (isFieldEmpty(password)) {
    setFieldError(password, errorMsg.passwordRequired)
    return true
  }
}

const isEqToPw = function (password2) {
  const password = $(password2).parents('form').find('.password').val()
  if ($(password2).val() === password) {
    return true
  }
}

const isPwConfirmInvalid = function (pwConfirm) {
  console.log('In isPwConfirmInvalid password: ', pwConfirm)
  if (isFieldEmpty(pwConfirm)) {
    setFieldError(pwConfirm, errorMsg.pwConfirmRequired)
    return true
  }

  if (!isEqToPw(pwConfirm)) {
    console.log('isNotEqToPw')
    setFieldError(pwConfirm, errorMsg.pwConfirmNotEq)
    return true
  }
}
const isFormInvalid = function (authForm) {
  console.log('I am in validatePassword authForm id: ', $(authForm).attr('id'))
  const authFunction = $(authForm).attr('id')
  let invalid = false
  const email = $(authForm).find('.email').get(0)
  console.log('authForm .email: ', email)
  const password = $(authForm).find('.password').get(0)
  const passwordConfirm = $(authForm).find('.password-confirm').get(0)

  if (isEmailInvalid(email)) {
    invalid = true
  }
  if (isPasswordInvalid(password)) {
    invalid = true
  }
  if (authFunction !== 'sign-in') {
    if (isPwConfirmInvalid(passwordConfirm)) {
      invalid = true
    }
  }
  return invalid
}
const authFailure = function (error) {
  const authForm = $('.modal.in').get() // find open modal
  const email = $(authForm).find('.email')
  const password = $(authForm).find('.password')
  const passwordConfirm = $(authForm).find('.password-confirm')
  console.log('authFailure email: ', email)
  const errorMsg = error.responseJSON
  if ('email' in errorMsg) {
    setFieldError(email, `Email: ${errorMsg.email[0]}`)
  }
  if ('password_confirmation' in errorMsg) {
    setFieldError(passwordConfirm, `Password confirmation:  ${errorMsg.password_confirmation}`)
  }
  if ('password' in errorMsg) {
    setFieldError(password, `Password:  ${errorMsg.password}`)
  }
}
const onSignUp = function (event) {
  event.preventDefault()
  console.log('I am in onSignUp this: ', this)
  if (isFormInvalid(this)) {
    return
  }
  const data = getFormFields(this)
  store.autoSignIn = data

  authApi.signUp(data)
    .then(autoSignIn)
    .catch(authFailure)
    // .catch(authUi.signUpFailure)
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
  authApi.signOut()
    .then(onSignOutSuccess)
    .catch(authUi.signOutFailure)
}

const onSignOutSuccess = function () {
  delete store.user
  delete store.notes
  console.log('I am in onSignOutSuccess store: ')
  onShowLandingPage()
}
const onChangePassword = function (event) {
  const data = getFormFields(this)
  event.preventDefault()
  console.log('onChangePassword ran!')
  authApi.changePassword(data)
    .then(navPages.clearModal)
    .catch(authUi.changePasswordFailure)
}

const onShowNotes = function () {
  console.log('I am in onShowNotes')
  noteApi.showNotes()
    .then(onShowNotesSuccess)
    .catch(noteUi.showNotesFailure)
}
const formatDateTime = function () {
  console.log('formatDateTime')
  store.notes.forEach(e => {
    e.created_at = moment(e.created_at).format('MM-DD-YYYY h:mm:ss a')
    e.updated_at = moment(e.updated_at).format('MM-DD-YYYY h:mm:ss a')
  })
}
const onShowNotesSuccess = function (data) {
  store.notes = data.user.notes
  console.log('I am in onShowNotesSuccess store: ', store)
  formatDateTime()
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
  $('.sign-out-nav').on('click', onSignOut)
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
