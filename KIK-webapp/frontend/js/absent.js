const contraints = {
    video: {
        facingMode: 'user',

    }
}

navigator.mediaDevices.getUserMedia(contraints)
    .then((stream) => {
        document.getElementById("cam").srcObject = stream;
    })

const items = document.querySelectorAll(".items") 
items.forEach(item => {
    item.addEventListener("click", () => {
        items.forEach(item => item.classList.remove("active"));
        item.classList.add("active");
    })
})

function show_form(target) {
    const forms = document.querySelectorAll(".form");
    forms.forEach(form => {
        form.style.display = "none";

    document.getElementById(target).style.display = "flex";
    })
}

const dashboard_btn = document.getElementById("dashboard-page");
dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();

    alert("kembali ke dashboard...");
    window.location.href = "dashboard.html";
})

const note_file = document.getElementById("file-note");
const file_name = document.getElementById('file-name');

note_file.addEventListener("change", (e) => {
    e.preventDefault();

    file_name.textContent = note_file.files[0]?.name || "";
})