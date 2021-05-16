'use strict'

import './styles'
import 'bootstrap/scss/bootstrap.scss'
import moment from 'moment'
;(function () {
  const actualAgeStorage = {
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
          cb()
        }
      )
    },
  }

  const updateBirthdayDate = (date) =>
    actualAgeStorage.get('birthdayTime', (birthdayTime) => {
      if (!birthdayTime) {
        actualAgeStorage.set('birthday', date)
      } else {
        actualAgeStorage.set('birthday', date + birthdayTime)
      }
    })

  const updateBirthdayTime = (time) =>
    actualAgeStorage.get('birthdayDate', (birthdayDate) => {
      if (!birthdayDate) {
        actualAgeStorage.set('birthday', time)
      } else {
        actualAgeStorage.set('birthday', birthdayDate + time)
      }
    })

  function setupActualAge(initialValue) {
    const birthdayDate = document.getElementById('date')
    const birthdayTime = document.getElementById('time')

    if (initialValue) {
      birthdayDate.value = moment(initialValue).format('MM/DD/YYYY')
      birthdayTime.value = moment(initialValue).format('HH:MM')
    }

    birthdayDate.addEventListener('change', (event) =>
      updateBirthdayDate(event.target.value)
    )
    birthdayTime.addEventListener('change', (event) =>
      updateBirthdayTime(event.target.value)
    )
  }

  function restoreActualAge() {
    actualAgeStorage.get('birthday', (age) => {
      if (typeof age === 'undefined') {
        actualAgeStorage.set('birthday', 0, () => {
          setupActualAge(0)
        })
      } else {
        setupActualAge(age)
      }
    })
  }

  document.addEventListener('DOMContentLoaded', restoreActualAge)
})()
