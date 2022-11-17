const getScore = () => {
  const cookiesScore = document.getElementById("cookies-progress-bar").value;
  const localStorageScore = document.getElementById(
    "local-storage-progress-bar"
  ).value;
  const sessionStorageScore = document.getElementById(
    "session-storage-progress-bar"
  ).value;
  const thirdPartyDomainsScore = document.getElementById(
    "third-party-domains-progress-bar"
  ).value;

  var overall =
    parseInt(cookiesScore) +
    parseInt(localStorageScore) +
    parseInt(sessionStorageScore) +
    parseInt(thirdPartyDomainsScore);

  overall = overall / 4;

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
