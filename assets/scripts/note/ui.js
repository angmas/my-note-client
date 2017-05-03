'use strict'

const createNoteFailure = (error) => {
  console.error('createNoteFailure ran: ', error)
}

const showNotesFailure = (error) => {
  console.error('showNotesFailure ran:', error)
}

const updateNoteFailure = (error) => {
  console.error('updateNoteFailure ran:', error)
}

const destroyNoteFailure = (error) => {
  console.error('updateNoteFailure ran:', error)
}
module.exports = {
  createNoteFailure,
  showNotesFailure,
  updateNoteFailure,
  destroyNoteFailure
}
