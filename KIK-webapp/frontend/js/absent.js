const note_file_excused = document.getElementById("file-note-excused");
const file_name_excused = document.getElementById('file-name-excused');
const note_file_nfw = document.getElementById("file-note-nfw");
const file_name_nfw = document.getElementById('file-name-nfw');
const dashboard_btn = document.getElementById("dashboard-page");
const canvas = document.getElementById("canvas");
const video = document.getElementById("cam");
const require_page_link_nfw = document.getElementById("required-link-nfw");
const require_page_link_excused = document.getElementById("required-link-excused");
const items = document.querySelectorAll(".items")
const c1 = document.getElementById("c1")
const c2 = document.getElementById("c2")
const c3 = document.getElementById("c3")

const measure_from_center_1 = document.getElementById("diff-meter-first");
const measure_from_center_2 = document.getElementById("diff-meter-second");
const measure_from_center_3 = document.getElementById("diff-meter-third");

const school_latitude_1 = -2.764299224673945 
const school_longitude_1 = 115.26435624985308

const school_latitude_2 = -2.7636306947603866
const school_longitude_2 = 115.26379405844274

const school_latitude_3 = -2.7630683719681604
const school_longitude_3 = 115.2630044434663

const dialog_after = document.getElementById("dialog-after-absent");
const main_container = document.getElementById("main-container");
const dialog_weekend = document.getElementById("dialog-weekend");

let user_latitude;
let user_longitude;
let file_in_base64;

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

function active_value_content() {
    const active_value = document.querySelector(".items.active");
    if (active_value) {
        console.log(active_value.textContent);
    }
}

let stream;
const constraints = {
    video: {
        facingMode: 'user',
    }
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}

navigator.geolocation.watchPosition(
    async(position) => {
        user_latitude = position.coords.latitude;
        user_longitude = position.coords.longitude;
        console.log(user_latitude);
        console.log(user_longitude);
        
        const user_to_first_center_at_lap_hijau = haversine(user_latitude, user_longitude, school_latitude_1, school_longitude_1)
        const user_to_second_center_at_aula = haversine(user_latitude, user_longitude, school_latitude_2, school_longitude_2)
        const user_to_third_center_at_belakang = haversine(user_latitude, user_longitude, school_latitude_3, school_longitude_3)
        console.log(user_to_first_center_at_lap_hijau)

        const minimum_diff = 60;

        measure_from_center_1.textContent = Math.round(user_to_first_center_at_lap_hijau);
        measure_from_center_2.textContent = Math.round(user_to_second_center_at_aula);
        measure_from_center_3.textContent = Math.round(user_to_third_center_at_belakang);

        if (user_to_first_center_at_lap_hijau > minimum_diff) {
            c1.style.backgroundColor = "red";
        } else {
            c1.style.backgroundColor = "green";
        }
        if (user_to_second_center_at_aula > minimum_diff) {
            c2.style.backgroundColor = "red";
        } else {
            c2.style.backgroundColor = "green";
        }
        if (user_to_third_center_at_belakang > minimum_diff) {
            c3.style.backgroundColor = "red";
        } else {
            c3.style.backgroundColor = "green";
        }
    })

navigator.mediaDevices.getUserMedia(constraints)
.then((videostream) => {
    
    stream = videostream;
    document.getElementById("cam").srcObject = stream;
})

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data_absen = await api_get("/getmyattendance");
        if (data_absen.success) {
            alert("kamu sudah absen hari ini TERIMA KASIH!!")
            dialog_after.style.display = "flex";
            main_container.style.display = "none";
            dialog_weekend.style.display = "none";

        } else if (data_absen.message === "weekend") {
            dialog_after.style.display = "none";
            dialog_weekend.style.display = "flex";
            main_container.style.display = "none";

        } else {
            dialog_after.style.display = "none";
            dialog_weekend.style.display = "none";
            main_container.style.display = "flex";
            console.error("error", data_absen.message)
        }
    } catch (error) {
        console.error("error", error);
    }
})

document.getElementById("take-photo").addEventListener("click", (e) => {
    e.preventDefault();
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0)
    
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    
    video.style.display = "none";
    canvas.style.display = "flex";
})

items.forEach(item => {
    item.addEventListener("click", () => {
        items.forEach(item => item.classList.remove("active"));
        item.classList.add("active");
        active_value_content();
    })
})

function show_form(target) {
    const forms = document.querySelectorAll(".form");
    forms.forEach(form => {
        form.style.display = "none";
        
    });
    document.getElementById(target).style.display = "flex";
}

dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    alert("kembali ke dashboard...");
    window.location.href = "dashboard.html";
})


note_file_nfw.addEventListener("change", (e) => {
    e.preventDefault();
    
    file_name_nfw.textContent = note_file_nfw.files[0]?.name || "";
})


note_file_excused.addEventListener("change", (e) => {
    e.preventDefault();
    
    file_name_excused.textContent = note_file_excused.files[0]?.name || "";
})

document.getElementById("rephoto-btn").addEventListener("click", () => {
    video.style.display = "flex";
    canvas.style.display = "none";
})

require_page_link_nfw.addEventListener("click", (e)=>{
    e.preventDefault();
    
    alert("ke halaman syarat & ketentuan...");
    window.location.href = "requir.html";
})

require_page_link_excused.addEventListener("click", (e)=>{
    e.preventDefault();

    alert("ke halaman syarat & ketentuan...");
    window.location.href = "requir.html";
})

const submit_btn_present = document.getElementById("submit-btn-present")
submit_btn_present.addEventListener("click", async(e) => {
    e.preventDefault();
    submit_btn_present.disabled = true;

    const data_status = document.querySelector(".items.active").textContent.trim()
    if (data_status === "Hadir") {
        const data_b64_selfie = canvas.toDataURL("image/jpeg", 0.6);
        const data_latitude = user_latitude
        const data_longitude = user_longitude
        try {
            const data = await api_requests("/present", "POST", {data_status, data_b64_selfie, data_latitude, data_longitude})
            if (data.success) {
                alert("kehadiran kamu sudah dicatat");
                dialog_after.style.display = "flex";
                main_container.style.display = "none";
            } else {
                alert(data.message)                }
            } catch (error) {
                alert(error.message)
            } finally {
                submit_btn_present.disabled = false;
            }
        }
    })
    
    const file_to_base64 = document.getElementById("file-note-nfw");
    file_to_base64.addEventListener("change", async () => {
        const file = file_to_base64.files[0];
        if (!file) {
            file_in_base64 = null;
            return
        }    
        const reader = new FileReader();
        
    reader.onload = () => {
        file_in_base64 = reader.result;
    }
    reader.readAsDataURL(file);
})

const submit_nfw = document.getElementById("submit-btn-nfw") ;
submit_nfw.addEventListener("click", async () => {
    const status = document.querySelector(".items.active").textContent.trim();
    const reason = document.getElementById("nfw-reason").value;
    const nfw_file = file_in_base64;
    const data_longitude = user_longitude;
    const data_latitude = user_latitude;
    
    if (reason === "") {
        alert("tuliskan alasanmu")
        return
    } 
    
    if (!nfw_file) {
        alert("kamu belum memasukkan surat sakitmu")
        return
    }
    
    try {
        const nfw_data = await api_requests("/nfworexcattendance", "POST", {status, reason, nfw_file, data_longitude, data_latitude});
        if (nfw_data.success) {
            console.log("kamu sudah absen sakit")
            dialog_after.style.display = "flex";
            main_container.style.display = "none";
            dialog_weekend.style.display = "none";
        } else {
            console.error("error", nfw_data.message)
        }
    } catch (error) {
        console.error("error", error)
    }
})

const submit_exc = document.getElementById("submit-btn-exc") ;
submit_exc.addEventListener("click", async () => {
    const status = document.querySelector(".items.active").textContent.trim();
    const reason = document.getElementById("exc-reason").value;
    const exc_file = file_in_base64;
    const data_longitude = user_longitude;
    const data_latitude = user_latitude;
    
    if (reason === "") {
        alert("tuliskan alasanmu")
        return
    } 
    
    if (!exc_file) {
        alert("kamu belum memasukkan surat izinmu")
        return
    }
    
    try {
        const exc_data = await api_requests("/nfworexcattendance", "POST", {status, reason, exc_file_file, data_longitude, data_latitude});
        if (exc_data.success) {
            console.log("kamu sudah absen izin")
            dialog_after.style.display = "flex";
            main_container.style.display = "none";
            dialog_weekend.style.display = "none";
        } else {
            console.error("error", nfw_data.message)
        }
    } catch (error) {
        console.error("error", error)
    }
})