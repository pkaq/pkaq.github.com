title: 第六章： 构建基础
date: 2013-09-06 11:39:54
tags: ['Gradle UserGuide']
categories: Gradle
author: PKAQ
---

#### 6.1 Projects 和 tasks
 
  Gradle中最重要的两个概念就是 Projects和tasks
 
 任何一个Gradle构建都是由一个或多个 projects 组成.每个project包括许多可构建组成部分.这完全取决于你要构建些什么.举个栗子.每个project或许是一个jar包或者一个web应用,它也可以是一个由许多其他项目中产生的jar构成的zip压缩包.一个project不必描述它只能进行构建操作.它也可以部署你的应用或搭建你的环境.不要担心它像听上去的那样庞大.Gradle的build-by-convention可以让您来具体定义一个project到底该做什么.
  每个project都由多个tasks组成.每个task都代表了构建执行过程中的一个原子性操作.如编译,打包,生成javadoc,发布等
  到目前为止,可以发现我们可以在一个project中定义一些简单任务,后续章节将会阐述多项目构建和多项目多任务的内容.
 
#### 6.2 Hello world
 
你可以通过在命令行运行gradle命令来执行构建,gradle命令会从当前目录下寻找build.gradle文件来执行构建.我们称build.gradle文件为构建脚本.严格来说这其实是一个构建配置脚本,后面你会了接到这个构建脚本定义了一个project和一些默认tasks
你可以创建如下脚本到build.gradle中
 
* 例6.1 第一个构建脚本

<!-- more -->

build.gradle 
```groovy
task hello {
 doLast {
     println 'Hello world!'
  }
}
``` 
然后在该文件所在目录执行 gradle -q hello
 
* 例6.2 执行脚本

```shell
> gradle -q hello
Hello world!
```

上面的脚本定义了一个叫做 hello 的 task,并且给它添加了一个动作.当运行 gradle hello 的时候,Gralde便会去调用 hello 这个任务来执行给定操作.这些操作其实就是一个用groovy书写的闭包
如果你觉得它看上去跟Ant中的targets很像,那么是对的.Gradle的tasks就相当于Ant中的targets.不过你会发现他功能更加强大.我们只是换了一个比target更形象的另外一个术语.不幸的是这恰巧与Ant中的术语有些冲突.ant 命令中有诸如javac、copy、tasks.所以当该文档中提及tasks时,除非特别指明 ant task ,否则指的仅仅是与Gradle中的tasks.
 
注: -q参数的作用?该文档的示例中很多地方在调用gradle命令时都加了-q参数.该参数用来控制gradle的日志级别,可以保证只输出我们需要的内容.具体可参阅本文档 第十八章 日志 来了解更多参数和信息.
 
#### 6.3 快速定义任务
    
* 例6.3 快速定义任务
 
build.gradle
```shell
task hello <<{
   println 'Hello ,world!'
}
``` 
上面的脚本又一次采用闭包来定义了一个叫做hello的任务,本文档后续章节中我们将会更多的采用这种风格来定义任务.
 
####6.4 代码即脚本

Gradle脚本采用Groovy书写,看下面这道开胃菜.

* 例6.4 在gradle任务中采用groovy

build.gradle
```groovy
task upper << {
	String someString = 'mY_NaMe'
	println "Original : " +someString
	println "Upper case : " + someString.toUpperCase()
}
```
    
```shell
>gradle -q upper
Original : mY_NaMe
Upper case : MY_NAME
```
* 例 6.5 在gradle任务中采用groovy
 
build.gradle
```groovy
task count << {
	4.times {
		print "$it"
	}
}
```
 
```shell
>gradle -q count
0 1 2 3
```
 
### 6.5 任务依赖

你可以按如下方式创建任务间的依赖关系

*例6.6
```groovy
task hello << {
    println 'Hello world!'
}

task intro(dependsOn:hello) << {
    println "I'm Gradle"
}
```

```shell
>gradle -q intro
Hello world!
I'm Gradle
```
