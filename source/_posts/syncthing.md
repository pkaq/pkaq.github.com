---
title: 使用Syncthing自建网盘
author: PKAQ
date: 2018-12-01 18:15:50
tags: ['Syncthing']
categories: ['The Others']
---



# 引言

　　`Syncthing`是一个开源免费的文件夹/文件同步神器，支持`Android`、`Linux`、`Windows`、`Mac OS X`等系统，可以使我们任意台任何系统任何设备之间，实现文件实时同步。所有通信都使用`TLS`进行保护。所使用的加密包括完美的前向保密，以防止窃听者获得对您的数据的访问权限。很适合用来搭建私有同步网盘。 

# 版本

- Centos OS7 + Win10 x64
- Syncthing v0.14.52
- Docker version 1.13.1

#步骤

## 拉取镜像

　　使用`docker pull syncthing/syncthing`拉取最新镜像。

## 创建容器

　　使用如下命令创建容器, 这里需要注意 外挂的目录需要执行`chown -R 1000:1000 dir`

```bash
docker create --name syncthing -p 8384:8384 -p 22000:22000 -p 21027:21027/udp -v /opt/data/docker/syncthing/st-cfg:/var/syncthing/config -v /opt/data/docker/syncthing/st-sync:/var/syncthing docker.io/syncthing/syncthing:latest 
```

　　参数说明：

-  --name： 容器别名
- -p： 映射主机端口
- -v： 映射主机目录

　　容器创建完成后，使用`docker start syncthing`即可启动容器，这里需要注意的是，需要放开防火墙对8384端口的访问。

　　启动完成后，访问`http://ip:8384`即可。

## 安全访问

　　访问到webui界面后，依次点击`操作->设置->图形用户界面`，设置用户名/密码。
　　

## 文件同步

　　在你的`Windows`机器下载相应的客户端，启动后点击`添加远程设备`，此时会要求你输入远程设备的ID，打开你的远程界面，点击`操作->显示ID`将相应设备ID复制后填入即可。

　　界面左侧可以点击`添加文件夹`添加需要同步的文件夹，默认会一小时扫描一次磁盘更改，可以点击`选项`重新设置扫描间隔，需要注意的是，这里的间隔单位是`秒`。设置完成后便会开始同步啦。