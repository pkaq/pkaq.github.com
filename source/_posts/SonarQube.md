---
title: Jenkins集成Sonarqube管理代码质量
date: 2023-08-11 16:33:41
tags: ['jenkins','sonar','gradle']
categories: DevOps
author: PKAQ
---

## 有效版本

- Jenkins： 2.418
- sonarqube： 9.2.4
- gradle： 8.1

<!-- more -->

## 准备工作

## 1、搭建sonar环境

直接利用docker镜像先拉起postgreSQL然后拉起sonarqube即可。

注意：
- sonar最新版本已经不支持mysql
- 启动时如果报空间不足执行下面的命令
```console
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
```

Docker镜像启动
```bash
docker run -d --name postgres -p 5432:5432 \
	-v /opt/docker_data/postgres/postgresql:/var/lib/postgresql \
	-v /opt/docker_data/postgres/data:/var/lib/postgresql/data \
	-v /etc/localtime:/etc/localtime:ro \
	-e POSTGRES_USER=sonar \
	-e POSTGRES_PASSWORD=sonar \
	-e POSTGRES_DB=sonar \
	-e TZ=Asia/Shanghai \
	--restart always \
	--privileged=true \
postgres

docker run \
	-d \
	--link postgres \
	--name sonarqube \
	-p 16090:9000 \
	-p 16092:9092 \
	-v /opt/docker_data/sonar/logs:/opt/sonarqube/logs \
	-v /opt/docker_data/sonar/conf:/opt/sonarqube/conf \
	-v /opt/docker_data/sonar/data:/opt/sonarqube/data \
	-v /opt/docker_data/sonar/extensions:/opt/sonarqube/extensions \
	-e TZ=Asia/Shanghai \
	-e SONARQUBE_JDBC_USERNAME=sonar \
	-e SONARQUBE_JDBC_PASSWORD=sonar \
	-e SONARQUBE_JDBC_URL="jdbc:postgresql://postgres:5432/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance&useSSL=false" \
	--restart always \
	--privileged=true \
sonarqube
```

## 2、配置

启动后访问`16090`端口，使用默认的用户名密码登录`(admin/admin)`，登陆后创建项目即可->创建令牌->按照说明配置项目即可。
![JDK](a.png)
![JDK](b.png)
![JDK](c.png)
![JDK](d.png)

完成这一步之后，可以通过你得构建工具进行分析测试了。我这里用的gradle，执行sonar任务一段时间后会在管理页面刷新检测报告。

## 3、Jenkins配置

Jenkins方面主要是安装`[SonarQube Scanner for Jenkins]插件,安装后按照如图的配置配置即可。
![JDK](e.png)
![JDK](f.png)
![JDK](g.png)
