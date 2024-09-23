---
title: 使用Verdaccio搭建NPM私服
author: PKAQ
date: 2022-03-08 09:31:56
tags: ['前端', 'devops','docker']
categories: ['前端']
---


### 1.编写配置
```yml
# Verdaccio 配置文件

# 接口设置
listen:
  - 0.0.0.0:4873

# npm 包存储路径
storage: ./storage

# 插件存储路径
plugins: ./plugins

# 日志配置
logs:
  - { type: stdout, format: pretty, level: http }

# 用户认证设置
auth:
  htpasswd:
    file: ./htpasswd   # 存放用户信息的文件
    max_users: -1 # 不允许自行注册

# 包访问控制
packages:
  # 纯私有访问放库
  yytech:
    access: $authenticated
    publish: $authenticated
  '@*/*':
    access: $all       # 允许所有用户查看 @scope 下的包
    publish: $authenticated # 仅允许认证用户发布
    proxy: npmjs

  '**':
    access: $all       # 允许所有用户查看所有包
    publish: $authenticated # 仅允许认证用户发布
    proxy: npmjs       # 代理到官方 npm 源

# 代理设置
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

# 发布权限控制
middlewares:
  audit:
    enabled: true

# Web 界面设置
web:
  enable: true
  title: Verdaccio 私有仓库

# 安全设置 (需要 https)
security:
  api:
    jwt:
      sign:
        expiresIn: 7d
  web:
    sign:
      expiresIn: 7d

# 自定义 HTTP Headers (可选)
headers:
  Cache-Control: no-store



```


### 2.创建用户

使用[Htpasswd Generator – Create htpasswd - hostingcanada.org](https://hostingcanada.org/htpasswd-generator/)创建一个用户名/密码摘要 ，把生成的内容存放到 conf/htpasswd 文件中

### 3.创建镜像
```shell
docker run -d \
  --restart=always \
  --name verdaccio \
  -v  /opt/docker_data/verdaccio/storage:/verdaccio/storage \
  -v /opt/docker_data/verdaccio/conf:/verdaccio/conf  \
  -p 4873:4873 \ 
  verdaccio/verdaccio
```