export const storage = {
  get: (name, cb) => {
    chrome.storage.sync.get([name], (result) => {
      cb(result[name]);
    });
  },
  set: (name, value, cb) => {
    chrome.storage.sync.set(
      {
        [name]: value,
      },
      () => {
        if (cb) cb();
      }
    );
  },
};
