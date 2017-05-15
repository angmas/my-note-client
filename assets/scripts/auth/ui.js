'use strict'
const signUpFailure = (error) => {
  // console.error('signUpFailure ran: ', error)
}

const signInFailure = (error) => {
  // console.error('signInFailure ran:', error)
}

const signOutFailure = (error) => {
  // console.error('signOutFailure ran:', error)
}

const changePasswordSuccess = () => {
  // console.log('changePasswordSuccess ran')
}

const changePasswordFailure = (error) => {
  // console.error('changePasswordFailure ran:', error)
}

module.exports = {
  signUpFailure,
  signInFailure,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure
}
