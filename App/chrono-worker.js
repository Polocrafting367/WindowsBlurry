// chrono-worker.js
let timerInterval;

self.addEventListener('message', function (event) {
    if (event.data === 'start') {
        timerInterval = setInterval(function () {
            // Votre logique de mise à jour du chrono
            self.postMessage('update');
        }, 1000);
    } else if (event.data === 'stop') {
        clearInterval(timerInterval);
    }
});
