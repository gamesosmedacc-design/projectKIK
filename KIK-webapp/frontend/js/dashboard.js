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
const wrapper_section = document.querySelector(".right_sheet_container");

const bar_btn = document.getElementById("bar_icon_btn");

bar_btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    right_nav_sheet.showModal();
});

right_nav_sheet.addEventListener("click", () => {
    right_nav_sheet.close();
});

wrapper_section.addEventListener("click", (e)=> {
    e.stopPropagation()
});

const absent_btn = document.getElementById("absent_feature");
absent_btn.addEventListener("click", (e) => {
    e.preventDefault()

    const bottom_sheet = document.getElementById("bottom_sheet");
    bottom_sheet.showModal();
    right_nav_sheet.close();
});

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