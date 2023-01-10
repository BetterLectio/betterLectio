export async function cookieInfo() {
  if (
    !localStorage.getItem("lectio-cookie") &&
    window.location.href.split("?")[0].split("/").at(-1) != "auth" &&
    window.location.href.split("?")[0].split("/").at(-1) != ""
  ) {
    console.log("Redirect");
    window.location.href = "/auth";
  } else {
    let decodedCookie = atob(localStorage.getItem("lectio-cookie"));
    let cookie = JSON.parse(decodedCookie);
    let userDict = {
      user: "",
      school: "",
      userid: "",
    };
    cookie.forEach((_cookie) => {
      if (_cookie.name == "LastLoginUserName") {
        userDict.user = _cookie.value;
      } else if (_cookie.name == "LastLoginExamno") {
        userDict.school = _cookie.value;
      } else if (_cookie.name == "LastLoginElevId") {
        userDict.userid = _cookie.value;
      }
    });
    return userDict;
  }
}
