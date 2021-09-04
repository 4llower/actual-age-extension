import * as SimpleSwitch from "a-simple-switch";

import { config } from "./config";
import moment from "moment";
import { updateThemePostMessage } from "./utils";

import { changeTheme, storage } from "../common";

import "a-simple-switch/src/sass/SimpleSwitch.scss";
import "./styles";
import "bootstrap/scss/bootstrap.scss";
import "../common/styles";

export const setupPopup = () => {
  const updateBirthdayPostMessage = () => {
    storage.get("birthday", (birthday) => {
      chrome.runtime.sendMessage(
        {
          type: "UPDATE_BIRTHDAY",
          payload: {
            birthday,
          },
        },
        () => {}
      );
    });
  };

  const updateBirthdayDate = (date) => {
    storage.get("birthdayTime", (birthdayTime) => {
      storage.set("birthdayDate", date);
      if (!birthdayTime)
        storage.set("birthday", date, updateBirthdayPostMessage);
      else
        storage.set(
          "birthday",
          date + " " + birthdayTime,
          updateBirthdayPostMessage
        );
    });
  };

  const updateBirthdayTime = (time) => {
    storage.get("birthdayDate", (birthdayDate) => {
      storage.set("birthdayTime", time);
      if (!birthdayDate)
        storage.set("birthday", time, updateBirthdayPostMessage);
      else
        storage.set(
          "birthday",
          birthdayDate + " " + time,
          updateBirthdayPostMessage
        );
    });
  };

  const setupActualAge = (initialValue) => {
    const birthdayDate = document.getElementById("date");
    const birthdayTime = document.getElementById("time");

    if (initialValue) {
      if (moment(initialValue).format("YYYY-MM-DD") !== config.INVALID_DATE)
        birthdayDate.value = moment(initialValue).format("YYYY-MM-DD");
      if (moment(initialValue).format("HH:mm") !== config.INVALID_DATE) {
        birthdayTime.value = moment(initialValue).format("HH:mm");
      }
    }

    birthdayDate.addEventListener("change", (event) => {
      updateBirthdayDate(moment(event.target.value).format("YYYY-MM-DD"));
    });
    birthdayTime.addEventListener("change", (event) => {
      updateBirthdayTime(event.target.value);
    });
  };

  const restoreActualAge = () => {
    storage.get("birthday", setupActualAge);
    SimpleSwitch.init();

    // const phrase = document.getElementById('phrase')
    // const loader = document.getElementById('loader')
    const dark = document.getElementById("dark");
    const light = document.getElementById("light");
    const switcher = document.getElementById("theme-switch");
    const shadowSwitcher = document.getElementsByClassName(
      "_simple-switch-track"
    )[0];

    let currentTheme = "light";

    storage.get("theme", (theme) => {
      changeTheme(theme);
      currentTheme = theme;
      switcher.checked = theme === "light";
      if (theme === "light") shadowSwitcher.classList.add("on");
    });

    switcher.addEventListener("change", (event) => {
      if (event.target.checked) {
        currentTheme = "light";
        light.classList.remove("hidden");
        dark.classList.add("hidden");
      } else {
        currentTheme = "dark";
        dark.classList.remove("hidden");
        light.classList.add("hidden");
      }
      changeTheme(currentTheme);
      storage.set("theme", currentTheme);
      updateThemePostMessage();
    });

    // const hideLoader = () => {
    //   loader.style.display = 'none'
    // }

    // setTimeout(
    //   () =>
    //     fetch(config.PHRASE_API_URL)
    //       .then(async (r) => {
    //         const { quotes } = await r.json()
    //         hideLoader()
    //         phrase.innerText = quotes.length
    //           ? quotes[0].text
    //           : config.DEFAULT_PHRASE
    //       })
    //       .catch(() => {
    //         hideLoader()
    //         phrase.innerText = config.DEFAULT_PHRASE
    //       }),
    //   200
    // )
  };

  document.addEventListener("DOMContentLoaded", restoreActualAge);
};

setupPopup();
