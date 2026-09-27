const absen_btn = document.getElementById("absen-page");
absen_btn.addEventListener("click", (e) => {
    e.preventDefault();

    alert("kembali ke halaman absen...");
    window.location.href = "absent.html";
})