const greetings = [
    'Hello',
    'Halo',
    'こんにちは',
    '你好',
    'Salut',
    'Hallo',
    'Olá',
    'Kumusta',
    'Bonjour',
    'مرحبا',
    'Xin chào',
    'Ciao',
    'Sawubona',
    'Aloha',
    'Merhaba',
    'Hej',
    'Hoi',
    'Szia',
    'Terve',
    'Hujambo'
];

const greetingElement = document.getElementById('greeting');
let index = 0;

function updateGreeting() {
    greetingElement.textContent = greetings[index];
    index = (index + 1) % greetings.length;
}

updateGreeting();
setInterval(updateGreeting, 550);

document.getElementById("button_continue").addEventListener("click", function() {
    window.location.href="frontend/login.html"; //memindahkan browser ke halaman lain
});