---
title: 在Gradle中使用阿里巴巴Java开发规约进行代码检查
author: PKAQ
date: 2017-10-19 09:27:38
tags: ['Gradle']
categories: Build Tools
---

# 

## 概述

　　最近阿里发布了[《阿里巴巴Java开发手册》](https://yq.aliyun.com/articles/69327?spm=5176.100239.blogcont69327.158.xUUgiz&p=2#comments),一时间无数阿里拥趸如获武穆遗书,就在近日阿里又顺便发布了[<阿里巴巴java开发规约插件>](https://github.com/alibaba/p3c),可以轻松的在码字阶段获得相应的编码提示,那么,在Gradle中如何应用`阿里开发规约`进行代码检查呢.且看下文.

　　阿里的开发规约插件是基于PMD进行的代码检测,所以在Gradle应用`阿里开发规约`检查只需要使用`gradle`提供的[`pmd`插件](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.quality.Pmd.html)即可达成目的.
  目前阿里开发规约提供了如下一些规则配置,要应用这些配置只需要将他们配置到`pmd`的检查规则中即可.
  
- ali-comment.xml	
- ali-concurrent.xml
- ali-constant.xml	
- ali-exception.xml	
- ali-flowcontrol.xml	
- ali-naming.xml	
- ali-oop.xml	
- ali-orm.xml	
- ali-other.xml	
- ali-set.xml

  
> **PMD介绍**
　　PMD(Project Manager Design)是一种开源分析Java代码错误的工具。与其他分析工具不同的是，PMD通过静态分析获知代码错误。也就是说，在不运行Java程序的情况下报告错误。PMD附带了许多可以直接使用的规则，利用这些规则可以找出Java源程序的许多问题。此外，用户还可以自己定义规则，检查Java代码是否符合某些特定的编码规范。
　　PMD的核心是JavaCC解析器生成器。PMD结合运用JavaCC和EBNF（扩展巴科斯-诺尔范式，Extended Backus-Naur Formal）语法，再加上JJTree，把Java源代码解析成抽象语法树（AST，Abstract Syntax Tree）。

> 以上内容引自百度百科-PMD条目

## 使用
```groovy
apply plugin: 'java'
apply plugin: 'pmd'

ext {
	p3c = "1.3.0"
}

pmd {
	consoleOutput = true
    reportsDir = file("build/reports/pmd")

	ruleSets = [
		"java-ali-comment"
	]
}

repositories {
   jcenter()
}

dependencies {
	pmd "com.alibaba.p3c:p3c-pmd:${p3c}"
}
```

这里有几个需要注意的点
- gradle的pmd插件为`rule`都添加了默认的`java-`前缀,一定不要丢掉
- dependencies中依赖的范围是`pmd`,这样依赖才会加到`pmdClasspath`中为`pmd`所用
- 关于本插件的一些其它配置可以查看 [`pmd插件dsl手册`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.quality.Pmd.html)

## 运行检查   
该插件提供了如下几个任务

| 任务名称 | 描述 |
|--------|--------|
|    pmdMain    |   检查src/main/java下的代码     |
|    pmdTest    |   检查src/main/test下的代码     |
|    pmdSourceSet    |  检查给定范围的代码      |
|    check    |  检查源码和单元测试代码      |

可以按照需求运行对应任务进行代码检查。
```groovy
//使用短写方式运行pmdMain任务
gradle pM
```

输出的检测报告在我们定义的目录里可以找到`build/reports/pmd`
