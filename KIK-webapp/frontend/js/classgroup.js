document.addEventListener("DOMContentLoaded", async () => {
    const data_target = await api_get("/gettargetclass", "GET");
    if (data_target.success) {
        const data_siswa = data_target.list_student
        const card_wrap = document.getElementById("card-wrap");

        let data_info = "";
        let link_photo = "";

        let pin_color = "";
        data_siswa.forEach(student => {

            const class_name = document.getElementById("class_");
            class_name.textContent = `${student.class_}`

            if (student.status === "hadir") {
                pin_color = "lime";
            }
            if (student.status === "Sakit" || student.status === "Izin") {
                pin_color = "orange";
            }
            if (student.status === "Tidak absen" || student.status === "Alpa" || student.status === "Terlambat") {
                pin_color = "red";
            } else {
                pin_color = "black";
            }
            if (student.status === "Sakit" || student.status === "Hadir" || student.status === "Izin" || student.status === "Terlambat" || student.status === "Alpa") {
                check_link = "(CEK FOTO)";
                link_photo = `https://sbydsqahqcgwlczniuhs.supabase.co/storage/v1/object/public/uploads/${student.url}`;

            } else if (student.status === "Tidak absen") {
                link_photo = "assets/img/default-photo.jpeg"
            }

            data_info += `
                <div class="cards">
                    <div class="top-card">
                        <div class="information">
                            <a class="name">${student.name} | ${student.NIS}</a>
                                <a class="date">Hari ini</a>
                        </div>
                        <div class="status-wrap">
                            <div class="pin" style="background: ${pin_color};"></div>
                            <a class="status">${student.status}</a>
                            <img src="assets/icon/ellipsis-solid.png" class="more more-btn">
                        </div>
                    </div>
                    <div class="photo-wrap">
                        <img class="photo" src="${link_photo}" alt="foto kehadiran">
                    </div>
                </div>
            `
        });        
        card_wrap.innerHTML = data_info;
    }
})


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

const back_btn = document.getElementById("back-page");
back_btn.addEventListener("click", (e) => {
    e.preventDefault()

    window.location.href = "statustudent.html";
})