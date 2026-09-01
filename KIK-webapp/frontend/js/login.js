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
        alert("password harus berisi minimal 8 karakter");
        return;
    }
    
    if (username.trim() === "") {
        alert("nama pengguna tidak boleh kosong");
        return;
    }
    
    const data = await api_requests("/sign_in", "POST", {password, username});
    if (data.success) {
        window.location.href="dashboard.html";
    } else {
        alert(data.message);
    }
});

document.getElementById("register_link").addEventListener("click", (e)=> {
    e.preventDefault();
    
    const register_box = document.getElementById("register_box");
    const login_box = document.getElementById("login_box");
    login_box.style.display = "none";
    register_box.style.display = "flex";
});

document.getElementById("login_link").addEventListener("click", (e)=> {
    e.preventDefault();

    const register_box = document.getElementById("register_box");
    const login_box = document.getElementById("login_box");
    login_box.style.display = "flex";
    register_box.style.display = "none";
});

document.getElementById("register_box").addEventListener("submit", async function (e) {
    e.preventDefault();

    const create_username = document.getElementById("create_username").value;
    const create_password = document.getElementById("create_password").value;
    const Nis = document.getElementById("create_nis").value;
    const class_ = document.getElementById("class_").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("number").value;
    const role = document.getElementById("role").value;

    const num_regex = /[0-9]/;
    const char_regex = /[a-zA-Z]/;

    // username ==========================================================
    if (create_username === "") {
        alert("nama pengguna kamu belum ada");
        return;
    }

    if (create_username.length > 50) {
        alert("username kamu terlalu panjang (tidak boleh lebih dari 50)");
        return;
    }

    // password ==========================================================
    if (create_password === "") {        
        alert("password kamu belum ada");
        return;
    }

    if (create_password.length < 8) {
        alert("password harus berisi minimal 8 karakter");
        return;
    }

    if (!num_regex.test(create_password)) {
        alert("kombinasi password terbaik adalah angka + huruf");
        return;
    }

    if (!char_regex.test(create_password)) {
        alert("kombinasi password terbaik adalah angka + huruf");
        return;
    }

    // nis ===============================================================
    if (Nis === "") {
        alert("Nis kamu belum ada");
        return;
    }

    if (char_regex.test(Nis)) {
        alert("kamu yakin itu nis kamu?");
        return;
    }

    // class =============================================================
    if (class_ === "") {
        alert("kelas kamu belum ada");
        return;
    }

    const index_class = class_.trim().split(/\s+/);
    const class_num_regex = /^(X|XI|XII|10|11|12)$/i;
    const major_regex = /^(TP|TKJ|TKR|TKP|ALDP|ATPH|DPIB)$/

    if (index_class.length < 2) {
        alert("formatnya harus <kelas> <jurusan>");
        return;
    }

    if (!class_num_regex.test(index_class[0])) {
        alert("kelas tidak valid gunakan (X, XI, XII, 10, 11, 12)");
        return;
    }

    if (!major_regex.test(index_class[1])) {
        alert("jurusan tidak valid gunakan (TP, TKJ, TKR, TKP, ALDP, ATPH, DPIB)");
        return;
    }

    // email =============================================================
    if (email === "") {
        alert("email kamu belum ada");
        return;
    }

    if (!email.endsWith("@gmail.com")) {
        alert("email harus diakhiri dengan @gmail.com");
        return;
    }

    // phone number =======================================================
    const symbol_regex = /[^a-zA-Z0-9]/
    
    if (phone_number.length < 12) {
        alert("nomor hp kamu tidak valid");
        return;
    }

    if (char_regex.test(phone_number)) {
        alert("nomer hp tidak boleh ada hurufnya");
        return;
    }

    if (symbol_regex.test(phone_number)) {
        alert("nomor hp tidak boleh mengandung simbol");
        return;
    }

    // role ==============================================================
    if (role === "teacher") {
        alert("kamu adalah guru");
        return;
    }

    if (role === "student") {
        alert("kamu adalah murid");
        return;
    }
});