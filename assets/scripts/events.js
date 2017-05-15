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
  pwConfirmNotEq: 'Password Confirmation: must match password',
  newPwConfirmNotEq: 'Password Confirmation: must match new password',
  unauthorized: 'Unauthorized: incorrect Email or Password',
  oldPwRequired: 'Old Password: required',
  newPwRequired: 'New Password: required',
  newPwIsSame: 'New Password: must be different',
  oldPwInvalid: 'Old Password: invalid value',
  noteTitleRequired: 'Note Title: required'
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
const setNoteFieldError = function (formGroup, error) {
  $(formGroup).addClass('has-error')
  $(formGroup).find('.glyphicon').addClass('glyphicon-remove')
  $(formGroup).find('.help-block').text(error)
  console.log('setNoteFieldError formGroup: ', formGroup)
  console.log('find glyph: ', $(formGroup).find('.glyphicon'))
  console.log('helptext: ', $(formGroup).find('.help-block'))
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

const isOldPwInvalid = function (oldPw) {
  console.log('In isOldPwInvalid oldPw: ', oldPw)
  if (isFieldEmpty(oldPw)) {
    setFieldError(oldPw, errorMsg.oldPwRequired)
    return true
  }
}

const isNewPwInvalid = function (newPw, oldPw) {
  console.log('In isNewPwInvalid newPw: ', newPw)
  if (isFieldEmpty(newPw)) {
    setFieldError(newPw, errorMsg.newPwRequired)
    return true
  }

  if (isEqToPw(newPw, oldPw)) {
    setFieldError(newPw, errorMsg.newPwIsSame)
    return true
  }
}

const isEqToPw = function (pwConfirm, password) {
  if ($(pwConfirm).val() === $(password).val()) {
    return true
  }
}

const isPwConfirmInvalid = function (pwConfirm, password) {
  console.log('In isPwConfirmInvalid password: ', pwConfirm)
  if (isFieldEmpty(pwConfirm)) {
    setFieldError(pwConfirm, errorMsg.pwConfirmRequired)
    return true
  }

  if (!isEqToPw(pwConfirm, password)) {
    console.log('isNotEqToPw')
    setFieldError(pwConfirm, errorMsg.pwConfirmNotEq)
    return true
  }
}
const isFormInvalid = function (authForm) {
  console.log('I am in validatePassword authForm id: ', $(authForm).attr('id'))
  const authFunction = $(authForm).attr('id')
  let invalid = false

  if (authFunction !== 'change-password') {
    const email = $(authForm).find('.email').get(0)
    console.log('authForm .email: ', email)
    const password = $(authForm).find('.password').get(0)

    if (isEmailInvalid(email)) {
      invalid = true
    }
    if (isPasswordInvalid(password)) {
      invalid = true
    }
  }

  if (authFunction === 'sign-up') {
    const passwordConfirm = $(authForm).find('.password-confirm').get(0)
    if (isPwConfirmInvalid(passwordConfirm)) {
      invalid = true
    }
  }

  if (authFunction === 'change-password') {
    const oldPw = $(authForm).find('.oldPw').get(0)
    const newPw = $(authForm).find('.newPw').get(0)
    const newPwConfirm = $(authForm).find('.password-confirm').get(0)

    if (isOldPwInvalid(oldPw)) {
      invalid = true
    }

    if (isNewPwInvalid(newPw, oldPw)) {
      invalid = true
    }

    if (isPwConfirmInvalid(newPwConfirm, newPw)) {
      invalid = true
    }
  }
  return invalid
}
const authFailure = function (error) {
  // set semantic labels for HTTP status codes
  const unauthorized = 401
  const badRequest = 400

  // find open modal
  const authForm = $('.modal.in').get()

  // set correct DOM elements
  const email = $(authForm).find('.email')
  const password = $(authForm).find('.password')
  const passwordConfirm = $(authForm).find('.password-confirm')
  const oldPw = $(authForm).find('.oldPw')
  console.log('authFailure email: ', email)
  if (error.status === badRequest) {
    if ('responseJSON' in error) {
      const errorMsg = error.responseJSON
      console.log('authFailure error: ', error)
      if ('email' in errorMsg) {
        setFieldError(email, `Email: ${errorMsg.email[0]}`)
      }
      if ('password_confirmation' in errorMsg) {
        setFieldError(passwordConfirm, `Password confirmation:  ${errorMsg.password_confirmation}`)
      }
      if ('password' in errorMsg) {
        setFieldError(password, `Password:  ${errorMsg.password}`)
      }
    } else {
      setFieldError(oldPw, errorMsg.oldPwInvalid)
    }
  }

  if (error.status === unauthorized) {
    setFieldError(email, errorMsg.unauthorized)
    setFieldError(password, '')
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
  event.preventDefault()
  console.log('in onSignIn')
  if (isFormInvalid(this)) {
    return
  }
  const data = getFormFields(this)

  authApi.signIn(data)
    .then(onSignInSuccess)
    // .catch(authUi.signInFailure)
    .catch(authFailure)
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
  event.preventDefault()
  const data = getFormFields(this)
  if (isFormInvalid(this)) {
    return
  }

  console.log('onChangePassword ran!')
  authApi.changePassword(data)
    .then(navPages.clearModal)
    // .catch(authUi.changePasswordFailure)
    .catch(authFailure)
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

const isNoteInvalid = function (noteForm) {
  console.log('I am in isNoteInvalid')
  const noteTitle = $(noteForm).find('.note-title').get()
  const formGroup = $(noteForm).find('.form-group-note-title')

  if (isFieldEmpty(noteTitle)) {
    setNoteFieldError(formGroup, errorMsg.noteTitleRequired)
    return true
  }
}
const onCreateNote = function (event) {
  event.preventDefault()
  console.log('I am in onCreateNote this: ', this)
  if (isNoteInvalid(this)) {
    return
  }
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
