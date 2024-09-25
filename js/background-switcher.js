const images = [
    'img/backgrounds/1.jpg',
    'img/backgrounds/2.jpg',
    'img/backgrounds/3.jpg',
    'img/backgrounds/4.jpg',
    'img/backgrounds/5.jpg'
];

let currentIndex = 0;

function changeBackground() {
    currentIndex = (currentIndex + 1) % images.length;
    document.body.style.backgroundImage = `url(${images[currentIndex]})`;
}

setInterval(changeBackground, 10000); // 10 seconds