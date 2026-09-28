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
        console.log(classes)
        for (const class_ in classes) {
            cards.innerHTML += `
                <div class="cards">
                    <img src="assets/icon/users-solid (1).png" alt="">
                    <p>${class_}</p>
                </div>
            `
        }
    }
})

document.getElementById("dashboard-page").addEventListener("click", (e) => {
    e.preventDefault();

    alert("kembali ke dashboard...");
    window.location.href = "dashboard.html";
})
