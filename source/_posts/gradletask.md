---
title: Gradle中的任务
author: PKAQ
date: 2018-08-12 17:24:15
tags: ['Gradle']
categories: ['构建']
---

`Project`和`Task`是`Gradle`中最核心的两个元素，当创建了一个`build.gradle`脚本那么`Gradle`便会依据脚本的配置创建一个`Project`,而脚本中的`Task`也会创建与之相对应`DeafultTask`实现。

`Gradle`通过一个个`Task`来完成具体的构建任务 ,可以说`Task`乃是`Gradle`的核心。根据执行阶段的不同，可以将`Gradle`中`Task`分为`配置型Task`以及`执行型Task`（非官方定义）。

## 定义task

定义一个`Task`十分简单，只需要使用`task name{}`即可定义一个简单的任务。

```groovy
task helloTask {
    println "Hello World"
}
```

执行`gradle hT`，可以观察到执行结果。这里你可能会注意到`Hello world`并非在执行阶段开始执行的,而是在配置阶段就已经打印了。没错，这就是一个`配置型Task`，因为Gradle在任务执行前，总会去遍历所有任务去生成一张DAG来确定任务之间的关系。

如果不想让任务在配置阶段执行，那么可以参照如下方式，通过给任务添加action的方式使其在执行阶段运行。

```groovy
task helloTask {
    doLast {
        println "Hello World"
    }
}
```

常用的action有两个，doFirst和doLast，通过这两个见名知意的action可以用来定置化你的任务行为。



- l 一个Task包含若干Action。所以，Task有doFirst和doLast两个函数，用于添加需要最先执行的Action和需要和需要最后执行的Action。Action就是一个闭包。
- l Task创建的时候可以指定Type，通过*type:名字*表达。这是什么意思呢？其实就是告诉Gradle，这个新建的Task对象会从哪个基类Task派生。比如，Gradle本身提供了一些通用的Task，最常见的有Copy 任务。Copy是Gradle中的一个类。当我们：*task myTask(type:Copy)*的时候，创建的Task就是一个Copy Task。
- l 当我们使用 taskmyTask{ xxx}的时候。花括号是一个closure。这会导致gradle在创建这个Task之后，返回给用户之前，会先执行closure的内容。
- l 当我们使用taskmyTask << {xxx}的时候，我们创建了一个Task对象，同时把closure做为一个action加到这个Task的action队列中，并且告诉它“最后才执行这个closure”（*注意，<<符号是doLast的代表*）。

当用户执行test任务时，执行以下步骤：  1. 执行build.gradle，初始化任务，初始化步骤为2-7;  2. 注册test任务，任务体都是默认好的，不可更改，为打印冒号加任务名，所以test的任务体为`println ':test'`；  3. 每个任务都有一个队列一个栈，一个是依赖队列，一个是first栈，一个是last队列；  4. 遇到doFirst函数，该函数接受一个闭包作为参数，doFirst函数会把闭包参数放入first栈；  5. 遇到doLast函数，同理doFirst函数，闭包参数会被放入last队列；  6. 然后遇到`println 'hello.'`，执行该指令//1；  7. 至此初始化过程完成。  8. 开始执行test任务前，先检查是否任务依赖，如果有，先把依赖的任务都执行完。  9. 然后开始执行test任务；  10. 执行时，首先执行test任务的任务体，即`println ':test'`；  11. 然后执行test任务的first栈//2和last队列//3；  12. 任务执行结束。 