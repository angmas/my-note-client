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
const updateNoteSuccess = () => {
  console.log('updateNoteSuccess ran')
  store.user = null
}

const updateNoteFailure = (error) => {
  console.error('updateNoteFailure ran:', error)
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
  updateNoteSuccess,
  updateNoteFailure,
  changePasswordSuccess,
  changePasswordFailure
}
