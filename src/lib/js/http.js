import { goto } from "$app/navigation";

// async function sha256(str) {
//   const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
//   return Array.prototype.map.call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2)).join("");
// }

// const customUUID = sha256(
//   JSON.parse(Buffer.from(localStorage.getItem("authentication"), "base64").toString("ascii"))
//     .LastLoginUserName
// );

export const api = (window.electron) ? "http://localhost:5000" : "https://api.betterlectio.dk"

export function reloadData(reload = true) {
  localStorage.setItem("nonce", Date.now().toString(36));
  if (reload) {
    window.location.reload();
  }
}

export async function get(endpoint) {
  // Wait until the user is authenticated
  while (true) {
    try {
      await localStorage.getItem("lectio-cookie");
      await window.location.href;
      break;
    } catch (err) {}
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  // If the user is not authenticated, redirect to the auth page
  if (!localStorage.getItem("lectio-cookie") || localStorage.getItem("lectio-cookie") == "null") {
    console.log("No cookie, redirecting to auth page");
    const transformedLink = window.location.href.split("/")[3].replace("/", "%3").replace("?", "%3F").replace("=", "%3d").replace(`"`, "%22")
    window.location.href = "/auth?redirect=" + transformedLink;
  }

  let nonce = localStorage.getItem("nonce");
  if (nonce == null) {
    reloadData(false);
    nonce = localStorage.getItem("nonce");
  }

  // Fetch the data from the API
  let url = api + endpoint;
  if (url.indexOf("?") > -1) {
    url += "&nonce=" + nonce;
  } else {
    url += "?nonce=" + nonce;
  }
  let start = performance.now();
  const response = await fetch(url, {
    headers: {
      "lectio-cookie": localStorage.getItem("lectio-cookie"),
    },
  });
  let stop = performance.now();

  const textResponse = await response.text();
  if (response.ok) {
    // If the response is ok, return the data, otherwise redirect to the auth page
    if (stop - start > 100) {
      // Dette gøres for at tjekke om responset er cached. Vi skal finde en bedre måde at gøre det på. Et eksempel kunne være https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize da transferSize er lig med 0 hvis den er cached men det er ikke understøttet på safari
      let lectioCookie = await response.headers.get("set-lectio-cookie");
      if (lectioCookie && lectioCookie != "null") {
        localStorage.setItem("lectio-cookie", lectioCookie);
      }
    }
    return JSON.parse(textResponse.replace("\n", "  "));
  } else {
    const validationCheck = await (
      await fetch(api + `/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
      })
    ).json();

    if (validationCheck?.valid) {
      let lectioCookie = await validationCheck.headers.get("set-lectio-cookie");
      if (lectioCookie && lectioCookie != "null") {
        localStorage.setItem("lectio-cookie", lectioCookie);
      }
      console.error(
        `Error fetching data from ${api}${endpoint}`,
        "validationCheck:",
        validationCheck,
        "response:",
        response,
        "textResponse:",
        textResponse
      );
      addNotification(`Error fetching data from ${api}${endpoint}`, "alert-error");
    } else {
      console.log("Cookie not valid, redirecting to auth page.", "validationCheck:", validationCheck);
      const transformedLink = window.location.href.split("/")[3].replace("/", "%3").replace("?", "%3F").replace("=", "%3d").replace(`"`, "%22")
      window.location.href = "/auth?redirect=" + transformedLink;
    }
  }
}
