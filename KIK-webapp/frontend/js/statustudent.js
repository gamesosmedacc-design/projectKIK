document.addEventListener("DOMContentLoaded", async () => {
    // alert("dalam tahap pengembangan");
    const data = await api_get("/wheremyclass", "GET")

    if(data.success) {
        const groups = data.groups_class;
        const cards = document.getElementById("cards-container");
        const classes = {}
        
        groups.forEach(group => {
            if (!classes[group.class]) {
                classes[group.class] = [];
            }
            
            classes[group.class].push(group)
        });
        let card_content ="";
        for (const class_ in classes) {
            card_content += `
            <div class="cards">
                <img src="assets/icon/users-solid (1).png">
                <p class="target">${class_}</p>
            </div>`
        }

        cards.innerHTML = card_content;

        cards.addEventListener("click", async (e) => {
            const clicke = e.target.closest(".cards")

            if (!clicke) return;

            const cardes = cards.querySelectorAll(".cards")
            cardes.forEach(card => {
                card.classList.remove("active");
            });

            clicke.classList.add("active")

            const target = clicke.querySelector(".target").textContent;
            const data_target = await api_requests("/sendtargetclass", "POST", {target})
            if (data_target.success) {
                alert("ok data terkirim")
                window.location.href = "classgroup.html";
            } else {
                alert(data_target.message)
            }
        })
    };
})

const dashboard_btn = document.getElementById("dashboard-page")
dashboard_btn.addEventListener("click", (e) => {
    e.preventDefault();

    alert("kembali ke dashboard...");
    widow.location.href = "dashboard.html";
})
