$('#windHistoryTable').DataTable({
    processing: true,
    serverSide: true,
    language: {
        search: 'ค้นหา',
        searchPlaceholder: 'ชื่อไฟล์',
        info: 'แสดง _START_ ถึง _END_ จากทั้งหมด _TOTAL_',
        infoEmpty: 'ไม่พบข้อมูล',
    },
    ajax: {
        url: '/api/wind/history',
        type: 'POST',
    },
    order: [[0, 'desc']],
    columns: [
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
        {
            data: 'name',
        },
        {
            data: 'size',
        },
        {
            data: null,
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
                return `
                        <div class="d-flex flex-row gap-3 align-items-center">
                            <form action="/wind/csv-history/download/${data.name}" method="POST">
                                <button type="submit" class="btn btn-primary">ดาวน์โหลด</button>
                            </form>
                            <form action="/wind/csv-history/delete/${data.name}" onsubmit="return confirm('คุณแน่ใจแล้วใช่ไหมว่าต้องการลบ ${data.name}?')" method="POST">
                                <button type="submit" class="btn btn-danger">ลบ</button>
                            </form>
                        </div>
                        `;
            },
        },
    ],
});
