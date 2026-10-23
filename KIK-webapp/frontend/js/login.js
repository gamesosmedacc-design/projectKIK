// VARIABELS =======================================================================
const button_sign_in = document.querySelector(".sign_in_btn");
const password_box = document.querySelectorAll("#password_box");

const password = document.getElementById("password");
const username = document.getElementById("username");

const register_box = document.getElementById("register_box");
const login_box = document.getElementById("login_box");
const class_box = document.getElementById("class_");
const subject_box = document.getElementById("subject_teach"); 

const call_name = document.getElementById("call_name");
const create_username = document.getElementById("create_username");
const create_password = document.getElementById("create_password");
const Nis = document.getElementById("create_nis");
const class_ = document.getElementById("class_");

const num_regex = /[0-9]/;
const char_regex = /[a-zA-Z]/;
const class_num_regex = /^(X|XI|XII)$/i;
const major_regex = /^(TP|TKJ|TKR|TKP|ALDP|ATPH|DPIB)$/
const symbol_regex = /[^a-zA-Z0-9]/
const roles = document.querySelectorAll(".roles")

let class_value = class_.value.trim();
let call_name_value = "";
let subject_value = "";
let create_password_value = "";
let create_username_value = "";
let nis_value = "";

const pw_note = document.getElementById("pw-note");
const usn_note = document.getElementById("usn-note");
const nis_note = document.getElementById("nis-note");
const nip_note = document.getElementById("nip-note");
const subject_note = document.getElementById("mapel-note");
const class_note = document.getElementById("class-note");
const call_note = document.getElementById("call-note");

let is_valid_username = true;
let is_valid_pw = true;
let is_nis_valid = true;
let is_subject_valid = true;
let is_class_valid = true;
let is_call_valid = true;
// VARIABELS =======================================================================

roles.forEach(role => {
    role.addEventListener("click", () => {
        roles.forEach(role => role.classList.remove("active"));
        role.classList.add("active");
        if (role.textContent === "Murid") {
            class_box.style.display = "flex";
            subject_box.style.display = "none";

            class_note.style.display = "flex";
            subject_note.style.display = "none";
            
            nis_note.textContent = "";
            Nis.value = "";
            
            Nis.style.borderColor = "var(--accents)";
            
            nis_note.style.display = "none";
            nip_note.style.display = "none";
        }
        if (role.textContent === "Guru") {
            class_box.style.display = "none";
            subject_box.style.display = "flex";
            
            class_note.style.display = "none";
            subject_note.style.display = "flex";
            
            nip_note.textContent = "";
            Nis.value = "";
            
            Nis.style.borderColor = "var(--accents)";
            
            nis_note.style.display = "none";
            nip_note.style.display = "none";
        }
    })
})


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

    console.log(username_value)
    console.log(password_value)
    
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

create_username.addEventListener("input", (e)=> {
    e.preventDefault()
    
    is_valid_username = true;
    create_username_value = e.target.value
    
    if (create_username_value.length > 50) {
        is_valid_username = false;
        usn_note.style.display = "flex";
        usn_note.textContent = "• username harus kurang dari 50 karakter";
    }
    
    if (is_valid_username){
        create_username.style.borderColor = "lime";
        usn_note.style.display = "none";
    } else {
        create_username.style.borderColor = "red";
    }
})

create_password.addEventListener("input", (e)=> {
    e.preventDefault();
    create_password_value = e.target.value
    is_valid_pw = true;
    
    if (create_password_value.length !== 8 ) {
        is_valid_pw = false;
        pw_note.style.display = "flex";
        pw_note.textContent = "• pw minimal & maximal 8 karakter";
    }
    
    if (!num_regex.test(create_password_value)) {
        is_valid_pw = false
        pw_note.style.display = "flex";
        pw_note.textContent = "• pw harus di isi dengan angka dan huruf";
    }
    
    if (!char_regex.test(create_password_value)) {
        is_valid_pw = false
        pw_note.style.display = "flex";
        pw_note.textContent = "• pw harus di isi dengan angka dan huruf";
    }
    
    if (is_valid_pw) {
        pw_note.style.display = "none";
        create_password.style.borderColor = "lime";
    } else {
        create_password.style.borderColor = "red";
    }
})

Nis.addEventListener("input", (e) => {
    e.preventDefault();
    
    const role_value = document.querySelector(".roles.active").textContent;
    nis_value = e.target.value.trim();
    is_nis_valid = true;
    
    if (role_value === "Guru") {
        if (nis_value.length !== 18) {
            is_nis_valid = false;
            nip_note.style.display = "flex";
            nip_note.textContent = "• NIP harus 18 karakter";
        } 
        if (!num_regex.test(nis_value)) {
            is_nis_valid = false;
            nip_note.style.display = "flex";
            nip_note.textContent = "• NIP harus angka";
        }
    }
    
    if (role_value === "Murid") {
        if (nis_value.length !== 4) {
            is_nis_valid = false;
            nis_note.style.display = "flex";
            nis_note.textContent = "• NIS harus 4 karakter";
        } 
        if (!num_regex.test(nis_value)) {
            is_nis_valid = false;
            nis_note.style.display = "flex";
            nis_note.textContent = "• NIS harus angka";
        }
    }
    
    if (is_nis_valid) {
        Nis.style.borderColor = "lime";
        nis_note.style.display = "none";
        nip_note.style.display = "none";
    } else {
        Nis.style.borderColor = "red";
    }
});

subject_box.addEventListener("input", (e)=>{
    e.preventDefault()
    
    subject_value = e.target.value
    const role_value = document.querySelector(".roles.active").textContent;
    is_subject_valid = true;
    
    
    if (role_value === "Guru") {
        if (num_regex.test(subject_value)) {
            is_subject_valid = false
            subject_note.textContent = "• mata pelajaran umumnya tidak bertuliskan dengan angka";
        }
        
        if (subject_value === "") {
            is_subject_valid = false
            subject_note.textContent = "• mata pelajaran harus di isi";
        }
    }
    
    if (is_subject_valid) {
        subject_note.style.display  = "none";
        subject_box.style.borderColor = "lime";
        subject_note.style.display = "none";
    } else {
        subject_box.style.borderColor = "red";
        subject_note.style.display = "flex";
    }
})


class_box.addEventListener("input", (e)=>{
    e.preventDefault()
    
    class_value = String(e.target.value).toUpperCase()
    is_class_valid = true;
    
    const role_value = document.querySelector(".roles.active").textContent;
    
    const index_class = class_value.split(/\s+/);
    
    if (role_value === "Murid") {
        if (index_class.length < 2) {
            is_class_valid = false
            class_note.textContent = "• format kelas harus <kelas> <jurusan>";
            class_note.style.display = "flex";
        }
        
        if (!class_num_regex.test(index_class[0])) {
            is_class_valid = false
            class_note.textContent = "• kelas tidak valid gunakan (X, XI, XII)";
            class_note.style.display = "flex";
        } 
        
        if (!major_regex.test(index_class[1])) {
            is_class_valid = false
            class_note.textContent = "• jurusan tidak valid gunakan (TP, TKJ, TKR, TKP, ALDP, ATPH, DPIB)";
            class_note.style.display = "flex";
        }
    }
    
    if (is_class_valid) {
        class_note.style.display  = "none";
        class_.style.borderColor = "lime";
    } else {
        class_.style.borderColor = "red";
    }
})

call_name.addEventListener("input", (e)=> {
    e.preventDefault();
    
    call_name_value = e.target.value;
    is_call_valid = true;
    
    if (call_name_value.trim() === "") {
        is_call_valid = false
        call_note.textContent = "nama panggilan harus di isi";
        call_note.style.display = "flex";
    }
    if (call_name_value.length > 10) {
        is_call_valid = false
        call_note.textContent = "nama panggilan terlalu panjang max 10 karakter";
        call_note.style.display = "flex";
    }
    
    if (is_call_valid) {
        call_name.style.borderColor = "lime";
        call_note.style.display = "none";
    } else {
        call_name.style.borderColor = "red";
    }
})

document.getElementById("register_box").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const role_value = document.querySelector(".roles.active").textContent;
    
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

    if (create_password_value.length !== 8) {
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
    if (call_name_value === "") {
        alert("nama panggilan harus di isi");
        return;
    }

    if (call_name_value.split(/\s+/).length > 1) {
        alert("nama panggilan harus berisikan satu kata");
        return;
    }
    
    // class =============================================================
    if (role_value === "Guru"){
        if (subject_value === "") {
            alert("Masukkan Proli atau Mapel bapak ibu sekalian");
            return;
        }

        if (num_regex.test(subject_value)) {
            alert("Mata Pelajaran atau Proli tidak boleh menggunakan angka");
            return;
        }

        if (nis_value === "") {
            alert("NIP tidak boleh kosong")
            return
        }

        if (nis_value.length !== 18) {
            alert("NIP harus berisikan 18 angka")
            return
        }
    }
    
    if (role_value === "Murid"){
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
        if (nis_value === "") {
            alert("NIS tidak boleh kosong")
            return
        }
    
        if (nis_value.length !== 4) {
            alert("NIS harus berisikan 4 angka")
            return
        }
    }

    const payload = {
        data_username: create_username_value,
        data_password: create_password_value,
        data_nis: nis_value,
        data_role: role_value,
        data_call_name: call_name_value,
        data_subject: subject_value,
        data_class: class_value
    };

    const data = await api_requests("/sign_up", "POST", payload)
    if (data.success){
        alert(data.message)
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }

});