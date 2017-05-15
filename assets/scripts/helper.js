'use strict'
const getDataId = function (element) {
  const modal = $(element).closest('.modal')
  // console.log('I am in getDataId element: ', modal)
  const dataId = $(modal).attr('data-id')
  // console.log('Iam in getDataId dataId: ', dataId)
  return dataId
}

module.exports = {
  getDataId
  // removeStoreNote,
  // addStoreNote,
  // replaceStoreNote
}
