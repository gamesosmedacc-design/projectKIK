const right_nav_sheet = document.getElementById("right_nav_sheet");
const wrapper_section = document.getElementById("right_sheet_container");

const bar_btn = document.getElementById("bar_icon_btn");

const absent_btn = document.getElementById("absent_page_btn");
const achievement_btn = document.getElementById("achievement-btn");
const status_student_btn = document.getElementById("student-status-btn");
const history_btn = document.getElementById("history-btn");
const settings_btn = document.getElementById("settings-btn");
const logout_btn = document.getElementById("logout-btn");
const point_btn = document.getElementById("point-btn");

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
        }

        if (role === "Murid") {
            status_student_btn.style.display = "none";
        }

        
        } else {
        console.error('Error', data.message)
        }
    } catch (error) {
        console.error("Error", error);
    }
};

my_name();


bar_btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    right_nav_sheet.showModal();
});

right_nav_sheet.addEventListener("click", () => {
    right_nav_sheet.close();
});

wrapper_section.addEventListener("click", (e)=> {
    e.stopPropagation();
});

absent_btn.addEventListener("click", (ex) => {
    ex.preventDefault();

    alert("ke halaman absen...");
    window.location.href = "absent.html";
});

achievement_btn.addEventListener("click", (ea) => {
    ea.preventDefault();
    
    alert("masih dalam tahap development sabar ya...");
})
point_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("ke halaman poin...");
    window.location.href = "point.html";
})
status_student_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("ke halaman status siswa");
    window.location.href = "statustudent.html";
})
history_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})
settings_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})
logout_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})