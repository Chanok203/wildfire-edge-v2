import subprocess

import subprocess

HOST = "127.0.0.1"
FILENAME = "DJI_20260204155050_0004_S.MP4"

subprocess.run([
    "ffmpeg",
    "-re",
    "-stream_loop", "-1",
    "-i", FILENAME,

    "-vsync", "passthrough",

    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-tune", "zerolatency",

    "-g", "60",
    "-keyint_min", "60",

    "-b:v", "4M",
    "-maxrate", "4M",
    "-bufsize", "8M",

    "-pix_fmt", "yuv420p",

    "-f", "flv",
    f"rtmp://{HOST}/live/drone_01"
])