
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await api_get("/dashboard", "GET");
        if (data.success) {
        } else {
            alert("sesi telah berakhir kembali ke halaman login");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error", error);
        window.location.href = "login.html";
    }
})
const absen_btn = document.getElementById("absen-page");
absen_btn.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "absent.html";
})

