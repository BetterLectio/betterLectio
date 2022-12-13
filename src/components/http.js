import { goto } from "$app/navigation";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
  return Array.prototype.map.call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
const customUUID = sha256(JSON.parse(atob(localStorage.getItem("authentication"))).LastLoginUserName);

export async function get(endpoint) {
  // Wait until the user is authenticated
  while (true) {
    try {
      await localStorage.getItem("authentication");
      await window.location.href;
      break;
    } catch (err) {}
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  // If the user is not authenticated, redirect to the auth page
  if (!localStorage.getItem("authentication")) {
    console.log("No cookie, redirecting to auth page");
    window.location.href = "/auth";
  }

  // Fetch the data from the API
  const response = await fetch(`https://better-lectio-flask-backend.vercel.app${endpoint}`, {
    headers: {
      "lectio-cookie": localStorage.getItem("authentication"),
    },
  });

  const textResponse = await response.text();
  // If the response is ok, return the data, otherwise redirect to the auth page
  if (response.ok) {
    return JSON.parse(textResponse.replace("\n", "  "));
  } else {
    const validationCheck = await (
      await fetch(`https://better-lectio-flask-backend.vercel.app/check-cookie`, {
        headers: {
          "lectio-cookie": localStorage.getItem("authentication"),
        },
      })
    ).json();

    if (validationCheck?.valid) {
      console.error(
        `Error fetching data from https://better-lectio-flask-backend.vercel.app${endpoint}`,
        "validationCheck:",
        validationCheck,
        "response:",
        response,
        "textResponse:",
        textResponse
      );
      alert(`Error fetching data from https://better-lectio-flask-backend.vercel.app${endpoint}`);
    } else {
      console.log("Cookie not valid, redirecting to auth page.", "validationCheck:", validationCheck);
      goto("/auth");
    }
  }
}
