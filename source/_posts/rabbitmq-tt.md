---
title: 使用RabbitMQ搭建MQTT服务
author: PKAQ
date: 2024-03-08 09:31:56
tags: ['rabbitMQ', 'MQTT']
categories: ['IOT']
---

1.启用mq 的mqtt插件
rabbitmq-plugins enable rabbitmq_mqtt

2.启用账户管理
rabbitmq-plugins enable rabbitmq_management

3.添加用户
rabbitmqctl add_user toor 7u8i9o0p

4.设置管理
rabbitmqctl set_user_tags toor administrator

5.授权
rabbitmqctl set_permissions -p / toor ".*" ".*" ".*"


6.配置文件

mqtt.listeners.tcp.default = 1883
mqtt.allow_anonymous = true
mqtt.vhost = /
mqtt.exchange = amq.topic

rabbitmqctl set_user_tags yytech administrator

rabbitmqctl set_permissions -p / yytech ".*" ".*" ".*"