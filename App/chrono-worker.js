let timers = {};

self.addEventListener('message', function (event) {
    if (event.data.action === 'start') {
        startTimer(event.data.id);
    } else if (event.data.action === 'stop') {
        stopTimer(event.data.id);
    }
});

function startTimer(id) {
    timers[id] = setInterval(function () {
        self.registration.showNotification(`Chrono ${id}`, {
            body: `Temps écoulé: ${formatTime()}`,
        });
    }, 1000);
}

function stopTimer(id) {
    clearInterval(timers[id]);
    delete timers[id];
}

function formatTime() {
    // Logique pour formater le temps selon vos besoins
    return '00:00:00';
}
