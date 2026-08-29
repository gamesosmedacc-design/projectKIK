async function api_requests(endpoint, method, data) {
    try {
        const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
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