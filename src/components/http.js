export async function get(endpoint) {
    while (true) {
        try {
            await localStorage.getItem("authentication")
            await window.location.href
            break
        } catch (err) {
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const response = await fetch(`https://better-lectio-flask-backend.vercel.app${endpoint}&cookie=${localStorage.getItem("authentication")}`);
    const textResponse = await response.text();
    if (await textResponse.includes("500")) {
        console.log("Failed")
            window.location.href = "/auth";
    } else {
        return JSON.parse(textResponse.replace("\n", "  "))
    }
}