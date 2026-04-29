const statusProgressMap = {
    PENDING: 0,
    CREATE_INPUT: 0,
    IN_QUEUE: 0,
    PROCESSING: 50,
    COMPLETED: 100,
    FAILED: 100,
    CANCELED: 100,
};

const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress');
const viewResultBtn = document.getElementById('viewResultBtn');
const startBtn = document.getElementById('startBtn');


const trackStatus = async (id, { onStart, onUpdate, onFinished, onError }) => {
    if (onStart) onStart();

    const checkStatus = setInterval(async () => {
        try {
            const response = await axios.get(`/api/forecast/${id}`);
            if (response.data.status !== 'success') {
                throw new Error(`ไม่สามารถตรวจสอบสถานะได้`);
            }

            const { aiStatus, pushStatus } = response.data.data.forecast;

            if (onUpdate) {
                try {
                    onUpdate({ aiStatus, pushStatus });
                } catch (error) {
                    console.error("[UI Update Error]:", uiError);
                }
            }

            if (
                aiStatus === 'COMPLETED' ||
                aiStatus === 'FAILED' ||
                aiStatus === 'CANCELED'
            ) {
                clearInterval(checkStatus);
                if (onFinished) onFinished(response.data.data.forecast);
            }
        } catch (error) {
            console.error(`[Check Status] Error: พบข้อผิดพลาด`);
            clearInterval(checkStatus);
            if (onError) onError(error);
        }
    }, 3000);
    return checkStatus;
};

startBtn.onclick = async () => {
    console.log(`[CAL API] Start Forecast`);
    startBtn.disabled = true;
    startBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            กำลังประมวลผล...
        `;
    try {
        const url = '/api/forecast/create';
        const response = await axios.post(url, inputData);
        if (response.data.status !== 'success') {
            throw new Error(`[Create] Error: เกิดข้อผลพลาด`);
        }
        const forecastId = response.data.data.forecast.id;
        trackStatus(forecastId, {
            onStart: (data) => {
                progressBar.classList.remove('bg-primary');
                progressBar.classList.add('bg-primary');
            },
            onUpdate: (data) => {
                const percentage = statusProgressMap[data.aiStatus] || 0;

                progressBar.style.width = `${percentage}%`;
                progressBar.innerText = `${percentage}% - ${data.aiStatus}`;
                progressContainer.setAttribute('aria-valuenow', percentage);

                if (
                    ['IN_QUEUE', 'PROCESSING', 'COMPLETED'].includes(
                        data.aiStatus,
                    )
                ) {
                    progressBar.classList.add('progress-bar-striped');
                    progressBar.classList.add('progress-bar-animated');
                } else {
                    // ถ้าเสร็จแล้วหรือยังไม่เริ่ม ให้เอาลายทางที่ขยับได้ออก
                    progressBar.classList.remove('progress-bar-striped');
                    progressBar.classList.remove('progress-bar-animated');
                }

                if (data.aiStatus === 'FAILED') {
                    progressBar.classList.remove('bg-primary');
                    progressBar.classList.add('bg-danger'); // เปลี่ยนเป็นสีแดงถ้าพัง
                } else if (data.aiStatus === 'COMPLETED') {
                    progressBar.classList.remove('bg-primary');
                    progressBar.classList.add('bg-success'); // เปลี่ยนเป็นสีเขียวเมื่อเสร็จ
                } else {
                    progressBar.classList.add('progress-bar-animated'); // ให้แถบขยับดุ๊กดิ๊กตอนกำลังทำ
                    progressBar.classList.add('progress-bar-striped');
                }
            },
            onFinished: (data) => {
                setTimeout(() => {
                    startBtn.style.display = 'none';
                    startBtn.onclick = undefined;

                    viewResultBtn.innerHTML = `ดูผลลัพธ์`;
                    viewResultBtn.style.display = 'inline-block';
                    viewResultBtn.onclick = () => {
                        const url = `/forecast/view?forecastId=${data.id}`;
                        window.open(url, '_self');
                    };

                    alert(
                        `ภารกิจ ${data.name} ทำงานสิ้นสุดแล้วด้วยสถานะ: ${data.aiStatus}`,
                    );
                }, 100);
            },
            onError: (data) => {
                alert('เกิดข้อผิดพลาด');
                startBtn.disabled = false;
                startBtn.innerText = 'เริ่มการทำนาย';
            },
        });
    } catch (error) {
        console.error(error);
        alert('เกิดข้อผิดพลาด');
        startBtn.disabled = false;
        startBtn.innerText = 'เริ่มการทำนาย';
    }
};
