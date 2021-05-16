'use strict'

import './styles'
import 'bootstrap/scss/bootstrap.scss'
import moment from 'moment'

const INVALID_DATE = 'Invalid date'

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
          if (cb) cb()
        }
      )
    },
  }

  const updateBirthdayDate = (date) =>
    actualAgeStorage.get('birthdayTime', (birthdayTime) => {
      actualAgeStorage.set('birthdayDate', date)
      if (!birthdayTime) actualAgeStorage.set('birthday', date)
      else actualAgeStorage.set('birthday', date + ' ' + birthdayTime)
    })

  const updateBirthdayTime = (time) =>
    actualAgeStorage.get('birthdayDate', (birthdayDate) => {
      actualAgeStorage.set('birthdayTime', time)
      if (!birthdayDate) actualAgeStorage.set('birthday', time)
      else actualAgeStorage.set('birthday', birthdayDate + ' ' + time)
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
    })
    birthdayTime.addEventListener('change', (event) => {
      updateBirthdayTime(event.target.value)
    })
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
