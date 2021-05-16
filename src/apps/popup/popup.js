'use strict'

import './styles'
import 'bootstrap/scss/bootstrap.scss'
import moment from 'moment'

const INVALID_DATE = 'Invalid date'

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

  const updateBirthday = () =>
    storage.get('birthday', (birthday) =>
      chrome.runtime.sendMessage(
        {
          type: 'UPDATE_BIRTHDAY',
          payload: {
            message: birthday,
          },
        },
        () => {}
      )
    )

  const updateBirthdayDate = (date) =>
    storage.get('birthdayTime', (birthdayTime) => {
      storage.set('birthdayDate', date)
      if (!birthdayTime) storage.set('birthday', date)
      else storage.set('birthday', date + ' ' + birthdayTime)
    })

  const updateBirthdayTime = (time) =>
    storage.get('birthdayDate', (birthdayDate) => {
      storage.set('birthdayTime', time)
      if (!birthdayDate) storage.set('birthday', time)
      else storage.set('birthday', birthdayDate + ' ' + time)
    })

  function setupActualAge(initialValue) {
    const birthdayDate = document.getElementById('date')
    const birthdayTime = document.getElementById('time')

    if (initialValue) {
      if (moment(initialValue).format('YYYY-MM-DD') !== INVALID_DATE)
        birthdayDate.value = moment(initialValue).format('YYYY-MM-DD')
      if (moment(initialValue).format('HH:MM') !== INVALID_DATE) {
        birthdayTime.value = moment(initialValue).format('HH:MM')
      }
    }

    birthdayDate.addEventListener('change', (event) => {
      updateBirthdayDate(moment(event.target.value).format('YYYY-MM-DD'))
      updateBirthday()
    })
    birthdayTime.addEventListener('change', (event) => {
      updateBirthdayTime(event.target.value)
      updateBirthday()
    })
  }

  function restoreActualAge() {
    storage.get('birthday', (age) => {
      if (typeof age === 'undefined') {
        storage.set('birthday', 0, () => {
          setupActualAge(0)
        })
      } else {
        setupActualAge(age)
      }
    })
  }

  document.addEventListener('DOMContentLoaded', restoreActualAge)
})()
