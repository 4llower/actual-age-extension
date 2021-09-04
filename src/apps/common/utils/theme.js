export const changeTheme = (newTheme) => {
  switch (newTheme) {
    case "dark": {
      document.body.classList.add("dark");
      break;
    }
    case "light": {
      document.body.classList.remove("dark");
      break;
    }
    default: {
      break;
    }
  }
};
