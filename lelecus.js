console.log("lelecus.js loaded");

const getCookieMap = () => {
  /*https://stackoverflow.com/questions/4843556/in-http-specification-what-is-the-string-that-separates-cookies/4843598#4843598*/
  const cookieList = document.cookie.split("; ");
  const cookieEntries = cookieList.map((cookie) => cookie.split("="));
  return Object.fromEntries(cookieEntries);
};

const cookies = getCookieMap();
console.log(cookies);
