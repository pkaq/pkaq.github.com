---
title: 使用基于docker镜像的Nginx开启https
date: 2023-06-28 16:16:12
tags: ['Nginx','Https']
categories: ['Web']
---

## 简介

  通过使用`acme.sh`生成免费的ssl证书开启NG的Https支持，`acme.sh`其完整实现了acme协议，并且由纯Shell脚本语言编写，没有过多的依赖项，安装和使用都非常方便。

  对于zerossl官网，需要指出的是，用户可以在控制台直接申请证书，但免费用户最多只能申请3个，而使用ACME申请zeroSSL证书则没有数目限制。

acme.sh官方gitlhub地址： https://github.com/acmesh-official/acme.sh

<!-- more -->

## 一、安装

选择在线安装或者仓库安装的方式都可以，网络不好建议使用第二种方式

```shell
# 在线安装
curl https://get.acme.sh | sh -s email=你的邮箱

# 仓库安装
git clone https://github.com/acmesh-official/acme.sh.git 
cd ./acme.sh 
./acme.sh --install -m 你的邮箱
```

## 二、签发证书

  鉴于国内的网络环境，采用手工签发的方式，只需要在域名上添加一条 txt 解析记录, 验证域名所有权即可。不过使用这种方式如果不同时配置 Automatic DNS API，使用这种方式 acme.sh 将无法自动更新证书，每次都需要手动再次重新解析验证域名所有权。
  
```shell
## 签发
 ./acme.sh  --issue  --dns -d 你的域名 --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

这条命令执行完之后会生成一条需要你添加的TXT记录，在解析服务商处添加即可。

## 三、重新签发证书
```shell
 ./acme.sh  --renew  -d  你的域名  --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

## 四、安装证书

```shell
./acme.sh --install-cert -d 你的域名 --key-file  /opt/data/nginx/ssl/key.pem  --fullchain-file /opt/data/nginx/ssl/cert.pem

```

如果创建容器的时候未预留挂载ssl的目录，需要重新创建容器，将上面的`/opt/data/nginx`映射到`nginx`容器内。

## 五、NG配置

```nginx

server{
	listen 443 ssl default_server;
	
	server_name vultr.pkaq.org;
	
	#证书文件名称
	ssl_certificate_key /etc/nginx/ssl/key.pem;
	#私钥文件名称 .crt和.pem都可以用
	ssl_certificate /etc/nginx/ssl/cert.pem;
}

```

## 六、验证

重启nginx验证访问。
