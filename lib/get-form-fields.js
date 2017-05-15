'use strict'

const addNestedValue = require('./add-nested-value')

const getFormFields = (form) => {
  const target = {}

  const elements = form.elements || []
  for (let i = 0; i < elements.length; i++) {
    const e = elements[i]
    if (!e.hasAttribute('name')) {
      continue
    }

    let type = 'TEXT'
    switch (e.nodeName.toUpperCase()) {
      case 'SELECT':
        type = e.hasAttribute('multiple') ? 'MULTIPLE' : type
        break
      case 'INPUT':
        type = e.getAttribute('type').toUpperCase()
        break
    }

    const name = e.getAttribute('name')
    // console.log('i am in get-form-fields. type: ', type)
    if (type === 'MULTIPLE') {
      for (let i = 0; i < e.length; i++) {
        if (e[i].selected) {
          addNestedValue(target, name, e[i].value)
        }
      }
    } else if (type !== 'RADIO') {
      // the test for checkbox was removed
      // the caveat is that checkbox value MUST
      // be set before the function is called
      // console.log('e : ', e.value)
      addNestedValue(target, name, e.value)
    }
  }

  return target
}

module.exports = getFormFields
