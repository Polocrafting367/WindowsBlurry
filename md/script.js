// --- WINDOW MANAGEMENT ---

const windowOffsets = new WeakMap();

function makeWindowDraggable(windowElement, windowHeaderElement) {
    if (!windowElement || !windowHeaderElement) return;

    if (!windowOffsets.has(windowElement)) {
        windowOffsets.set(windowElement, { x: 0, y: 0 });
    }

    let isDragging = false;
    let initialX, initialY;

    const dragStart = (e) => {
        const offsets = windowOffsets.get(windowElement);
        const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

        initialX = clientX - offsets.x;
        initialY = clientY - offsets.y;

        // Check if the target is the header or within the header
        if (e.target === windowHeaderElement || windowHeaderElement.contains(e.target)) {
            // BUT NOT buttons inside the header
            if (e.target.closest('.close')) return;

            isDragging = true;
            raiseWindow(windowElement);
        }
    };

    const dragEnd = () => {
        isDragging = false;
    };

    const drag = (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

        const currentX = clientX - initialX;
        const currentY = clientY - initialY;

        windowOffsets.set(windowElement, { x: currentX, y: currentY });
        windowElement.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    };

    windowHeaderElement.addEventListener("mousedown", dragStart);
    windowHeaderElement.addEventListener("touchstart", dragStart, { passive: false });
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("touchend", dragEnd);
    window.addEventListener("mousemove", drag);
    window.addEventListener("touchmove", drag, { passive: false });
}

function raiseWindow(windowEl) {
    let highestZIndex = 0;
    const windows = document.querySelectorAll('.window, .window2, .windowsett, .bggene');
    windows.forEach(w => {
        const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
        if (z > highestZIndex) highestZIndex = z;
    });
    windowEl.style.zIndex = highestZIndex + 1;
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Window 4 (Welcome)
    const win4 = document.getElementById("window4");
    if (win4) makeWindowDraggable(win4, win4.querySelector('.windowsett-top'));

    // Window 1 (Projects)
    const win1 = document.getElementById("window1");
    if (win1) makeWindowDraggable(win1, win1.querySelector('.window-header'));

    // Window 5 (Paint)
    const win5 = document.getElementById("window5");
    if (win5) makeWindowDraggable(win5, win5.querySelector('.bggene-top'));

    // Window 3 (Pointeuse)
    const win3 = document.getElementById("window3");
    if (win3) makeWindowDraggable(win3, win3.querySelector('.window2-header'));

    // Global Click-to-Raise
    document.querySelectorAll('.window, .window2, .windowsett, .bggene').forEach(w => {
        w.addEventListener('mousedown', () => raiseWindow(w));
        w.addEventListener('touchstart', () => raiseWindow(w));
    });
});

// --- WINDOWS ACTIONS ---

function closesett() {
    const sett = document.getElementById("window4");
    if (!sett) return;
    sett.style.display = "none";
    setTimeout(() => { sett.style.display = "block"; }, 500);
}

function closeWindow1() {
    const win = document.getElementById("window1");
    if (!win) return;
    win.style.display = "none";
    setTimeout(() => { win.style.display = "block"; }, 500);
}

function closeBG() {
    // Re-open/Redirect as per legacy behavior
    window.location.href = '/MasterPaint/';
}

function NewWIN() {
    const div = document.getElementById("window1");
    if (!div) return;
    const clone = div.cloneNode(true);
    clone.classList.add("window-cloned");
    
    // Position slightly offset based on current clones
    const clonesCount = document.querySelectorAll('.window-cloned').length;
    const offset = 20 * clonesCount;
    windowOffsets.set(clone, { x: offset, y: offset });
    clone.style.transform = `translate3d(${offset}px, ${offset}px, 0)`;

    const header = clone.querySelector('.window-header');
    makeWindowDraggable(clone, header);

    clone.querySelector('.close').addEventListener('click', () => {
        clone.remove();
        setTimeout(NewWIN, 500);
    });

    document.body.appendChild(clone);
    clone.style.display = "block";
    raiseWindow(clone);
}

function NewWIN2() {
    // This is the "Ouvrir" button for Pointeuse
    window.location.href = 'BD';
}

// --- UTILS ---

function changeBlur(value) {
    const targets = [
        '.window-header', '.window-content', 
        '.window2-header', '.window2-content',
        '.windowsett-top', '.windowsett-content',
        '.bggene-top', '.bggene-content',
        '.menu', '.rectangle'
    ];
    
    targets.forEach(selector => {
        const factor = selector.includes('content') ? 5 : 1;
        document.querySelectorAll(selector).forEach(el => {
            el.style.backdropFilter = `blur(${value * factor}px)`;
        });
    });
}

function trackVisit(pageName = "Accueil") {
    let deviceId = localStorage.getItem('app_device_id') || ('dev-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now());
    localStorage.setItem('app_device_id', deviceId);

    fetch('/track.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, page: pageName })
    }).catch(() => {});
}

