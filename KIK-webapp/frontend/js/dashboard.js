document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await api_get("/dashboard", "GET");
        if (data.success) {
            alert("kamu berhasil ke dashboard");
        } else {
            alert("kamu gagal ke dashboard kembali ke halaman login");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error", error);
        window.location.href = "login.html";
        alert("server deactive");
    }
})

async function my_name() {
    try {
        const data = await api_get("/me", "GET");

        if (data.success) {
        const user = data.data;
        const name = user.name;
        const class_ = user.class_;
        const subject = user.subject;

        document.getElementById("greetings").textContent = name;
        document.getElementById("name").textContent = name;
        document.getElementById("class_").textContent = class_;
        document.getElementById("class_").textContent = subject;

        
        } else {
        alert("sepertinya ada suatu masalah");
        console.error('Error', data.message)
        }
    } catch (error) {
        console.error("Error", error);
    }
};

my_name();


const right_nav_sheet = document.getElementById("right_nav_sheet");
const wrapper_section = document.getElementById("right_sheet_container");

const bar_btn = document.getElementById("bar_icon_btn");

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

const absent_btn = document.getElementById("absent_page_btn");
absent_btn.addEventListener("click", (ex) => {
    ex.preventDefault();

    alert("masih dalam tahap development sabar ya...");
});

const achievement_btn = document.getElementById("achievement-btn");
achievement_btn.addEventListener("click", (ea) => {
    ea.preventDefault();
    
    alert("masih dalam tahap development sabar ya...");
})
const point_btn = document.getElementById("point-btn");
point_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})
const history_btn = document.getElementById("history-btn");
history_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})
const settings_btn = document.getElementById("settings-btn");
settings_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})
const logout_btn = document.getElementById("logout-btn");
logout_btn.addEventListener("click", (ea) => {
    ea.preventDefault();

    alert("masih dalam tahap development sabar ya...");
})


const submit_btn = document.getElementById("submit_absent");
submit_btn.addEventListener("click", (ev) => {
    ev.preventDefault()

    const data_status = document.querySelector("input[name=status]:checked")?.value;
    const comment = document.getElementById("comment_status").value;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const user_latitude = position.coords.latitude;
            const user_longitude = position.coords.longitude;
            console.log(user_latitude);
            console.log(user_longitude);
            try {
                const data = await api_requests("/absent", "POST", {data_status, comment, user_latitude, user_longitude});
                if (data.success) {
                    // popup_absent.showModal()
                    alert("your attendance logged");
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert(error.message)
            }
            
        }, (error) => {
            console.log("we cant get your current position", error.message);
        }
    );
});