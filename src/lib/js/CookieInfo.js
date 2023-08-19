export async function cookieInfo() {
  if (
    !localStorage.getItem("lectio-cookie") &&
    window.location.href.split("?")[0].split("/").at(-1) !== "auth" &&
    window.location.href.split("?")[0].split("/").at(-1) !== ""
  ) {
    console.log("Redirect");
    const transformedLink = encodeURIComponent(window.location.href);
    window.location.href = "/auth?redirect=" + transformedLink;
  } else {
    try {
      const cookie = localStorage.getItem("lectio-cookie");
      if (cookie === null) return false;

      const parsedCookie = JSON.parse(window.atob(cookie, "base64"));
      const userDict = {
        user: "",
        school: "",
        userid: "",
      };
      parsedCookie.forEach((_cookie) => {
        if (_cookie.name == "LastLoginUserName") {
          userDict.user = _cookie.value;
        } else if (_cookie.name == "LastLoginExamno") {
          userDict.school = _cookie.value;
        } else if (_cookie.name == "LastLoginElevId") {
          userDict.userid = _cookie.value;
        }
      });
      return userDict;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
