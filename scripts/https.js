const getHttps = (tabs) => {
  // Get the active tab
  let tab = tabs.pop();

  var hasHttps = false;

  // Check if tab has http or https
  if (tab.url.includes("https://")) {
    hasHttps = true;
  } else {
    hasHttps = false;
  }

  // Get the UL element from document
  var hasHttpsH3Element = document.getElementById("https-id");
  if (hasHttps) {
    let content = document.createTextNode("YES");
    hasHttpsH3Element.appendChild(content);
  } else {
    let content = document.createTextNode("NO");
    hasHttpsH3Element.appendChild(content);
  }
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(getHttps);
