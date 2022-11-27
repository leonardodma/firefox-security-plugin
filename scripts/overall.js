const getScore = () => {
  const cookiesScore = document.getElementById("cookies-progress-bar").value;
  const localStorageScore = document.getElementById(
    "local-storage-progress-bar"
  ).value;
  const thirdPartyDomainsScore = document.getElementById(
    "third-party-domains-progress-bar"
  ).value;
  const hasHttps = document.getElementById("https-id").textContent;

  if (hasHttps == "YES") {
    var overall =
      parseInt(cookiesScore) * 0.3 +
      parseInt(localStorageScore) * 0.6 +
      parseInt(thirdPartyDomainsScore) * 0.1;
  } else {
    var overall = 100;
  }

  overall = overall.toFixed(2);

  const overallElement = document.getElementById("overall-progress-bar");
  const overallQtd = document.getElementById("overall-qtd");
  overallElement.setAttribute("value", overall.toString());
  overallQtd.innerHTML = "Overall: " + overall.toString() + "% dangerous";
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

setTimeout(() => {
  getActiveTab().then(getScore);
}, 100);
