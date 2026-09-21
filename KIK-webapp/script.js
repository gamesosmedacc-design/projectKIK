const greetings = [
    "Selamat datang",
    "Welcome",
    "Velkommen",
    "Bienvenido",
    "Bienvenue",
    "Willkommen",
    "Benvenuto",
    "Bem-vindo",
    "Welkom",
    "Välkommen",
    "Velkommen",
    "Tervetuloa",
    "Velkomin",
    "Fáilte",
    "Добро пожаловать",
    "Ласкаво просимо",
    "Καλώς ήρθατε",
    "Hoş geldiniz",
    "أهلاً وسهلاً",
    "ברוכים הבאים",
    "स्वागत है",
    "স্বাগতম",
    "خوش آمدید",
    "欢迎",
    "ようこそ",
    "환영합니다",
    "ยินดีต้อนรับ",
    "Chào mừng",
    "Maligayang pagdating",
    "Selamat datang",
    "خوش آمدید",
    "स्वागत छ",
    "Vitajte",
    "Üdvözöljük",
    "Bine ați venit"
];

const greetingElement = document.getElementById('greeting');
let index = 0;

function updateGreeting() {
    greetingElement.textContent = greetings[index];
    index = (index + 1) % greetings.length;
}

updateGreeting();
setInterval(updateGreeting, 600);

document.getElementById("button_continue").addEventListener("click", function() {
    window.location.href="frontend/login.html"; //memindahkan browser ke halaman lain
});