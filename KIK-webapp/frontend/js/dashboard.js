const absent_btn = document.getElementById("absent_page_btn");
const achievement_btn = document.getElementById("achievement-btn");
const status_student_btn = document.getElementById("siswa_page_btn");
const update_btn = document.getElementById("update_page_btn");
const history_btn = document.getElementById("history_page_btn");
const settings_btn = document.getElementById("settings-btn");
const logout_btn = document.getElementById("logout-btn");
const point_btn = document.getElementById("point-btn");
const announcement_box = document.getElementById("announcement");
const attendance_log = document.getElementById("attendance_log");
const teacher_feature = document.getElementById("teacher-additional");
const student_feature = document.getElementById("additional");
const system_setting = document.getElementById("system-setting");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await api_get("/dashboard", "GET");
        if (data.success) {
        } else {
            alert("kamu gagal ke dashboard kembali ke halaman login");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error", error);
        window.location.href = "login.html";
    }

    try {
        const data_absen = await api_get("/getmyattendance", "GET");
        if (data_absen.success) {            
            const status = data_absen.data_absen.status;
            if (status === "Sakit") {
                announcement_box.textContent = "Get Well Soon ya!";
            } else if (status === "Hadir") {
                announcement_box.textContent = "Sip sudah absen!";
            } else if (status === "Izin") {
                announcement_box.textContent = "Oke sudah absen!";
            } else if (status === "Terlambat") {
                announcement_box.textContent = "Next jangan telat Ya!"
            } else if (status === "Alpa") {
                announcement_box.textContent = "Next lebih tepat waktu"
            }

            
        } else {
            announcement_box.textContent = "absen dulu yukk?";
            announcement_box.style.background = "var(--detail2)";
            announcement_box.style.borderColor = "red"
        }
        
        if (data_absen.message === "weekend") {
            announcement_box.textContent = "Hari ini libur";
            announcement_box.style.background = "var(--detail)";
            announcement_box.style.borderColor = "green"
        }

    } catch (error) {
        console.error("error", error)
    }
})

async function my_name() {
    try {
        const data = await api_get("/me", "GET");

        if (data.success) {
        const user = data.data;
        const name = user.name;
        const role = user.role;
        const class_ = user.class_;
        const subject = user.subject;
        const summary = user.summary;

        document.getElementById("hadir-count").textContent = summary["Hadir"] || 0;
        document.getElementById("sakit-count").textContent = summary["Sakit"] || 0;
        document.getElementById("izin-count").textContent = summary["Izin"] || 0;

        document.getElementById("greetings").textContent = name;
        document.getElementById("name").textContent = name;

        if(class_) {
            document.getElementById("class_").textContent = class_;
        }

        if(subject) {
            document.getElementById("class_").textContent = subject;
        }

        if (role === "Guru") {
            status_student_btn.style.display = "flex";
            absent_btn.style.display = "none";
            history_btn.style.display = "none";
            announcement_box.style.display = "none";
            attendance_log.style.display = "none";
            teacher_feature.style.display = "flex";
            student_feature.style.display = "none";
            system_setting.style.display = "none";
        }
        
        if (role === "Murid") {
            status_student_btn.style.display = "none";
            absent_btn.style.display = "flex";
            history_btn.style.display = "flex";
            announcement_box.style.display = "flex";
            attendance_log.style.display = "flex";
            teacher_feature.style.display = "none";
            student_feature.style.display = "flex";
            system_setting.style.display = "none";
        }
        
        if (role === "admin") {
            status_student_btn.style.display = "flex";
            absent_btn.style.display = "flex";
            history_btn.style.display = "flex";
            announcement_box.style.display = "flex";
            attendance_log.style.display = "flex";
            teacher_feature.style.display = "flex";
            student_feature.style.display = "flex";
            teacher_feature.style.flexDirection = "row";
            status_student_btn.style.width = "120px";
            update_btn.style.width = "120px";
            system_setting.style.display = "flex";
        }

        } else {
        console.error('Error', data.message)
        }
    } catch (error) {
        console.error("Error", error);
    }
};

async function myattendance() {
    try {
        const data = await api_get("/getmyattendance", "GET");
        if (data.success) {
        } else {
            console.error('Error', data.message)
        }
    } catch (error) {
        console.error("Error", error)
    }
}

my_name();
myattendance();

absent_btn.addEventListener("click", (ex) => {
    ex.preventDefault();

    window.location.href = "absent.html";
});

status_student_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    window.location.href = "statustudent.html";
})

history_btn.addEventListener("click", () => {
    window.location.href = "history.html";
})

system_setting.addEventListener("click", (e)=>{
    e.preventDefault()

    alert("hahahaha");
    window.location.href = "systemsetting.html"
})

logout_btn.addEventListener("click", async (ea) => {
    ea.preventDefault();
    try {
        const data = await api_get("/logout", "GET")
        if (data.success) {
            alert(data.message)
            window.location.href = "login.html"
        }
    } catch (error) {
        console.error("error", error)
    }
}) 