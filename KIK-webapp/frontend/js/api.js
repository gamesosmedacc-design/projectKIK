const url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
? "http://127.0.0.1:5000"
: "https://projectkik-production.up.railway.app";

async function api_requests(endpoint, method, data) {
    try {
        const response = await fetch(`${url}${endpoint}`, {
            method: method,
            headers: { "content-type": "application/json", "bypass-tunnel-reminder": "true"},
            credentials : "include",
            body: data ? JSON.stringify(data): null
        });
        return await response.json();
        
    } catch (error) {
        console.error("Error", error);
        return { success : false, message : "connection failed"}
    };
}

async function api_get(endpoint, method) {
    try {
        const response = await fetch(`${url}${endpoint}`, {
            method : method,
            headers : { "content-type": "application/json"},
            credentials : "include"
        });
        return await response.json();

    } catch (error) {
        console.error("Error", error);
        return { success : false, message : "connection failed"}
    };
};
