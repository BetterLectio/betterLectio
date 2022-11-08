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
    let url;
    if (endpoint.includes("=")){
        url = `https://better-lectio-flask-backend.vercel.app${endpoint}&cookie=${localStorage.getItem("authentication")}`;
    } else {
        url = `https://better-lectio-flask-backend.vercel.app${endpoint}?cookie=${localStorage.getItem("authentication")}`;
    }
    const response = await fetch(url);
    const textResponse = await response.text();
    if (await textResponse.includes("500")) {
        console.log("Failed")
        window.location.href = "/auth";
    } else {
        return JSON.parse(textResponse.replace("\n", "  "))
    }
}