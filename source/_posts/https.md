---
title: 使用Let's encrypt和nginx配置https访问
author: PKAQ
date: 2018-12-01 20:53:09
tags: ['https','nginx']
categories: ['Http']
---



# 引言

　　Let’s Encrypt 是一个将于2015年末推出的数字证书认证机构，将通过旨在消除当前手动创建和安装证书的复杂过程的自动化流程，为安全网站提供免费的SSL/TLS证书 ， 虽然Let's Encrypt's证书有效期只有90天，不过你可以通过配置一个简单的定时任务来免费更新你的证书。



# 版本

- CentOS Linux 7 (Core) x86_64 
- nginx 1.12.2



# 步骤

## nginx配置

　　首先要配置`nginx`的`server`节点，用以`lets's encrypt `进行域名验证。

```lua
server {
	server_name yourdomain.com;
}
```
配置完成后，`reload`一下`nginx`配置

## 证书获取

### 安装Certbot

```bash
wget https://dl.eff.org/certbot-auto 
chmod a+x ./certbot-auto 
```

### 证书申请

```bash
./cerbot-auto -d yourdomain.com
```

> 使用 -d 参数来指定你的域名
>
> 申请时根据提示输入你的`Email`并且同意协议等。完成后会自动配置`nginx`
>
> 注意: `https`走的是443端口，记得防火墙放开443端口的访问

## 自动更新

　　使用`crontab -e`创建定时任务，来定时更新你的证书文件。

```bash
0 0 15 1-12/2 * /path/of/your/certbot-auto renew --quiet
```



## 证书管理

　　可以通过以下几个命令参数来管理你的证书

```
- certificates    显示证书信息
- revoke          撤销证书（提供证书路径 --cert-path）
- delete          删除证书
```

