const getLocalStorage = async (tabs) => {
  let tab = tabs.pop();
  const localStorageUlElement = document.getElementById("local-storage-list");

  const response = await browser.tabs.sendMessage(tab.id, {
    method: "localStorage",
  });
  const localStorageLength = response.data.length;

  if (localStorageLength > 0) {
    for (let localStorage of response.data) {
      let li = document.createElement("li");
      let content = document.createTextNode(localStorage[0]);
      li.appendChild(content);
      localStorageUlElement.appendChild(li);
    }
  } else {
    let li = document.createElement("li");
    let content = document.createTextNode(
      "There is no local storage on this page"
    );
    li.appendChild(content);
    localStorageUlElement.appendChild(li);
  }

  // Fill the progress bar
  var progressBarElement = document.getElementById(
    "local-storage-progress-bar"
  );

  if (localStorageLength >= 100) {
    progressBarElement.setAttribute("value", "100");
  } else {
    progressBarElement.setAttribute("value", localStorageLength.toString());
  }
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(getLocalStorage);
