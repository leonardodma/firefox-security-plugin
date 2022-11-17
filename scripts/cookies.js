const getCookies = (tabs) => {
  // Get the active tab
  let tab = tabs.pop();
  let tabDomain = tab.url.split("/")[2];

  // Get the cookies for the active tab
  let countCookies = 0;
  var getAllCookies = browser.cookies.getAll({
    url: tab.url,
  });

  getAllCookies.then((cookies) => {
    countCookies = cookies.length;
    // Get the UL element from document
    var externalCookiesUlElement = document.getElementById(
      "external-cookie-list"
    );

    var internalCookiesUlElement = document.getElementById(
      "internal-cookie-list"
    );

    var cookiesQtdH3Element = document.getElementById("cookies-qtd");

    // Put the cookies in the UL element if there are any
    if (cookies.length > 0) {
      let content = document.createTextNode(
        "There are " + countCookies + " cookies on this page"
      );
      cookiesQtdH3Element.appendChild(content);

      for (let cookie of cookies) {
        // for each cookie create a LI element and append increment the count
        let li = document.createElement("li");
        let content = "";

        if (cookie.session) {
          content = document.createTextNode("SESSION: " + cookie.name);
        } else {
          content = document.createTextNode("NAVIGATION: " + cookie.name);
        }

        li.appendChild(content);

        if (
          cookie.domain == tabDomain ||
          cookie.domain == "." + tabDomain ||
          cookie.domain == "www." + tabDomain ||
          cookie.domain == "www" + tabDomain ||
          "www." + cookie.domain == tabDomain ||
          "www" + cookie.domain == tabDomain ||
          "." + cookie.domain == tabDomain
        ) {
          internalCookiesUlElement.appendChild(li);
        } else {
          externalCookiesUlElement.appendChild(li);
        }
      }
    }

    // Fill the progress bar
    var progressBarElement = document.getElementById("cookies-progress-bar");

    if (countCookies >= 100) {
      progressBarElement.setAttribute("value", "100");
    } else {
      progressBarElement.setAttribute("value", countCookies.toString());
    }
  });
};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(getCookies);
