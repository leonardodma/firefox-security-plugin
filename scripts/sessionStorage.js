const getSessionStorage = async (tabs) => {
  let tab = tabs.pop();
  const sessionStorageUlElement = document.getElementById(
    "session-storage-list"
  );

  const response = await browser.tabs.sendMessage(tab.id, {
    method: "sessionStorage",
  });

  const sessionStorageLength = response.data.length;

  if (sessionStorageLength > 0) {
    for (let sessionStorage of response.data) {
      let li = document.createElement("li");
      let content = document.createTextNode(sessionStorage[0]);
      li.appendChild(content);
      sessionStorageUlElement.appendChild(li);
    }
  } else {
    let li = document.createElement("li");
    let content = document.createTextNode(
      "There is no session storage on this page"
    );
    li.appendChild(content);
    sessionStorageUlElement.appendChild(li);
  }

  // Fill the progress bar
  var progressBarElement = document.getElementById(
    "session-storage-progress-bar"
  );

  if (sessionStorageLength >= 100) {
    progressBarElement.setAttribute("value", "100");
  } else {
    progressBarElement.setAttribute("value", sessionStorageLength.toString());
  }
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(getSessionStorage);
