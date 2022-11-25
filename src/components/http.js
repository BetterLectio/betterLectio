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
  if (localStorage.getItem("authentication") == null) {
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
    window.location.href = "/auth";
  }
}
