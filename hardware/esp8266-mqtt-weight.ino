#include <ESP8266WiFi.h>
#include <WiFiManager.h>         
#include <PubSubClient.h>
#include <HX711.h>
#include <ArduinoJson.h>  
#include <ArduinoOTA.h>

const char* topics = "/weight/1";          //硬件发送数据的主题
const char* mqtt_server = "www.xxx.com";   //MQTT服务器地址
const int LOADCELL_DOUT_PIN = D1;		   //数据端口
const int LOADCELL_SCK_PIN = D2;           //时钟端口
long  weight = 0;
HX711 scale;
WiFiClient wclient;
PubSubClient client(wclient);

//初始化函数
void setup() {
  Serial.begin(115200); 
  delay(10);
  //注册传感器数据口和时钟口
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  delay(10);
  WiFiManager wifimanager;
  wifimanager.setBreakAfterConfig(true);
  if (!wifimanager.autoConnect()) {
    Serial.println("failed to connect, we should reset as see if it connects");
    delay(3000);
    ESP.reset();
    delay(5000);
  }

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { 
      type = "filesystem";
    }
    Serial.println("Start updating " + type);
    });
    ArduinoOTA.onEnd([]() {
      Serial.println("\nEnd");
    });
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    ArduinoOTA.onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) {
        Serial.println("Auth Failed");
      } else if (error == OTA_BEGIN_ERROR) {
        Serial.println("Begin Failed");
      } else if (error == OTA_CONNECT_ERROR) {
        Serial.println("Connect Failed");
      } else if (error == OTA_RECEIVE_ERROR) {
        Serial.println("Receive Failed");
      } else if (error == OTA_END_ERROR) {
        Serial.println("End Failed");
      }
    });
    ArduinoOTA.begin();
    
    Serial.println("Connected!");
    Serial.print("local ip:");
    Serial.println(WiFi.localIP());
    client.setServer(mqtt_server, 1883);
}


//重连MQTT代理
void reconnect() {
  // 循环直到连接代理成功
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // 创建一个随机客户端ID
    String clientId = "nodemcuClient-";
    clientId += String(random(0xffff), HEX);
    // 尝试连接
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // 连接成功可订阅主题
      //client.subscribe("harshad/harshad");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // 等待
      delay(2000);
    }
  }
}

//主函数
void loop() {
  while (WiFi.status() != WL_CONNECTED) {
    WiFiManager wifimanager;
    if (!wifimanager.autoConnect()) {
      Serial.println("failed to connect, we should reset as see if it connects");
      delay(3000);
      ESP.reset();
      delay(5000);
    }
  }
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  char json[128] ="";
  DynamicJsonDocument doc(128);
  doc["weight"] = readweight();
  serializeJson(doc,json);
  client.publish(topics,json);
  Serial.println(json);
  
  ArduinoOTA.handle(); 
}

//读取压力传感器的值
long readweight(){
  delay(100);
  if (scale.is_ready()) {
    weight  = scale.read();
    Serial.print("HX711 reading: ");
  } else {
    weight = 0;
    Serial.println("HX711 not found.");
  }
  return weight;
 }
