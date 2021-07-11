import { storage } from '../../common'

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

export const updateBirthdayDate = (date) => {
  storage.get('birthdayTime', (birthdayTime) => {
    storage.set('birthdayDate', date)
    if (!birthdayTime) storage.set('birthday', date, updateBirthdayPostMessage)
    else
      storage.set(
        'birthday',
        date + ' ' + birthdayTime,
        updateBirthdayPostMessage
      )
  })
}

export const updateBirthdayTime = (time) => {
  storage.get('birthdayDate', (birthdayDate) => {
    storage.set('birthdayTime', time)
    if (!birthdayDate) storage.set('birthday', time, updateBirthdayPostMessage)
    else
      storage.set(
        'birthday',
        birthdayDate + ' ' + time,
        updateBirthdayPostMessage
      )
  })
}
