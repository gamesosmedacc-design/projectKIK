let student_id = ""
let student_status = ""

document.addEventListener("DOMContentLoaded", async () => {
    const data_target = await api_get("/gettargetclass", "GET");
    if (data_target.success) {
        const data_siswa = data_target.list_student;
        const card_wrap = document.getElementById("card-wrap");

        let data_info = "";
        let link_photo = "";
        let pin_color = "";

        data_siswa.forEach(student => {
            const class_name = document.getElementById("class_");
            class_name.textContent = `${student.class_}`;

            if (student.status === "Hadir") {
                pin_color = "lime";
            } else if (student.status === "Sakit" || student.status === "Izin") {
                pin_color = "orange";
            } else if (student.status === "Tidak absen" || student.status === "Alpa" || student.status === "Terlambat") {
                pin_color = "red";
            } else {
                pin_color = "black";
            }

            if (student.status === "Sakit" || student.status === "Izin" || student.status === "Alpa") {
                link_photo = `https://sbydsqahqcgwlczniuhs.supabase.co/storage/v1/object/public/uploads/${student.url}`;
            } else if (student.status === "Tidak absen") {
                link_photo = "assets/img/default-photo.jpeg";
            } else if (student.status === "Hadir" || student.status === "Terlambat") {
                link_photo = `https://sbydsqahqcgwlczniuhs.supabase.co/storage/v1/object/public/uploads/${student.url_present}`;
            } 

            data_info += `
                <div class="cards">
                    <div class="top-card">
                        <div class="information">
                            <a class="name">${student.name} | ${student.NIS}</a>
                            <a class="date">Hari ini</a>
                        </div>
                        <div class="status-wrap">
                            <div class="pin" style="background: ${pin_color};"></div>
                            <a class="status">${student.status}</a>
                            <img src="assets/icon/ellipsis-solid.png" class="more" data-name="${student.name}" data-id="${student.id}" data-status="${student.status}">
                        </div>
                    </div>
                    <div class="photo-wrap">
                        <img class="photo" src="${link_photo}" onclick="window.location.href='${link_photo}'" alt="foto kehadiran">
                    </div>
                </div>
            `;
        });

        card_wrap.innerHTML = data_info;
        
        card_wrap.addEventListener("click", (e) => {
            if (e.target.classList.contains("more")) {
                const student_name = e.target.getAttribute("data-name");
                student_status = e.target.getAttribute("data-status");
                student_id = e.target.getAttribute("data-id");
                const dialog_info = document.getElementById("info-dialog");
                const dialog_edit = document.getElementById("edit-dialog");
                const cancel = document.getElementById("cancel-btn-info");
                const name_student = document.getElementById("name-student");
                const name_edited = document.getElementById("name-edited");
                const status_now = document.getElementById("status-now");
                
                const edit_btn = document.getElementById("edit-ft");
                const detail_btn = document.getElementById("detail-ft");
                
                name_student.textContent = student_name;
                edit_btn.disabled = false;
                
                dialog_info.showModal();
                dialog_info.style.display = "flex";
                
                cancel.addEventListener("click", (e) => {
                    dialog_info.close();
                    dialog_info.style.display = "none";
                });
                
                if (student_status === "Tidak absen") {
                    edit_btn.style.color = "#909090";
                    detail_btn.style.color = "#909090";
                    edit_btn.disabled = true;
                    detail_btn.disabled = true;
                } else if (student_status === "Sakit" || student_status === "Izin" || student_status === "Hadir" || student_status === "Terlambat" || student_status === "Alpa") {
                    edit_btn.style.color = "var(--base)";
                    detail_btn.style.color = "var(--base)";
                    edit_btn.disabled = false;
                    detail_btn.disabled = false;
                } else {
                    console.error("error data status tidak diketahui");
                    alert("error data status tidak diketahui");
                }
                
                edit_btn.addEventListener("click", (e) => {
                    e.preventDefault();

                    const cancel_edit = document.getElementById("cancel-btn-edit");
                    const hadir_opt = document.getElementById("hadir-option");
                    const sakit_opt = document.getElementById("sakit-option");
                    const izin_opt = document.getElementById("izin-option");
                    const alpa_opt = document.getElementById("alpa-option");
                    const terlambat_opt = document.getElementById("terlambat-option");
                    const new_status_input = document.getElementById("new-status");
                    const form = document.getElementById("edit-form");
                    const area_present_to_nfw_or_exc = document.getElementById("area-present-to-nfw-or-exc");
                    
                    hadir_opt.disabled = true;
                    sakit_opt.disabled = true;
                    izin_opt.disabled = true;
                    alpa_opt.disabled = true;
                    terlambat_opt.disabled = true;

                    dialog_edit.showModal();
                    dialog_edit.style.display = "flex";

                    dialog_info.close();
                    dialog_info.style.display = "none";

                    status_now.textContent = student_status;
                    name_edited.textContent = student_name;

                    cancel_edit.addEventListener("click", (e) => {
                        e.preventDefault();

                        dialog_edit.close();
                        dialog_edit.style.display = "none";
                        
                        dialog_info.showModal();
                        dialog_info.style.display = "flex";

                        form.reset();
                        area_present_to_nfw_or_exc.style.display = "none";
                        new_status_input.value = "";
                    });

                    if (student_status === "Hadir") {
                        sakit_opt.disabled = false;
                        izin_opt.disabled = false;
                        terlambat_opt.disabled = false;

                    } else if (student_status === "Sakit") {
                        izin_opt.disabled = false;
                        alpa_opt.disabled = false;

                    } else if (student_status === "Izin") {
                        sakit_opt.disabled = false;
                        alpa_opt.disabled = false;
                        
                    } else if (student_status === "Alpa") {
                        izin_opt.disabled = false
                        sakit_opt.disabled = false
                        
                    } else if (student_status === "Terlambat") {
                        hadir_opt.disabled = false
                    }
                    
                    new_status_input.addEventListener("change", (e) => {
                        e.preventDefault();
                        
                        const selected = e.target.value;
                        if (student_status === "Hadir") {
                            if (selected === "Sakit" || selected === "Izin") {
                                area_present_to_nfw_or_exc.style.display = "flex";
                            } else if (selected === "Terlambat") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else {
                                alert("Format tidak masuk akal")
                            }
                        } else if (student_status === "Sakit") {
                            if (selected === "Izin") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else if (selected === "Alpa") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else {
                                alert("Format tidak masuk akal")
                            }
                        } else if (student_status === "Izin") {
                            if (selected === "Sakit") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else if (selected === "Alpa") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else {
                                alert("Format tidak masuk akal")
                            }
                        } else if (student_status === "Terlambat") {
                            if (selected === "Hadir") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else {
                                alert("Format tidak masuk akal")
                            }
                        } else if (student_status === "Alpa") {
                            if (selected === "Sakit" || selected === "Izin") {
                                area_present_to_nfw_or_exc.style.display = "none";
                            } else {
                                alert("Format tidak masuk akal")
                            }
                        } else {
                            alert("status tidak diketahui")
                        }
                    });
                });
            }
        });
    }
});

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const edit_form = document.getElementById("edit-form");
edit_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const new_status_data = document.getElementById("new-status").value;
    const new_file = document.getElementById("new-file");
    const reason = document.getElementById("reason").value;
    const status_before = student_status
    const description = document.getElementById("description").value;

    let file64 = null;

    if (new_file && new_file.files.length > 0) {
        const file = new_file.files[0]
        file64_name = file.name
        file64 = await convertFileToBase64(file)
    }
    if (status_before === "Hadir") {
        if (new_status_data === "Sakit" || new_status_data === "Izin") {
            if (!reason) {
                alert("Alasan baru belum ada");
                return;
            }
            if (!new_file) {
                alert("File baru belum ada");
                return;
            } 
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else if (new_status_data === "Terlambat") {
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else {
            alert("format tidak masuk akal");
            return;
        }
    } else if (status_before === "Sakit") {
        if (new_status_data === "Izin" || new_status_data === "Alpa") {
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else {
            alert("format tidak masuk akal");
            return;
        }
    } else if (status_before === "Izin") {
        if (new_status_data === "Sakit" || new_status_data === "Alpa") {
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else {
            alert("format tidak masuk akal");
            return;
        }
    } else if (status_before === "Terlambat") {
        if (new_status_data === "Hadir") {
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else {
            alert("format tidak masuk akal");
            return;
        }
    } else if (status_before === "Alpa") {
        if (new_status_data === "Sakit" || new_status_data === "Izin" ) {
            if (!description) {
                alert("Keterangan wajib di isi!");
                return;
            }
        } else {
            alert("format tidak masuk akal");
            return;
        }
    } else {
        alert("Status sebelumnya tidak diketahui atau murid belum absen");
        return;
    }
    
        console.log(file64)
        console.log(description)
        console.log(status_before)
        console.log(reason)
        console.log(student_id)
        console.log(new_status_data)
        
    try {
        const data = await api_requests("/updatethestatus", "POST", {student_id, status_before, new_status_data, file64, reason, description});
        if (data.success) {
            alert("LIKE THE WAY I DOO");
        } else {
            console.error("error", error);
        }
    } catch (error) {
        alert("error", error);
    }
});

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
});

const back_btn = document.getElementById("back-page");
back_btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "statustudent.html";
});