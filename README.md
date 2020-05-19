# 运行环境
### 1.1 硬件部分
    开发语言：Arduino  
    硬件平台：NodeMcu(基于ESP8266的开源硬件)   
    电阻应变半桥式传感器  
    HX711称重传感器专用模拟/数字（A/D）转换器芯片  
### 1.2 软件部分
    客户端:H5+app(非原生APP)  [官网](https://dev.dcloud.net.cn/mui/ui/)  
    服务端:
        操作系统：LSB Version:	:core-4.1-amd64:core-4.1-noarch  
                 Distributor ID:	CentOS  
                 Description:	CentOS Linux release 7.5.1804 (Core)   
                 Release:	7.5.1804  
                 Codename:	Core
        MQTT服务器平台:emq  
            [官网](https://www.emqx.io/cn/)  
            [安装教程](https://docs.emqx.io/broker/latest/cn/install.html#centos)  
        Python版本: Python 3.7.5  pip: 20.0.2
            需要用到的外部库: paho-mqtt，numpy，flask，PyMySQL，Flask-Cors
            数据库软件：Ver 8.0.19 for Linux on x86_64 
            服务容器化软件：Docker version 1.13.1, build 4ef4b30/1.13.1  	
 
