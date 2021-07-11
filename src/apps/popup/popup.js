'use strict'

import './styles'
import 'bootstrap/scss/bootstrap.scss'
import * as SimpleSwitch from 'a-simple-switch'
import 'a-simple-switch/src/sass/SimpleSwitch.scss'
import moment from 'moment'
import '../common/styles'
import { config } from './config'
import { storage } from '../common'
import { updateBirthdayDate, updateBirthdayTime } from './utils'

export const setupPopup = () => {
  function setupActualAge(initialValue) {
    const birthdayDate = document.getElementById('date')
    const birthdayTime = document.getElementById('time')

    if (initialValue) {
      if (moment(initialValue).format('YYYY-MM-DD') !== config.INVALID_DATE)
        birthdayDate.value = moment(initialValue).format('YYYY-MM-DD')
      if (moment(initialValue).format('HH:mm') !== config.INVALID_DATE) {
        birthdayTime.value = moment(initialValue).format('HH:mm')
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
    storage.get('birthday', setupActualAge)
    SimpleSwitch.init()
    const phrase = document.getElementById('phrase')
    const loader = document.getElementById('loader')
    const dark = document.getElementById('dark')
    const light = document.getElementById('light')
    const switcher = document.getElementById('theme-switch')

    let currentTheme = 'dark'

    switcher.addEventListener('change', (event) => {
      if (event.target.checked) {
        currentTheme = 'light'
        light.classList.remove('hidden')
        dark.classList.add('hidden')
      } else {
        currentTheme = 'dark'
        dark.classList.remove('hidden')
        light.classList.add('hidden')
      }
      storage.set('theme', currentTheme)
    })

    const hideLoader = () => {
      loader.style.display = 'none'
    }

    setTimeout(
      () =>
        fetch(config.PHRASE_API_URL)
          .then(async (r) => {
            const { quotes } = await r.json()
            hideLoader()
            phrase.innerText = quotes.length
              ? quotes[0].text
              : config.DEFAULT_PHRASE
          })
          .catch(() => {
            hideLoader()
            phrase.innerText = config.DEFAULT_PHRASE
          }),
      200
    )
  }

  document.addEventListener('DOMContentLoaded', restoreActualAge)
}

setupPopup()
