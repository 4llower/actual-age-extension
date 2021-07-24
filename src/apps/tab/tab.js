'use strict'

import './styles'
import moment from 'moment'
import { changeTheme, storage } from '../common'
import '../common/styles'
import { config } from './config'

export const setupTab = () => {
  const age = document.getElementById('age')
  const ageMain = document.getElementById('age__main')
  const ageExtra = document.getElementById('age__extra')
  // const loader = document.getElementById('loader')

  storage.get('theme', (theme) => {
    console.log(theme)
    changeTheme(theme)
  })

  const getMain = (birthday) => {
    const date = moment(birthday)
    return moment().diff(date, 'years')
  }

  const formatExtra = (extra) => extra.toFixed(config.FIXED_POINT).slice(1)

  const getExtra = (birthday) => {
    const main = getMain(birthday)
    const seconds = moment(birthday)
      .add(main + 1, 'years')
      .diff(moment(birthday).add(main, 'years'), 'seconds')

    const diff = moment(birthday)
      .add(main + 1, 'years')
      .diff(moment(), 'seconds')

    return formatExtra(1 - diff / seconds)
  }

  let isStarted = false
  let interval

  const setup = (birthday) => {
    isStarted = true
    age.style.display = 'flex'

    // loader.style.display = 'none'

    if (!birthday || !moment(birthday).isValid()) {
      ageMain.innerText = 'Choose'
      ageExtra.innerText = 'You Birth Date & Time'
      return
    }

    if (interval) clearInterval(interval)

    let lastExtra
    let smoothExtra

    interval = setInterval(() => {
      const extra = getExtra(birthday)
      const main = getMain(birthday)
      if (!lastExtra) {
        lastExtra = extra
        ageExtra.innerText = getExtra(birthday)
      } else {
        if (extra !== lastExtra) {
          ageExtra.innerText = extra
          smoothExtra = undefined
          lastExtra = extra
        } else {
          if (!smoothExtra) smoothExtra = parseFloat(lastExtra)
          smoothExtra += config.MINIMAL_EXTRA_VALUE
          ageExtra.innerText = formatExtra(smoothExtra)
        }
      }
      if (extra === formatExtra(0.0)) ageMain.innerText = main + 1
      else ageMain.innerText = main
    }, config.POLLING_TIMEOUT)
  }

  chrome.runtime.onMessage.addListener(({ type, payload }) => {
    console.log(228)
    if (type === 'UPDATE_BIRTHDAY') setup(payload.birthday)
    return true
  })

  storage.get('birthday', (birthday) => {
    console.log(228)
    if (!isStarted) setup(birthday)
  })
}

setupTab()
