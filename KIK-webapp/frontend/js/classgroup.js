document.addEventListener("DOMContentLoaded", async () => {
    const data_target = await api_get("/gettargetclass", "GET");
    if (data_target.success) {
        const data_siswa = data_target.list_student
        const table_row = document.getElementById("container")
        let students = "";
        data_siswa.forEach(student => {
            let row_color = "";
            if (student.total_point <= 0) {
                row_color = 'lime';
            } else if (student.total_point <= 50) {
                row_color = 'yellow';
            } else {
                row_color = 'red'
            }
            students += `
                <tr>
                    <td class="name">${student.name}</td>
                    <td class="class_">${student.class_}</td>
                    <td class="NIS">${student.NIS}</td>
                    <td class="status">${student.status}</td>
                    <td class="total-point" style='color: ${row_color}'; >${student.total_point}</td>
                    </tr>
            `;
        });        
        table_row.innerHTML = students;
    }
})


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await api_get("/dashboard", "GET");
        if (data.success) {
        } else {
            alert("sesi telah berakhir kembali ke halaman login");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error", error);
        window.location.href = "login.html";
    }
})

const dashboard_btn = document.getElementById("dashboard-page")
dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "dashboard.html";
})

const back_btn = document.getElementById("back-page");
back_btn.addEventListener("click", (e) => {
    e.preventDefault()

    alert("kembali ke halaman status siswa");
    window.location.href = "statustudent.html"
})