document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await api_get("/getmyhistory", "GET")
        if (data.success) {
            console.log("u did it")
            const history_data = data.history;
            console.log(history_data)
            const row_data = document.getElementById("container")
            let content = "";

            history_data.forEach(history => {
                let text_color = "";
                if (history.status === "Hadir") {
                    text_color = "lime"
                } else if (history.status === "Sakit") {
                    text_color = "orange";
                } else if (history.status === "Izin") {
                    text_color = "blue";
                } else if (history.status === "Alpa") {
                    text_color = "red";
                } else if (history.status === "Terlambat") {
                    text_color = "yellow"
                }
                content += `
                    <tr>
                        <td>${history.name}</td>
                        <td>${history.date}</td>
                        <td style='color:${text_color}'>${history.status}</td>
                    </tr>
                `
            });
            row_data.innerHTML = content;
            

        } else {
            console.error("error", data.message)
        }
    } catch (error){
        console.error("error", error)
    }
})

const dashboard_btn = document.getElementById("dashboard-page")
dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "dashboard.html";
})
