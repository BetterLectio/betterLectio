export const GET = async ( event ) => {
    const start = performance.now();
    const response = await fetch("https://www.lectio.dk/lectio/");
    const end = performance.now();
    
    if (response.ok) {
        if (end-start < 200) {
            return new Response(JSON.stringify({status: "green"}));
        } else {
            return new Response(JSON.stringify({status: "yellow"}));
        }
    } else {
        return new Response(JSON.stringify({status: "red"}));
    }

}