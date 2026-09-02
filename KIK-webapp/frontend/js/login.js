// VARIABELS =======================================================================
const button_sign_in = document.querySelector(".sign_in_btn");
const password_box = document.querySelectorAll("#password_box");

const password = document.getElementById("password");
const username = document.getElementById("username");

const register_box = document.getElementById("register_box");
const login_box = document.getElementById("login_box");

const create_username = document.getElementById("create_username");
const create_password = document.getElementById("create_password");
const Nis = document.getElementById("create_nis");
const class_ = document.getElementById("class_");
const email = document.getElementById("email");
const phone_number = document.getElementById("number");
const role = document.getElementById("role");

const num_regex = /[0-9]/;
const char_regex = /[a-zA-Z]/;
const class_num_regex = /^(X|XI|XII|10|11|12)$/i;
const major_regex = /^(TP|TKJ|TKR|TKP|ALDP|ATPH|DPIB)$/
const symbol_regex = /[^a-zA-Z0-9]/

// VARIABELS =======================================================================

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
    
    const username_value = username.value;
    const password_value = password.value;

    if (password_value.length < 8) {
        alert("password harus berisi minimal 8 karakter");
        return;
    }
    
    if (username_value.trim() === "") {
        alert("nama pengguna tidak boleh kosong");
        return;
    }
    
    const data = await api_requests("/sign_in", "POST", {password_value, username_value});
    if (data.success) {
        window.location.href="dashboard.html";
    } else {
        alert(data.message);
    }
});

document.getElementById("register_link").addEventListener("click", (e)=> {
    e.preventDefault();
    
    login_box.style.display = "none";
    register_box.style.display = "flex";
});

document.getElementById("login_link").addEventListener("click", (e)=> {
    e.preventDefault();

    login_box.style.display = "flex";
    register_box.style.display = "none";
});

document.getElementById("role").addEventListener("change", (e)=>{
    const class_box = document.getElementById("class_");
    const role_value = document.getElementById("role").value;

    if (role_value === "teacher"){
        alert("kamu adalah guru");
        class_box.style.display = "none";
    }

    if (role_value === "student"){
        alert("kamu adalah murid");
        class_box.style.display = "flex";
    }
});

document.getElementById("register_box").addEventListener("submit", async function (e) {
    e.preventDefault();

    let class_value = class_.value.trim();
    const create_password_value = create_password.value;
    const create_username_value = create_username.value;
    const nis_value = Nis.value.trim();
    const email_value = email.value.trim();
    const phone_number_value = phone_number.value.trim();
    const role_value = role.value;

    // username ==========================================================
    if (create_username_value === "") {
        alert("nama pengguna kamu belum ada");
        return;
    }

    if (create_username_value.length > 50) {
        alert("username kamu terlalu panjang (tidak boleh lebih dari 50)");
        return;
    }
    
    // password ==========================================================
    if (create_password_value === "") {        
        alert("password kamu belum ada");
        return;
    }

    if (create_password_value.length < 8) {
        alert("password harus berisi minimal 8 karakter");
        return;
    }

    if (!num_regex.test(create_password_value)) {
        alert("kombinasi password terbaik adalah angka + huruf");
        return;
    }
    
    if (!char_regex.test(create_password_value)) {
        alert("kombinasi password terbaik adalah angka + huruf");
        return;
    }
    
    // nis ===============================================================
    if (nis_value === "") {
        alert("Nis kamu belum ada");
        return;
    }

    if (char_regex.test(nis_value)) {
        alert("kamu yakin itu nis kamu?");
        return;
    }
    
    // class =============================================================
    if (role_value === "teacher"){
        if (class_value == ""){
            class_value = "teacher";
        }
    }
    
    if (role_value === "student"){
        if (class_value === "") {
            alert("kelas kamu belum ada");
            return;
        }

        const index_class = class_value.split(/\s+/);
    
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
    }

    // email =============================================================
    if (email_value === "") {
        alert("email kamu belum ada");
        return;
    }
    
    if (!email_value.endsWith("@gmail.com")) {
        alert("email harus diakhiri dengan @gmail.com");
        return;
    }
    
    // phone number =======================================================
    if (phone_number_value.length < 12) {
        alert("nomor hp kamu tidak valid");
        return;
    }
    
    if (char_regex.test(phone_number_value)) {
        alert("nomer hp tidak boleh ada hurufnya");
        return;
    }
    
    if (symbol_regex.test(phone_number_value)) {
        alert("nomor hp tidak boleh mengandung simbol");
        return;
    }
    

    const payload = {
        data_username: create_username_value,
        data_password: create_password_value,
        data_nis: nis_value,
        data_role: role_value,
        data_class: class_value,
        data_email: email_value,
        data_phone_number: phone_number_value,
    };

    const data = await api_requests("/sign_up", "POST", payload)
    if (data.success){
        alert(data.message)
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }

});