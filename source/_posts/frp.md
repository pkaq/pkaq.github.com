title: frp
date: 2023-04-19 19:26:46
tags: []
categories: 
author: PKAQ
------
title: 使用Frp实现内网穿透访问
author: PKAQ
date: 2023-04-15 13:33:24
tags: ['Frp','Docker','Linux']
categories: ['Linux']
---

# 引言

  frp 是一个可用于内网穿透的高性能的反向代理应用，支持 tcp, udp 协议，为 http 和 https 应用协议提供了额外的能力，且尝试性支持了点对点穿透。 
  
  详细文档请参考：https://github.com/fatedier/frp/blob/master/README_zh.md

  frp 支持 macOS, freebsd, windows,linux x64,linux i386, linux arm,Linux arm64, Mips 等不同的系统和 CPU 架构，并分别打包了文件。

 因此，为了方便在不同的系统中安装和配置 frp，我基于 docker 对 frp 进行了封装和打包。

  但是由于 docker 的限制，目前只支持(amd64, arm32v6, arm32v70, arm64v8, i386)

<!-- more -->

# 步骤

**必要条件**
- 公网ip服务器一台（可以用各大厂商的学生机，带宽决定速度
- 域名（可选）
- frp配置

## 1.服务器端配置

  可以直接使用frp的docker镜像，这里需要提前设置好宿主机的目录，并且配置好`frps.ini`，直接创建docker会把`frps.ini`映射成目录。

_frps.ini_
```ini
[common]
bind_port = 7000

dashboard_port = 7500
# 设置仪表盘访问的用户名密码
dashboard_user = admin
dashboard_pwd = admin
```

_docker command_
```shell
  docker run  --network host -d -v /opt/docker_data/frp/frps.ini:/etc/frp/frps.ini --name frps snowdreamtech/frps
```


  容器启动成功后，通过`http://你的ip:7500`访问，可正常登录控制台则为安装成功。

## 2.客户端配置

  客户端同样可以借助docker镜像配置，步骤与服务器端一致。

_frpc.ini_
```ini
[common]
server_addr = 你的公网服务器IP
server_port = 7000

[ssh]                 # 别名
type = tcp            # 类型
local_ip = 127.0.0.1  # 本地ip
local_port = 22       # 需要穿透访问的本地端口 
remote_port = 18022   # 远程映射的端口，这里不要与服务器上已有的端口冲突

[another]             # 与上面一样 ，可以配置多个
type = tcp
local_ip = 127.0.0.1
local_port = 10082
remote_port = 10082

#外界通过  公网IP + remote_port  ---访问--->  local_ip + local_port 
#如：访问1.2.3.4:18022 实质访问 127.0.0.1:22 

```

_docker command_
```shell
docker run  --network host -d -v /opt/docker_data/frp/frpc.ini:/etc/frp/frpc.ini --name frpc snowdreamtech/frpc
```

  启动成功后，查看容器日志可见`[ssh] start proxy success`, 此时可通过`公网ip:端口`尝试访问内网服务器进行测试。

## 3.域名配置

  如果有域名可以新建一个二级域名，A记录解析到公网服务器IP即可通过域名进行穿透访问。