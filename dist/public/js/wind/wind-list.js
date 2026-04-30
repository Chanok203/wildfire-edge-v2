const socket = window.io();
let lastMessageTime = Date.now();

function updateSensorUI(isOnline) {
    const onlineBadge = document.getElementById('status-online');
    const offlineBadge = document.getElementById('status-offline');

    if (isOnline) {
        onlineBadge.classList.remove('d-none');
        offlineBadge.classList.add('d-none');
    } else {
        onlineBadge.classList.add('d-none');
        offlineBadge.classList.remove('d-none');
    }
}

setInterval(() => {
    const isTimeout = Date.now() - lastMessageTime > 20000;
    if (isTimeout) {
        updateSensorUI(false);
    }
}, 5000);

const table = $('#wind-table').DataTable({
    language: {
        search: 'ค้นหา',
        searchPlaceholder: 'ชื่อเซ็นเซอร์',
        info: 'แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_',
        infoEmpty: 'ไม่พบข้อมูล',
    },
    processing: true,
    serverSide: true,
    ajax: {
        url: '/api/wind',
        type: 'POST',
    },
    order: [[1, 'desc']],
    columns: [
        { data: 'sensorId' },
        {
            data: 'createdAt',
            render: function (data) {
                if (!data) return '-';
                const date = new Date(data);
                return date.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            },
        },
        { data: 'direction' },
        { data: 'speed' },
    ],
});

socket.on('connect', () => {
    console.log(`Connected to Edge (Socket.io)`);
});

socket.on('disconnect', () => {
    console.warn(`Lost connection to Edge`);
});

socket.on('wind:data:update', (data) => {
    lastMessageTime = Date.now();
    const lastestDiv = document.getElementById('last-update-wind');
    const ts = new Date(data.timestamp).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    lastestDiv.innerHTML = `ล่าสุด:: ทิศทาง: ${data.direction} องศา, ความเร็ว ${data.speed} เมตรต่อวินาที, เมื่อ ${ts}`;
    table.ajax.reload(null, false);

    updateSensorUI(true);
});

socket.on('wind:recording:update', (isRecording) => {
    const btn = document.getElementById('btn-toggle-record');
    if (isRecording) {
        btn.className = 'btn btn-danger btn-lg shadow-sm';
        btn.innerHTML = '<i class="bi bi-stop-circle-fill"></i> หยุดการบันทึก';
        btn.setAttribute('onclick', 'handleToggle(false)');
    } else {
        btn.className = 'btn btn-outline-success btn-lg shadow-sm';
        btn.innerHTML =
            '<i class="bi bi-play-circle-fill"></i> เริ่มบันทึกข้อมูล';
        btn.setAttribute('onclick', 'handleToggle(true)');
    }
    btn.disabled = false;
});

async function handleToggle(newState) {
    const btn = document.getElementById('btn-toggle-record');

    btn.disabled = true;
    btn.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> กำลังประมวลผล...';
    try {
        const response = await fetch('/api/wind/recording', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRecording: newState }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert(data.data.message);
        } else if (data.status === 'fail') {
            alert(err.data);
        } else {
            alert(err.message || 'เกิดข้อผิดพลาด');
        }
    } catch (error) {
        console.error('Toggle error:', error);
        btn.disabled = false;
    }
}
