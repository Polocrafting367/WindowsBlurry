const windowElement = document.getElementById('window');
const titleBar = windowElement.querySelector('.title-bar');
const closeBtn = document.getElementById('closeBtn');
const body = document.body;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;
    titleBar.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    titleBar.style.cursor = 'grab';
});

closeBtn.addEventListener('click', () => {
    windowElement.style.display = 'none';
});

// Theme adaptation
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (prefersDarkScheme.matches) {
    body.classList.add('dark-mode');
}

prefersDarkScheme.addEventListener('change', (e) => {
    if (e.matches) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
});
