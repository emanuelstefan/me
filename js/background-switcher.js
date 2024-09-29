const images = [
    'img/backgrounds/1.webp',
    'img/backgrounds/2.webp',
    'img/backgrounds/3.webp',
    'img/backgrounds/4.webp',
    'img/backgrounds/5.webp'
];

let currentIndex = 0;

function changeBackground() {
    currentIndex = (currentIndex + 1) % images.length;
    document.body.style.backgroundImage = `url(${images[currentIndex]})`;
}

setInterval(changeBackground, 10000); // 10 seconds