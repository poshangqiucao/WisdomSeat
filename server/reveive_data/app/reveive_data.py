import paho.mqtt.client as mqtt
import numpy as np
import time
import json
topic = "/weight/1"
data = []
cv_list = []
have_people = 0
no_people = 0
people_status = False
def on_connect(client, userdata, flags, rc):
    print("Connected with result code: " + str(rc))

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))
    global have_people
    global no_people
    global people_status
    weight = json.loads(msg.payload)["weight"]
    data.append(weight)
    if len(data) == 10:
        cv = np.std(data)/np.mean(data)*10000
        if cv > 5:
            have_people = have_people + 1
            no_people = 0
        else:
            no_people = no_people + 1
            have_people = 0
        if have_people > 3:
            client.publish("/status",True)
            have_people = 0
        if no_people > 3:
            client.publish("/status",False)
            no_people = 0
        data.clear()
def on_subscribe(client, userdata, mid, granted_qos):
    print("subscribe success!")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect('www.cgblogs.top', 1883, 15) # 15为keepalive的时间间隔
client.subscribe(topic, qos=0)
while True:
    #client.publish('fifa', payload='amazing', qos=0)
    #time.sleep(2)
    client.loop()