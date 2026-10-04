document.addEventListener("DOMContentLoaded", async () => {
    // try {
    //     const data = await api_get("/dashboard", "GET");
    //     if (data.success) {
    //     } else {
    //         alert("sesi telah berakhir kembali ke halaman login");
    //         window.location.href = "login.html";
    //     }
    // } catch (error) {
    //     console.error("Error", error);
    //     window.location.href = "login.html";
    // }

    try {
        const data_point = await api_get("/getmypoint", "GET");
        if (data_point.success){
            console.log("berhasil");
            const main_box = document.getElementById("main-box");
            const message = document.getElementById("message-by-count-point")
            const count = document.getElementById("point-count")

            // const total_point = data_point.total_point;
            const total_point = 0;
            console.log(total_point)
            if (total_point <= 0) {
                main_box.style.borderColor = "lime";
                count.textContent = total_point;
                count.style.color = "lime";
                count.style.borderColor = "lime";
                message.textContent = "Kamu berada di zona teladan";
            } else if (total_point <= 50) {
                main_box.style.borderColor = "yellow";
                count.textContent = total_point;
                count.style.color = "yellow";
                count.style.borderColor = "yellow";
                message.textContent = "Kamu berada di zona beresiko";
            } else {
                main_box.style.borderColor = "red";
                count.textContent = total_point;
                count.style.color = "red";
                count.style.borderColor = "red";
                message.textContent = "Kamu berada di zona beresiko";
            }
        } else {
            console.error("error", data_point.message)
        }
    } catch (error) {
        console.error("error", error)
    }
})

