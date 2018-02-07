---
title: 使用yarn替代npm
author: PKAQ
date: 2017-01-20 17:16:16
tags: ['yarn']
categories: ['Build Tools','前端']
---

强烈安利一波yarn,yarn默认就有锁定文件、更快速地安装依赖以及依赖的更新会自动同步到 package.json 文件中。从npm迁移过来根本不需要做什么,原有的package.json直接可用


注意 以下内容摘自 : https://segmentfault.com/a/1190000007189426
## 安装

1.如果原先有npm工具的话，安装yarn很简单，只需要一行命令即可
```bash
	npm install -g yarn
```

2.如果没有npm工具，安装yarn可参照 -> [各平台下yarn工具安装方式](https://yarnpkg.com/en/docs/install)

<!-- more -->
## 配置

安装yarn之后默认的包安装源是 https://registry.yarnpkg.com，可用查看命令
```bash
yarn config get registry
```

若想提高yarn安装的速度，可将包安装源修改为cnpm的安装源，执行以下命令即可
```bash
yarn config set registry 'https://registry.npm.taobao.org'
```

## 使用

1.初始化某个项目
```bash
npm init
yarn init
```

2.默认的安装依赖操作
```bash
npm install/link
yarn install/link
```

3.安装某个依赖，并且默认保存到package
```bash
npm install xxx —save
yarn add xxx
```

4.移除某个依赖项目
```bash
npm uninstall xxx —save
yarn remove xxx
```

5.安装某个开发时依赖项目
```bash
npm install --save-dev xxx 
yarn add xxx —dev
```

6.更新某个依赖项目
```bash
npm update --save xxx
yarn upgrade xxx
```

7.安装某个全局依赖项目
```bash
npm install -g xxx 
yarn global add xxx
```

8.发布/登录/登出，一系列NPM Registry操作
```bash
npm publish/login/logout
yarn publish/login/logout
```

9.运行某个命令
```bash
npm run/test
yarn run/test
```

