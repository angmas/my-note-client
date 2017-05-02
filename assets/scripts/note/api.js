'use strict'
const config = require('../config')
const store = require('../store')

const createNote = (data) => {
  console.log('Iam in createNote api.js')
  return $.ajax({
    url: config.apiOrigin + '/notes',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const showNotes = () => {
  console.log('I am in showNotes')
  return $.ajax({
    url: config.apiOrigin + '/users/' + store.user.id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}
const destroyNote = (data) => {
  console.log('I am in destroyNote')
  return $.ajax({
    url: config.apiOrigin + '/notes/' + data,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const changePassword = (data) => {
  console.log('changePassword ran - store is: ', store)
  return $.ajax({
    url: config.apiOrigin + '/change-password/' + store.user.id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

module.exports = {
  createNote,
  showNotes,
  destroyNote,
  changePassword
}
