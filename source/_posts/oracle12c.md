---
title: 使用Docker搭建基于官方镜像的Oracle 12c
author: PKAQ
date: 2021-05-07 09:33:24
tags: ['Oracle','SSO']
categories: ['Database']
---

# 前期准备

​	由于获取官方镜像需要登录，首先要去hub.docker.com注册一个docker hub账号，注册后在命令行执行如下命令进行登录。
​	



# 获取镜像
```bash
	# 使用刚才注册得用户名密码登录
	docker login
	# 拉取镜像
	docker pull store/oracle/database-enterprise:12.2.0.1-slim
```
官方镜像分了两个版本，其中一个slim版本是精简版。精简版不包含 : Analytics, Oracle R, Oracle Label Security, Oracle Text, Oracle Application Express and Oracle DataVault. 

# 安装
1. **创建宿主机映射目录**
```bash
	 mkdir /opt/data/oradata 
```

2. **创建并启动oracle数据库**
```bash
docker run -d --name 12c 
-e DB_SID=orcl 
-e DB_PDB=pdb 
-e WEB_CONSOLE=false 
-e ORACLE_CHARACTERSET=ZHS16GBK 
--privileged=true 
-v /opt/data/oradata:/ORCL \ 
-v /etc/localtime:/etc/localtime:ro\
-p 15210:1521 
store/oracle/database-enterprise:12.2.0.1-slim
```

命令解释
	-d：创建后以守护进程运行
	--restart=always： 当 docker 重启时,容器自动启动
	--privileged：获取宿主机root权限
	-v：将宿主机的/opt/data/oradata映射到容器内的/u01/app/oracle目录
	-e：指定容器内环境变量
	-p：指定宿主机的 15210 端口 映射到容器内的 1521 端口   



3. **连接测试**
数据库安装成功后使用客户端工具，用初始创建的用户名/密码登录进行连接测试。
用户名：sys
密码：Oradoc_db1
SID:  orcl

# 附1.修改字符集

1.连接测试

使用客户端工具执行如下命令查看当前字符集配置。NLS_CHARACTERSET参数为当前字符集设置。
```bash
 select * from v$nls_parameters;
```

2.进入容器
```bash
docker exec -it 12c /bin/bash
```

3.字符集修改
```
# 连接数据库
sqlplus /nolog
# 登录
conn /as sysdba
SQL>shutdown immediate;  
SQL>startup mount
SQL>ALTER  SYSTEM  ENABLE  RESTRICTED  SESSION;  
SQL>ALTER  SYSTEM  SET  JOB_QUEUE_PROCESSES=0;  
SQL>ALTER  SYSTEM  SET  AQ_TM_PROCESSES=0;
SQL>alter database open;  
SQL>ALTER DATABASE CHARACTER SET ZHS16GBK;
ALTER DATABASE CHARACTER SET ZHS16GBK  ERROR at line 1:
ORA-12712: new character set must be a superset of old character set
提示我们的字符集：新字符集必须为旧字符集的超集，这时我们可以跳过超集的检查做更改：
复制代码 代码如下:
SQL>ALTER DATABASE character set INTERNAL_USE ZHS16GBK;  
SQL>select * from v$nls_parameters; 
重启检查是否更改完成：
复制代码 代码如下:
SQL>shutdown immediate;
SQL>startup
SQL>select * from v$nls_parameters;
```