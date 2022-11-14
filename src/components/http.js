export async function get(endpoint) {
    while (true) {
        try {
            await localStorage.getItem("authentication")
            await window.location.href
            break
        } catch (err) {
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    if (localStorage.getItem("authentication") == null) {
        console.log("Redirect")
        window.location.href = "/auth";
    }
    const response = await fetch(`https://better-lectio-flask-backend.vercel.app${endpoint}`, {headers: {
        'lectio-cookie': localStorage.getItem("authentication"),
      }});
    const textResponse = await response.text();
    if (response.ok) {
        return JSON.parse(textResponse.replace("\n", "  "))
    } else {
        console.log("Failed")
        window.location.href = "/auth";
    }
}