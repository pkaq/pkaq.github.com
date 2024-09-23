---
title: Mongo全量备份和增量备份
author: PKAQ
date: 2022-05-07 09:33:24
tags: ['mongodb','docker','devops']
categories: ['Database']
---

## 一、基础准备

### 创建一个用户备份的用户
```shell
use admin;
db.createUser({
  user: "oplog_back",
  pwd: "7u8i9o0p", 
  roles: [
    { role: "readWrite", db: "xmc" },
    { role: "read", db: "config" },
    { role: "read", db: "local" }
  ]
});
```

<!-- more -->
## 二、全量备份

### 1. 编写备份脚本

使用mongodump即可
```shell
#!/bin/bash

# 备份日期
DATE=$(date +%Y-%m-%d)

# Docker 容器名称或 ID
CONTAINER_NAME="mongo"

# 备份目录
BACKUP_DIR="/opt/backup/mongo"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 在容器中执行 mongodump 备份整个数据库
docker exec "$CONTAINER_NAME" /usr/bin/mongodump --username oplog_back --password '7u8i9o0p' --authenticationDatabase admin --out /data/db/backup/full

# 移动备份到指定目录
mv /opt/docker_data/mongodb/data/backup/full "$BACKUP_DIR"

cd "$BACKUP_DIR"
# 压缩备份为 ZIP
zip -r "$DATE.zip" full

# 删除原始备份目录
rm -rf xmc

echo "Backup for MongoDB completed and saved as /opt/backup/mongo/$DATE.zip."
```


### 2.创建定时任务
```cron
0 1 * * * /opt/backup/mongoback.sh
```

## 三、增量备份

增量备份使用的是oplog，需要以副本集的形式运行mongo且至少运行两个节点。

### 1.以副本集模式运行mongo
mongo的启动参数添加 replSet, 注意这里 keyFile 密码只可包含字母数字下划线，并且要保证每个副本集密码、keyfile、 名称相同

```shell
'--auth' '--replSet' 'rs0' '--keyFile' '/data/db/keyfile'
```

### 2.初始化副本集

#### 2.1 连接到主节点：
```shell
mongo --host localhost --port 27017 -u admin -p yourpassword --authenticationDatabase admin
```

#### 2.2 初始化副本集：

```shell
rs.initiate()
```

#### 2.3 添加从节点

```shell
rs.add("<从节点的IP地址>:27017")
```

#### 2.4 检查同步状态

```shell
rs.status()
```

如果身份验证正确并且网络连接正常，从节点应该会成功加入并开始同步

主节点（Primary Node）默认是可读写的。只有主节点允许写操作，而从节点（Secondary Nodes）默认情况下只允许读取操作（只读）。

详细解释：
主节点（Primary Node）：

默认支持读写操作：主节点接收所有写操作，并将数据复制到从节点。
应用程序发送的写入操作（insert、update、delete）只能通过主节点进行。
主节点也支持读操作。
从节点（Secondary Nodes）：

默认只读：从节点同步主节点的数据，默认情况下不允许写入操作。
读取操作：从节点在默认配置下不允许读取数据，除非启用了“读偏好”（readPreference）选项。

#### 2.5 创建同步脚本

```shell
#!/bin/bash

# 备份日期
DATE=$(date +%Y-%m-%d)

# Docker 容器名称或 ID
CONTAINER_NAME="mongo"

# 备份目录
BACKUP_DIR="/opt/backup/mongo"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 在容器中执行 mongodump 备份整个数据库
docker exec "$CONTAINER_NAME" /usr/bin/mongodump --username oplog_back --password '7u8i9o0p' --authenticationDatabase admin --out /data/db/backup/incremental

# 移动备份到指定目录
mv /opt/docker_data/mongodb/data/backup/incremental "$BACKUP_DIR"

cd "$BACKUP_DIR"
# 压缩备份为 ZIP
zip -r "$DATE.zip" incremental

# 删除原始备份目录
rm -rf incremental

echo "Backup for MongoDB completed and saved as /opt/backup/mongo/$DATE.zip."
```

#### 2.6 创建定时任务

```shell
0 * * * * /path/to/your/backup_script.sh
```