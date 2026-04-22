const table = $('#hotspot-manager-table').DataTable({
    paging: false,
    searching: false,
    info: false,
    ordering: false,
    processing: true,
    serverSide: true,
    ajax: {
        url: '/api/hotspot-manager',
        type: 'POST',
    },
    columns: [
        {
            data: null,
            render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            },
        },
        { data: 'id' },
        { data: 'start_time' },
        { data: 'remaining_sec' },
        {
            data: null,
            render: function (data) {
                // ดึง data.url ที่ส่งมาจาก Service มาใช้ได้เลย!
                return `
                <div class="d-flex flex-row gap-3">
                    <a href="/hotspot-manager/${data.id}/player" target="_blank" class="btn btn-primary btn-sm">
                        <i class="bi bi-eye"></i> ดู
                    </a>
                    <form action="/hotspot-manager/${data.id}/delete" method="POST" onsubmit="return confirm('คุณแน่ใจใช่หรือไม่ว่าจะลบ? (${data.id})')">
                        <button class="btn btn-danger btn-sm">
                            <i class="bi bi-trash"></i> ปิด
                        </button>
                    </form>
                    <form action="/hotspot-manager/${data.id}/extend-time" method="POST">
                        <button class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-clock"></i> ต่อเวลา
                        </button>
                    </form>
                </div>
                `;
            },
        },
    ],
});

setInterval(() => {
    table.ajax.reload(null, false);
}, 5000);
