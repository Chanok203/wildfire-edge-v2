import paho.mqtt.client as mqtt
import time
import random
import json

MQTT_BROKER = "127.0.0.1"
MQTT_PORT = 1883
MQTT_TOPIC = "wind_data"

client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print(f"Failed to connect, return code {rc}")

client.on_connect = on_connect

tic = time.time()
try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()

    print(f"Starting Mock Wind Sensor... Sending data to {MQTT_TOPIC}")

    while True:

        speed = round(random.uniform(0.0, 10.0), 2)
        direction = random.randint(0, 359)

        payload = {
            "id": "mock-wind",
            "speed": speed,
            "direction": direction,
            "ts": int(time.time() - tic),
        }

        msg = json.dumps(payload)

        client.publish(MQTT_TOPIC, msg)
        print(f"publish: {msg}")

        time.sleep(5)

except KeyboardInterrupt:
    print("\nStopping Mock Wind Sensor")
    client.loop_stop()
    client.disconnect()
