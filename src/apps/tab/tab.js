'use strict'

import './styles'
import moment from 'moment'

const POLLING_TIMEOUT = 32
const FIXED_POINT = 9
const MINIMAL_EXTRA_VALUE = Math.pow(1 / 10, FIXED_POINT)

;(function () {
  // const loader = document.getElementById('loader')
  const age = document.getElementById('age')
  const ageMain = document.getElementById('age__main')
  const ageExtra = document.getElementById('age__extra')

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

  const getMain = (birthday) => {
    const date = moment(birthday)
    return moment().diff(date, 'years')
  }

  const formatExtra = (extra) => extra.toFixed(FIXED_POINT).slice(1)

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
    // loader.style.display = 'none'
    age.style.display = 'flex'

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
          smoothExtra += MINIMAL_EXTRA_VALUE
          ageExtra.innerText = formatExtra(smoothExtra)
        }
      }
      if (extra === formatExtra(0.0)) ageMain.innerText = main + 1
      else ageMain.innerText = main
    }, POLLING_TIMEOUT)
  }

  chrome.runtime.onMessage.addListener(({ type, payload }) => {
    if (type === 'UPDATE_BIRTHDAY') setup(payload.birthday)
    return true
  })

  storage.get('birthday', (birthday) => {
    if (!isStarted) setup(birthday)
  })
})()
