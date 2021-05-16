'use strict'

import './styles'
;(function () {
  const storage = {
    get: (name, cb) => {
      chrome.storage.sync.get([name], (result) => {
        cb(result[name])
      })
    },
    set: (name, value, cb) => {
      chrome.storage.sync.set(
        {
          [name]: value,
        },
        () => {
          if (cb) cb()
        }
      )
    },
  }

  chrome.runtime.onMessage.addListener(({ type, payload }) => {
    if (type === 'UPDATE_BIRTHDAY') {
      console.log(payload)
    }
    return true
  })

  storage.get('birthday', console.log)
})()
