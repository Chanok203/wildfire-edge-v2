const socket = window.io();
let lastMessageTime = Date.now();

const autoCheck = document.getElementById('autoWind');
const speedInput = document.getElementById('windSpeed');
const directionInput = document.getElementById('windDirection');
const windTsLabel = document.getElementById('windTs');

const updateInputState = () => {
    if (!autoCheck || !speedInput || !directionInput) return;

    const isAuto = autoCheck.checked;
    speedInput.readOnly = isAuto;
    directionInput.readOnly = isAuto;

    // เพิ่มลูกเล่นเปลี่ยนสีพื้นหลังให้ดูออกว่าโดนล็อค
    if (isAuto) {
        speedInput.classList.add('bg-light');
        directionInput.classList.add('bg-light');
    } else {
        speedInput.classList.remove('bg-light');
        directionInput.classList.remove('bg-light');
        windTs.innerHTML = '';
    }
};

if (autoCheck) {
    autoCheck.addEventListener('change', updateInputState);
}

socket.on('connect', () => {
    console.log(`Connected to Edge (Socket.io)`);
});

socket.on('wind:data:update', (data) => {
    if (autoCheck && autoCheck.checked && !isRunning) {
        if (speedInput) {
            speedInput.value = data.speed.toFixed(2);
        }

        if (directionInput) {
            directionInput.value = data.direction;
        }

        if (windTs) {
            const ts = new Date(data.timestamp).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            windTs.innerHTML = `ล่าสุด: ${ts}`;
        }
    }
});

socket.on('disconnect', () => {
    console.warn('Lost connection to Edge Server');
});

updateInputState();