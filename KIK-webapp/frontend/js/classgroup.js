document.addEventListener("DOMContentLoaded", async () => {
    const data_target = await api_get("/gettargetclass", "GET");
    if (data_target.success) {
        const data_siswa = data_target.list_student
        const table_row = document.getElementById("container")
        let students = "";
        data_siswa.forEach(student => {
            students += `
                <tr>
                    <td class="name">${student.name}</td>
                    <td class="class_">${student.class_}</td>
                    <td class="NIS">${student.NIS}</td>
                    <td class="status">${student.status}</td>
                    </tr>
            `;
        });        
        table_row.innerHTML = students;
    }
})

const dashboard_btn = document.getElementById("dashboard-page")
dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();

    alert("kembali ke dashboard...");
    window.location.href = "dashboard.html";
})

const back_btn = document.getElementById("back-page");
back_btn.addEventListener("click", (e) => {
    e.preventDefault()

    alert("kembali ke halaman status siswa");
    window.location.href = "statustudent.html"
})