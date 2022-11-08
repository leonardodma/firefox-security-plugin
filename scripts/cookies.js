const getCookies = (tabs) => {
  // Get the active tab
  let tab = tabs.pop();

  // Get the cookies for the active tab
  let countCookies = 0;
  var getAllCookies = browser.cookies.getAll({
    url: tab.url,
  });

  getAllCookies.then((cookies) => {
    // Get the UL element from document
    var cookiesUlElement = document.getElementById("cookie-list");

    // Put the cookies in the UL element if there are any
    if (cookies.length > 0) {
      for (let cookie of cookies) {
        // for each cookie create a LI element and append increment the count
        let li = document.createElement("li");
        let content = document.createTextNode(
          cookie.name + ": " + cookie.value
        );
        li.appendChild(content);
        cookiesUlElement.appendChild(li);
        countCookies++;
      }
    } else {
      // If there are no cookies, display a message
      let li = document.createElement("li");
      let content = document.createTextNode(
        "There are no cookies on this page"
      );
      li.appendChild(content);
      cookiesUlElement.appendChild(li);
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
