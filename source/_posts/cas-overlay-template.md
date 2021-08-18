---
title: 使用cas-overlay-template搭建CAS服务
author: PKAQ
date: 2020-05-07 09:33:24
tags: ['CAS','SSO']
categories: ['SSO']
---

# 概述

  单点登录的英文名称为Single Sign-On，简写为SSO，它是一个用户认证的过程，允许用户一次性进行认证之后，就访问系统中不同的应用；而不需要访问每个应用时，都重新输入密码。

- 用户第一次访问受保护的应用，将会重定向到cas登录页面
- 用户输入用户名和密码，cas server 认证用户创建sso session,并生成TGT和改客户端的服务票据（ST）
- 应用拿着ST到 CAS 服务验证ST,验证通过后设置session和cookie返回浏览器
- 用户浏览器携带cookie访问，应用验证后返回内容
- 访问第二个cas client 应用，此时cookie中有TGT但是没有ST，应用要求去CAS 服务获取ST,cas 服务验证TGT并生成一个ST
- 客户端携带ST访问应用，应用服务区Cas server 验证ticket,验证成功后设置session,cookie,重定向到应用服务地址
  展示第二个应用的内容

![0](0.jpg)

# 快速开始

git clone https://github.com/apereo/cas-overlay-template.git

执行./gradlew.bat clean build  第一次构建比较慢，耐心等待
./gradlew.bat explodeWar 解压
此时将会在bulid目录下生成一个cas-resources 文件夹，我们把里面的文件全部拷贝到src/main/resources,将\etc\cas\thekeystore 也拷贝到该目录下

更改配置application.properties    server.ssl.key-store=classpath:thekeystore 

./gradlew.bat run 将cas运行在内嵌的 Embedded Tomcat 中

启动完成后浏览器中打开 https://localhost:8443/cas/login 

![1](1.png)

此时我们的cas已经部署成功 在登录也面输入用户名和密码 casuser Mellon ,出现下面界面表明cas已经部署成功

![2](2.png)