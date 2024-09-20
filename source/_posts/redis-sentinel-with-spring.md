---
title: Spring配置Redis主从+哨兵模式
author: PKAQ
date: 2023-05-27 15:11:47
tags: ['Spring','Redis','Docker']
categories: ['Redis']
---

### 1.镜像创建
```yaml
version: '3.8'

services:
  redis-alpha:
    image: redis
    container_name: redis-alpha
    privileged: true
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/alpha:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/redis.conf", "--appendonly", "yes"]

  redis-bravo:
    image: redis
    container_name: redis-bravo
    privileged: true
    restart: always
    ports:
      - "7379:6379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/bravo:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/redis.conf", "--appendonly", "yes"]

  redis-charle:
    image: redis
    container_name: redis-charle
    privileged: true
    restart: always
    ports:
      - "8379:6379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/charle:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/redis.conf", "--appendonly", "yes"]

  redis-sentinel-alpha:
    image: redis
    container_name: redis-sentinel-alpha
    privileged: true
    restart: always
    ports:
      - "26379:26379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/sentinel/alpha:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/sentinel.conf", "--sentinel"]

  redis-sentinel-bravo:
    image: redis
    container_name: redis-sentinel-bravo
    privileged: true
    restart: always
    ports:
      - "26380:26379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/sentinel/bravo:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/sentinel.conf", "--sentinel"]

  redis-sentinel-charle:
    image: redis
    container_name: redis-sentinel-charle
    privileged: true
    restart: always
    ports:
      - "26381:26379"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /opt/docker_data/redis/sentinel/charle:/usr/local/etc/redis
    command: ["redis-server", "/usr/local/etc/redis/sentinel.conf", "--sentinel"]


```

### 2.主节点配置
```conf
requirepass 7u8i9o0p
```


### 3.从节点配置
```conf
replicaof 192.168.10.16 6379
masterauth 7u8i9o0p
requirepass 7u8i9o0p

```

### 4.哨兵配置
```config
daemonize no
sentinel monitor master_redis 192.168.10.16 6379 2
sentinel auth-pass master_redis 7u8i9o0p
sentinel down-after-milliseconds master_redis 5000
sentinel parallel-syncs master_redis 1
sentinel failover-timeout master_redis 60000

```

注意：哨兵映射到宿主机的目录需要给予777的权限以及chown 999

### 5.Spring 的配置
```yaml
spring:
	data:  
	  # redis 配置  
	  redis:  
	    host: 192.168.10.16  
	    port: 6379  
	    password: 7u8i9o0p  
	    timeout: 10000  
	    database: 0  
	    sentinel:  
	      master: master_redis  
	      nodes:  
	        - 192.168.10.16:26379  
	        - 192.168.10.16:26380  
	        - 192.168.10.16:26381
```