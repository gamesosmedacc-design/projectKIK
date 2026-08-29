const login_box = document.getElementById("login_box");
const sign_in_text = document.querySelector(".sign_in_text");
const button_sign_in = document.querySelector(".sign_in_btn");


const password_box = document.querySelectorAll("#password_box");
password_box.forEach(icon => {
    const input = icon.querySelector("input");
    const solid_eye = icon.querySelector(".solid_eye");
    const slash_eye = icon.querySelector(".slash_eye");
    
    solid_eye.addEventListener("click", () => {
        input.type = "text";
        solid_eye.style.display = "none";
        slash_eye.style.display = "flex";
    });
    
    slash_eye.addEventListener("click", () => {
        input.type = "password";
        solid_eye.style.display = "flex";
        slash_eye.style.display = "none";
    });
});

document.getElementById("login_box").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    if (password.length < 8) {
        alert("password must contain 8 character");
        return;
    }

    if (username.trim() === "") {
        alert("username cannot empty");
        return;
    }

    const data = await api_requests("/sign_in", "POST", {password, username});
    if (data.success) {
        window.location.href="dashboard.html";
    } else {
        alert(data.message);
    }
});