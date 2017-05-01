'use strict'
const store = require('../store')

const signUpSuccess = (data) => {
  console.log('signUpSuccess ran: ', data)
  $('.container').empty()
}

const signUpFailure = (error) => {
  console.error('signUpFailure ran: ', error)
}

const signInSuccess = (data) => {
  console.log('signInSuccess ran: ', data)
  console.log('signInSuccess ran: ', store)
  store.user = data.user
  console.log('signInSuccess ran: ', store)
}

const signInFailure = (error) => {
  console.error('signInFailure ran:', error)
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
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure
}
