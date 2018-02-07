---
title: 使用插件检查Gradle依赖更新
author: PKAQ
date: 2018-02-07 19:23:49
tags: ['Gradle']
categories: ['Build Tools']
---

​    如今各大小有名无名厂商发布的各种依赖包版本滚动越来越频繁，也总有那么一波同学希望项目中的依赖尽可能保持新的版本，且看如下几种方式：

## 手动检查
​    最原始费时的方式莫过于手动检查了 ：}，喜欢这种方式自虐的同学可以点击传送门   
[Maven中央仓库](http://mvnrepository.com)

## 保持最新
​    使用`+`可以使依赖保持最新，不过这样带来的副作用即是每次构建总会去检查每个依赖是否存在最新版本，这必然会拖慢构建的速度。
```shell
org.springframework.boot:spring-boot-starter-web:+
```
##使用插件
​    使用三方插件进行检查，可以使依赖固定在一个相对新的版本，这里需要注意的是，plugins需要放置在脚本的顶部，更多关于`plugins`的内容可以查看[官方文档](https://docs.gradle.org/4.5/userguide/plugins.html#sec:plugins_block)
```shell
plugins {
   id "name.remal.check-dependency-updates" version "1.0.6" 
}
```
​    应用此插件后,可以执行`gradle checkDependencyUpdates` 或 `gradle cDU` 检查依赖最新版本 : }
```shell
> Task :web:checkDependencyUpdates
New dependency version: com.alibaba:druid: 1.0.29 -> 1.1.7
```