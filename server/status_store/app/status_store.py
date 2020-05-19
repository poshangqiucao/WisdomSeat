import paho.mqtt.client as mqtt
from config import config,mqtt_server
import json
import pymysql
import time

topic = "/status"
people_status = ""
temp = ""
sql =  "INSERT INTO status_data(timestamp,status) VALUES(%s,%s)"
def on_connect(client, userdata, flags, rc):
    print("Connected with result code: " + str(rc))
def on_message(client, userdata, msg):
    global temp
    global people_status
    people_status = str(msg.payload,encoding="utf8")
    if people_status == temp:
        pass        
    else:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        val = (timestamp,people_status)
        try:
            client.publish("/change_status",people_status)
            db = pymysql.connect(**config)
            cursor = db.cursor()
            cursor.execute(sql,val)
            # 执行sql语句
            db.commit()
            db.close()
        except:
            # 发生错误时回滚
            db.rollback()
            db.close()
        print(timestamp,people_status)
    temp = people_status
def on_subscribe(client, userdata, mid, granted_qos):
    print("subscribe success!")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(mqtt_server, 1883, 15) # 15为keepalive的时间间隔
client.subscribe(topic, qos=0)

while True:
    client.loop()