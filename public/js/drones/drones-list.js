const table = $('#drones-table').DataTable({
    paging: false,
    searching: false,
    info: false,
    ordering: false,
    processing: true,
    serverSide: true,
    ajax: {
        url: '/api/drones',
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
        {
            data: null,
            render: function (data) {
                // ดึง data.url ที่ส่งมาจาก Service มาใช้ได้เลย!
                return `<a href="${data.url}" target="_blank" class="btn btn-primary btn-sm">
                        <i class="bi bi-eye"></i> ดูภาพจากโดรน
                    </a>`;
            },
        },
    ],
});

setInterval(() => {
    table.ajax.reload(null, false);
}, 5000);
