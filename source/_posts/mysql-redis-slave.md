---
title: 基于Dokcer得Reids/Mysql主从配置
author: PKAQ
date: 2020-03-08 09:31:56
tags: ['mysql', 'redis']
categories: ['数据库']
---

## redis主从配置
1.启动主容器 
容器启动参数添加：
```shell
redis-server --slaveof 192.168.10.16 6379 --masterauth 7u8i9o0p --appendonly yes
```


启动从容器
容器启动参数添加：
```shell
redis-server /usr/local/etc/redis/redis.conf --appendonly yes
```

## mysql主从配置：
1.主节点配置文件调整
```cnf
[mysqld]
# 主从配置
# 指定要进行主从同步的库
binlog-do-db=xmc
binlog-do-db=xmc_test
binlog-do-db=eva
# 开启binlog
log-bin=mysql-bin
server-id=1
```

2.创建复制用用户
```sql
CREATE USER 'replica_user'@'%' IDENTIFIED BY 'RP7u8i9o0p-[';
GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'%';
FLUSH PRIVILEGES;

-- 记住file和position
SHOW MASTER STATUS; 
```

3.从节点配置文件调整
```conf
[mysqld]
server-id=2
relay-log=relay-bin
log-bin=off
# 主从配置
replicate-do-db=xmc
replicate-do-db=xmc test
replicate-do-db=eva
```

4.从节点配置
```sql
STOP SLAVE;
CHANGE MASTER TO
    MASTER_HOST='192.168.10.16',
    MASTER_PORT='12306'
    MASTER_USER='replica_user',
    MASTER_PASSWORD='password',
    MASTER_LOG_FILE='mysql-bin.000001',  -- 主节点的 File 值
    MASTER_LOG_POS= 4;                  -- 主节点的 Position 值
START SLAVE;
-- 确认从节点状态：
SHOW SLAVE STATUS;
```


**注意**：

1.先保证两边结构一致性,也可以用mysqldump
```shell
pt-table-sync --execute --sync-to-master \
  --user=<master_user> --password=<master_password> \
  h=192.168.10.16,P=12306,D=%,t=% \
  --user=<slave_user> --password=<slave_password> \
  h=192.168.10.18,P=12306
```
  
2.my.cnf如果启动是被ignore了，只需要把这个文件权限改为644即可
