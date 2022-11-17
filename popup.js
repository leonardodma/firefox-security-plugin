const getExternalLinks = () => {
  var urls = Array.prototype.map.call(
    document.querySelectorAll("link, img, script, iframe, source, embed"),
    (tag) => {
      return tag.href || tag.src;
    }
  );

  const data = {
    urls: urls,
    length: urls.length,
  };

  return data;
};

browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.method === "localStorage") {
    sendResponse({
      data: Object.entries(localStorage),
    });
  } else if (request.method === "sessionStorage") {
    sendResponse({
      data: Object.entries(sessionStorage),
    });
  } else if (request.method === "thirdPartyDomains") {
    sendResponse({
      data: Object.entries(getExternalLinks()),
    });
  }

  return true;
});
