---
title: 使用docker部署Loki
author: PKAQ
date: 2023-04-27 15:11:47
tags: ['Spring','Spring Cloud','Spring Boot']
categories: ['Spring Cloud']
---
## 简介

	Loki是受Prometheus启发由Grafana Labs团队开源的水平可扩展，高度可用的多租户日志聚合系统。使用标签来作为索引，而不是对全文进行检索，也就是说，通过这些标签既可以查询日志的内容也可以查询到监控的数据签，极大地降低了日志索引的存储。系统架构十分简单，由以下3个部分组成 ：

- **Loki**：负责存储日志和处理查询。
- **Promtail**：负责收集日志并将其发送给loki。
- **Grafana**： 用于 UI 展示。

<!-- more -->

##  配置准备

准备`loki.yml`、`promtail.yml`、`docker-compose.yml`
可以去[https://github.com/grafana/loki](https://github.com/grafana/loki)下载最新的配置文件

Loki路径： cmd/loki/loki-local-config.yaml
Promtail路径：clients/cmd/promtail/promtail-local-config.yaml
Docker-pompose路径：production/docker-compose.yaml

loki.yml和promtail.yml使用默认配置即可。下载完成后在服务器放置loki和promtail的配置文件。这里放置的目录要与loki和promtail的volumes中挂载配置文件的目录以及Promtail的volumes挂载日志的目录一致。

**loki.yml**
```yaml
auth_enabled: false
server:
  http_listen_port: 3100
  grpc_listen_port: 9096
common:
  instance_addr: 127.0.0.1
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory
query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100
schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
ruler:
  alertmanager_url: http://localhost:9093
```


**promtail. yml**
```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0
positions:
  filename: /tmp/positions.yaml
clients:
  - url: http://loki:3100/loki/api/v1/push
scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
```


## 镜像构建
**docker-compose.yml**
```yaml

version: "3"

networks:
  loki:
services:
  # 日志存储和解析
  loki:
    image: grafana/loki
    container_name: lpg-loki
    volumes:
     - /opt/docker_data/loki/:/etc/loki/
   # 修改loki默认配置文件路径
    command: -config.file=/etc/loki/loki.yml
    ports:
     - 3100:3100
    networks:
      - loki
    # 日志收集器
  promtail:
    image: grafana/promtail
    container_name: lpg-promtail
    volumes:
     # 将需要收集的日志所在目录挂载到promtail容器中
      - /opt/test_logs/:/var/log/
      - /opt/docker_data/promtail:/etc/promtail/
    # 修改promtail默认配置文件路径
    command: -config.file=/etc/promtail/promtail.yml
    networks:
      - loki
  # 日志可视化
  grafana:
    container_name: lpg-grafana
    environment:
      - GF_PATHS_PROVISIONING=/etc/grafana/provisioning
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    entrypoint:
      - sh
      - -euc
      - |
        mkdir -p /etc/grafana/provisioning/datasources
        cat <<EOF > /etc/grafana/provisioning/datasources/ds.yaml
        apiVersion: 1
        datasources:
        - name: Loki
          type: loki
          access: proxy
          orgId: 1
          url: http://loki:3100
          basicAuth: false
          isDefault: true
          version: 1
          editable: false
        EOF
        /run.sh
    image: grafana/grafana
    ports:
      - "3000:3000"
    networks:
      - loki
```

运行docker-compose.yml脚本安装所有服务
```shell
docker-compose up -d
```

## 日志监控配置

当系统新增服务时，需要监控该服务的日志。可以通过ln命令建立一个硬链接将该服务的日志文件链接到promtail配置的挂载日志目录中。
```shell
ln -d /服务的日志目录/xx.log /promtail的日志目录/xx.log
```

然后重启promtail容器即可。在程序的yml中设置logging的path目录使用docker启动该程序时，直接映射 -v promtail的日志目录:/ logging的path目录 -v /mydata/app/mall-tiny-loki/logs:/var/logs 

## 日志查询

访问地址：http://服务器ip:3000/  登录grafana 账号密码为admin/admin

