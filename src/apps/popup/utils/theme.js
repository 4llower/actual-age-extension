import { storage } from "../../common";

export const updateThemePostMessage = () => {
  storage.get("theme", (theme) => {
    chrome.runtime.sendMessage(
      {
        type: "UPDATE_THEME",
        payload: {
          theme,
        },
      },
      () => {}
    );
  });
};
