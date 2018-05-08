---
title: 一分钱让自己科学上网
author: PKAQ
date: 2018-02-09 13:19:55
tags: ['GFW']
categories: ['杂文']
---

# 获取云服务器
### 1.注册vultr
 点击 [|>注册传送门<|](https://www.vultr.com/?ref=7353037) 注册`vultr`   
 
### 2.选择配置
<!-- more -->
  点击`servers`菜单页面的`加号`创建服务器。这里建议选择欧洲服务器,根据经验欧洲服务器是稳定性和速度最好的。这里选择最便宜的配置就够用了，当然2.5的基本常年处于缺货状态。
  选择完成后，点击部署，等待创建完成。
![0.jpg](.\0.jpg)
### 服务器操作
在服务器控制台可以看到刚才创建的服务器，点击右侧的三个原点可以可用操作；
![1.jpg](.\1.jpg)
点击标题可以查看配置详情。到这里你就可以通过`online console`或者`xshell`等各种方式来登录操作你的服务器了:)
![2.jpg](.\2.jpg)

# 搭建梯子
搭建梯子非常简单,登录服务器后只需要用如下的命令三连即可
```bash
# 安装docker
yum install docker
# 启动docker
systemctl start docker
# 拉取镜像
docker pull oddrationale/docker-shadowsocks
# 启动容器
docker run -d -p 1984 :1984 oddrationale/docker-shadowsocks -s 0.0.0.0 -p 1984 -k password -m aes-256-cfb
```
# 使用梯子

使用梯子的方式也十分简单,只需要去 `https://shadowsocks.com/client.html`下载一个`ShadowSocks`客户端,填入相应的配置即可。

p.s:本贴仅用以技术交流探讨
