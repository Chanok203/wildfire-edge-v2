const socket = window.io();

socket.on('connect', () => {
    console.log(`Connected to Edge (Socket.io)`);
});

socket.on('disconnect', () => {
    console.warn(`Lost connection to Edge`);
});

socket.on('wind:update', (data) => {
    const lastestDiv = document.getElementById('latestWind');
    lastestDiv.innerHTML = JSON.stringify(data);
});
