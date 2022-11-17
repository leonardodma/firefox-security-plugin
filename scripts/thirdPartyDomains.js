const setThirdPartyDomains = async (tabs) => {
  let tab = tabs.pop();
  const thirdPartyDomainsH3Element = document.getElementById(
    "third-party-domains-qtd"
  );

  const response = await browser.tabs.sendMessage(tab.id, {
    method: "thirdPartyDomains",
  });

  const numberUrls = response.data[1][1];
  const thirdPartyDomains = response.data[0][1];

  if (numberUrls > 0) {
    let content = document.createTextNode(
      "There are " + numberUrls + " third party domains on this page"
    );
    thirdPartyDomainsH3Element.appendChild(content);
  } else {
    let content = document.createTextNode(
      "There is no third party domains on this page"
    );
    thirdPartyDomainsH3Element.appendChild(content);
  }

  // Update progress bar
  const progressBarElement = document.getElementById(
    "third-party-domains-progress-bar"
  );

  if (numberUrls >= 100) {
    progressBarElement.setAttribute("value", "100");
  } else {
    progressBarElement.setAttribute("value", numberUrls.toString());
  }
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(setThirdPartyDomains);
