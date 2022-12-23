export async function cookieInfo() {
  if (!localStorage.getItem("authentication")) {
    console.log("Redirect");
    window.location.href = "/auth";
  } else {
    let decodedCookie = atob(localStorage.getItem("authentication"));
    let cookie = JSON.parse(decodedCookie);
    let userDict = {
      user: '',
      school: '',
      userid: '',
    }
    cookie.forEach(_cookie => {
      if (_cookie.name == "LastLoginUserName") {
        userDict.user = _cookie.value
      } else if (_cookie.name == "LastLoginExamno") {
        userDict.school = _cookie.value
      } else if (_cookie.name == "LastLoginElevId") {
        userDict.userid = _cookie.value
      }
    });
    console.log(userDict);
    return userDict;
  }
}