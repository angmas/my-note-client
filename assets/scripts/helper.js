'use strict'
const store = require('./store')
const getDataId = function (element) {
  const modal = $(element).closest('.modal')
  console.log('I am in getDataId element: ', modal)
  const dataId = $(modal).attr('data-id')
  console.log('Iam in getDataId dataId: ', dataId)
  return dataId
}

const saveUserData = function (data) {
  store.user = data.user
  console.log('I am in saveUserData data: ', store)
}

const saveNotesData = function (data) {
  store.notes = data.notes
}

// const removeStoreNote = function () {
//   console.log('In removeStoreNote function')
// }
//
// const addStoreNote = function () {
//   console.log('In addStoreNote')
// }
//
// const replaceStoreNote = function () {
//   console.log('In replaceStoreNote')
// }
module.exports = {
  getDataId,
  saveUserData,
  saveNotesData
  // removeStoreNote,
  // addStoreNote,
  // replaceStoreNote
}
