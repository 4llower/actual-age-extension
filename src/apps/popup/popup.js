'use strict'

import './styles'
import 'bootstrap/scss/bootstrap.scss'
import moment from 'moment'
import '../common'

const INVALID_DATE = 'Invalid date'
const DEFAULT_PHRASE = 'Age...is a matter of feeling, not of years.'
const PHRASE_API_URL =
  'https://goquotes-api.herokuapp.com/api/v1/random/1?type=tag&val=motivational'

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

  const updateBirthdayPostMessage = () =>
    storage.get('birthday', (birthday) =>
      chrome.runtime.sendMessage(
        {
          type: 'UPDATE_BIRTHDAY',
          payload: {
            birthday,
          },
        },
        () => {}
      )
    )

  const updateBirthdayDate = (date) =>
    storage.get('birthdayTime', (birthdayTime) => {
      storage.set('birthdayDate', date)
      if (!birthdayTime)
        storage.set('birthday', date, updateBirthdayPostMessage)
      else
        storage.set(
          'birthday',
          date + ' ' + birthdayTime,
          updateBirthdayPostMessage
        )
    })

  const updateBirthdayTime = (time) =>
    storage.get('birthdayDate', (birthdayDate) => {
      storage.set('birthdayTime', time)
      if (!birthdayDate)
        storage.set('birthday', time, updateBirthdayPostMessage)
      else
        storage.set(
          'birthday',
          birthdayDate + ' ' + time,
          updateBirthdayPostMessage
        )
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
    storage.get('birthday', (age) => {
      if (typeof age === 'undefined') {
        storage.set('birthday', 0, () => {
          setupActualAge(0)
        })
      } else {
        setupActualAge(age)
      }
    })
    const phrase = document.getElementById('phrase')
    const loader = document.getElementById('loader')

    const hideLoader = () => {
      loader.style.display = 'none'
    }

    fetch(PHRASE_API_URL)
      .then(async (r) => {
        const { quotes } = await r.json()
        hideLoader()
        phrase.innerText = quotes.length ? quotes[0].text : DEFAULT_PHRASE
      })
      .catch(() => {
        hideLoader()
        phrase.innerText = DEFAULT_PHRASE
      })
  }

  document.addEventListener('DOMContentLoaded', restoreActualAge)
})()
