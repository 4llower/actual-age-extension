export const changeTheme = (newTheme) => {
  switch (newTheme) {
    case 'dark': {
      break
    }
    case 'light': {
      break
    }
    default: {
      break
    }
  }
}

const updateThemePostMessage = () => {
  storage.get('theme', (theme) => {
    chrome.runtime.sendMessage(
      {
        type: 'UPDATE_THEME',
        payload: {
          theme,
        },
      },
      () => {}
    )
  })
}
