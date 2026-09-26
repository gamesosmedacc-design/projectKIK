const note_file_excused = document.getElementById("file-note-excused");
const file_name_excused = document.getElementById('file-name-excused');
const note_file_nfw = document.getElementById("file-note-nfw");
const file_name_nfw = document.getElementById('file-name-nfw');
const dashboard_btn = document.getElementById("dashboard-page");
const canvas = document.getElementById("canvas");
const video = document.getElementById("cam");
const items = document.querySelectorAll(".items") 

let stream;
const constraints = {
    video: {
        facingMode: 'user',
    }
}

navigator.mediaDevices.getUserMedia(constraints)
    .then((videostream) => {

        stream = videostream;
        document.getElementById("cam").srcObject = stream;
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