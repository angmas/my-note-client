'use strict'
const store = require('../store')
// const api = require('./api')

const navPages = require('../navPages')

const createNoteSuccess = (data) => {
  console.log('createNoteSuccess ran: ', data)
}

const createNoteFailure = (error) => {
  console.error('createNoteFailure ran: ', error)
}

const showNotesSuccess = (data) => {
  store.notes = data.user.notes
  console.log('showNotesSuccess ran: ', store)
  navPages.showHomePage()
}

const showNotesFailure = (error) => {
  console.error('showNotesFailure ran:', error)
}
const signOutSuccess = () => {
  console.log('signOutSuccess ran')
  store.user = null
}

const signOutFailure = (error) => {
  console.error('signOutFailure ran:', error)
}

const changePasswordSuccess = () => {
  console.log('changePasswordSuccess ran')
}

const changePasswordFailure = (error) => {
  console.error('changePasswordFailure ran:', error)
}

module.exports = {
  createNoteSuccess,
  createNoteFailure,
  showNotesSuccess,
  showNotesFailure,
  signOutSuccess,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure
}
