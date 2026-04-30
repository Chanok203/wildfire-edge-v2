const videoIframe = document.getElementById('videoIframe');
const offlineOverlay = document.getElementById('offlineOverlay');
const liveIndicator = document.getElementById('liveIndicator');

let isOffline = false;

async function checkDroneStatus() {
    try {
        const response = await fetch('/api/drones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ draw: 1, start: 0, length: 100 }),
        });

        const json = await response.json();

        const droneIsReady = json.data.some((drone) => drone.id === DRONE_ID);

        if (droneIsReady) {
            if (isOffline) setOnline();
        } else {
            if (!isOffline) setOffline();
        }
    } catch (error) {
        setOffline();
    }
}

function setOffline() {
    isOffline = true;

    offlineOverlay.classList.remove('d-none');
    offlineOverlay.classList.add('d-flex');

    liveIndicator.classList.replace('bg-danger', 'bg-secondary');
    liveIndicator.innerHTML = '● OFFLINE';

    console.log(`Drone ${DRONE_ID} is now offline.`);
}

function setOnline() {
    isOffline = false;

    offlineOverlay.classList.replace('d-flex', 'd-none');

    liveIndicator.classList.replace('bg-secondary', 'bg-danger');
    liveIndicator.innerHTML = '● LIVE';

    videoIframe.src = VIDEO_SRC + '?t=' + new Date().getTime();
    console.log(`Drone ${DRONE_ID} is back online!`);
}

const statusInterval = setInterval(checkDroneStatus, 5000);

window.onbeforeunload = function () {
    clearInterval(statusInterval);
};
