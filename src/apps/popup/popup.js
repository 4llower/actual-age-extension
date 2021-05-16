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
      actualAgeStorage.set('birthdayDate', date)
      if (!birthdayTime) actualAgeStorage.set('birthday', date)
      else actualAgeStorage.set('birthday', date + ' ' + birthdayTime)
    })

  const updateBirthdayTime = (time) =>
    actualAgeStorage.get('birthdayDate', (birthdayDate) => {
      actualAgeStorage.set('birthdayDate', time)
      if (!birthdayDate) actualAgeStorage.set('birthday', time)
      else actualAgeStorage.set('birthday', birthdayDate + ' ' + time)
    })

  function setupActualAge(initialValue) {
    console.log(initialValue)
    const birthdayDate = document.getElementById('date')
    const birthdayTime = document.getElementById('time')

    if (initialValue) {
      console.log(moment(initialValue).format('YYYY-MM-DD'))
      birthdayDate.value = moment(initialValue).format('yyyy-MM-dd')
      birthdayTime.value = moment(initialValue).format('HH:MM')
    }

    birthdayDate.addEventListener('change', (event) =>
      updateBirthdayDate(moment(event.target.value).format('yyyy-MM-dd'))
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
