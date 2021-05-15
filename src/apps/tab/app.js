'use strict';

import './styles';

(function() {
  function setTime() {
    const time = "228";

    document.getElementById('clock').innerHTML = time;
  }

  function setDay() {
    const day = "228";

    document.getElementById('day').innerHTML = day;
  }

  function setupDashboard() {
    setDay();
    setTime();
    setInterval(setTime, 1000);
  }

  setupDashboard();

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Ove. I am from Override app.',
      },
    },
    response => {
      console.log(response.message);
    }
  );
})();
