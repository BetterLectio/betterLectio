import { goto } from "$app/navigation";

// async function sha256(str) {
//   const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
//   return Array.prototype.map.call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2)).join("");
// }

// const customUUID = sha256(
//   JSON.parse(Buffer.from(localStorage.getItem("authentication"), "base64").toString("ascii"))
//     .LastLoginUserName
// );

export function reloadData(reload=true) {
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
    window.location.href = "/auth";
  }

  let nonce = localStorage.getItem("nonce");
  if (nonce == null) {
    reloadData(false);
    nonce = localStorage.getItem("nonce");
  }

  // Fetch the data from the API
  let url = `https://api.betterlectio.dk${endpoint}`
  if (url.indexOf("?") > -1) {
    url += "&nonce=" + nonce;
  } else {
    url += "?nonce=" + nonce;
  }
  const response = await fetch(url, {
    headers: {
      "lectio-cookie": localStorage.getItem("lectio-cookie")
    },
  });

  const textResponse = await response.text();
  if (JSON.parse(textResponse).backend_error == 'string indices must be integers') {
    localStorage.clear();
    window.location.href = "/auth";
  } else if (response.ok) {// If the response is ok, return the data, otherwise redirect to the auth page
    localStorage.setItem("lectio-cookie", await response.headers.get('set-lectio-cookie'));
    return JSON.parse(textResponse.replace("\n", "  "));
  } else {
    const validationCheck = await (
      await fetch(`https://api.betterlectio.dk/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("lectio-cookie"),
        },
      })
    ).json();

    if (validationCheck?.valid) {
      localStorage.setItem("lectio-cookie", await response.headers.get('set-lectio-cookie'));
      console.error(
        `Error fetching data from https://api.betterlectio.dk${endpoint}`,
        "validationCheck:",
        validationCheck,
        "response:",
        response,
        "textResponse:",
        textResponse
      );
      alert(`Error fetching data from https://api.betterlectio.dk${endpoint}`);
    } else {
      console.log("Cookie not valid, redirecting to auth page.", "validationCheck:", validationCheck);
      goto("/auth");
    }
  }
}
