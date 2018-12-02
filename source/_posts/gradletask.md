---
title: Gradle中的任务
author: PKAQ
date: 2018-08-12 17:24:15
tags: ['Gradle']
categories: ['构建']
---

　　`Project`和`Task`是`Gradle`中最核心的两个元素，当创建了一个`build.gradle`脚本那么`Gradle`便会依据脚本的配置创建一个`Project`,而脚本中的`Task`也会创建与之相对应`DeafultTask`实现。

　　`Gradle`通过一个个`Task`来完成具体的构建任务 ,可以说`Task`乃是`Gradle`的核心。根据执行阶段的不同，可以将`Gradle`中`Task`分为`配置型Task`以及`动作型Task`。

## 一、Task的基本组成

　　查看`Task DSL`说明我们可以发现，通常一个`Task`包括: 依赖、动作、属性、输入、输出、终结器等构成。

当然这些并不是每一个都是必须的。创建任务的时候需要根据自己的具体需要进行选择性配置。



<!-- more -->

## 二、定义Task

　　`Gralde`中定义一个任务的方式十分灵活，下面都是定义一个任务的方式。

```groovy
task myTask
task myTask { configure closure }
task myTask(type: SomeType)
task myTask(type: SomeType) { configure closure }
```



### 配置型Task

　　定义一个`Task`十分简单，只需要使用`task name{}`即可定义一个简单的任务。

```groovy
task helloTask {
    println "Hello World"
}
```

　　执行`gradle hT`，可以观察到执行结果。这里你可能会注意到`Hello world`并非在执行阶段开始执行的,而是在配置阶段就已经打印了。没错，这就是一个`配置型Task`，因为Gradle在任务执行前，总会去遍历所有任务去生成一张`DAG(有向无环图)`来确定任务之间的关系。

###动作型Task

　　如果不想让任务在配置阶段执行，那么可以参照如下方式，通过给任务添加action的方式使其在执行阶段运行。

```groovy
task helloTask {
    doLast {
        println "Hello World"
    }
}
```

常用的action有两个，`doFirst`和`doLast`，通过这两个见名知意的`action`可以用来定置化你的任务行为。



- 一个Task包含若干`Action`。所以，Task有`doFirst`和`doLast`两个函数，用于添加需要最先执行的`Action`和需要和需要最后执行的`Action`。`Action`就是一个闭包。
-  Task创建的时候可以指定Type，通过*type:名字*表达。这是什么意思呢？其实就是告诉`Gradle`，这个新建的Task对象会从哪个基类Task派生。比如，Gradle本身提供了一些通用的Task，最常见的有Copy 任务。Copy是Gradle中的一个类。当我们：`*task myTask(type:Copy)*`的时候，创建的Task就是一个Copy Task。
-  当我们使用 `task myTask{ xxx}`的时候。花括号是一个`closure`。这会导致gradle在创建这个Task之后，返回给用户之前，会先执行closure的内容。

  

当用户执行test任务时，执行以下步骤：  

1. 执行build.gradle，初始化任务，初始化步骤为2-7; 
2. 注册test任务，任务体都是默认好的，不可更改，为打印冒号加任务名，所以test的任务体为`println ':test'`；  
3. 每个任务都有一个队列一个栈，一个是依赖队列，一个是first栈，一个是last队列；  
4. 遇到doFirst函数，该函数接受一个闭包作为参数，doFirst函数会把闭包参数放入first栈； 
5. 遇到doLast函数，同理doFirst函数，闭包参数会被放入last队列；  
6. 然后遇到`println 'hello.'`，执行该指令//1；  
7. 至此初始化过程完成。 
8. 开始执行test任务前，先检查是否任务依赖，如果有，先把依赖的任务都执行完。 
9. 然后开始执行test任务；  
10. 执行时，首先执行test任务的任务体，即`println ':test'`；  
11. 然后执行test任务的first栈//2和last队列//3；  
12. 任务执行结束。 

## 三、Task中属性的应用

### 分组

　 `DeafultTask`提供了很多方便的属性，灵活运用这些属性可以让你更加灵活的配置自己的`Task`。如：在`IDEA`等编辑器中我们查看`Gradle`任务时，任务都是放在各个任务组下面的，这便是借助任务属性中的`group`属性实现的。如果在创建任务时没指定这个属性，那么任务会默认分配到`other tasks`分组。

```groovy
task mytask{
    group: 'build'
     doLast {
        println "Hello World"
    }
}
```

### 依赖

　 由于`Gradle`中任务的执行顺序是不确定的，当你需要按顺序执行某些任务时，可以通过`dependsOn`、`mustRunAfter`、`finalizedBy`等定义任务之间的依赖关系来达到让任务按顺序执行的目的。看下面的例子。

```groovy
task one{
	group 'timo'
     doLast {
        println "Hello frist"
    }
}
task two(dependsOn: one){
     doLast {
        println "Hello two"
    }
}
task three{
	dependsOn two
     doLast {
        println "Hello three"
    }
}
task four{
	 mustRunAfter three
     doLast {
        println "Hello four"
    }
  
}
// TASK THREE执行完后必然执行four
three.finalizedBy four

```



### 跳过

　 有时为了节约构建时间我们需要跳过某些任务的执行，此时可以通过指定`enabled`属性的方式来跳过某些任务的执行。

　 当然，在执行时候通过命令行参数`-x taskname`也可以达到相同的效果。

　 为了提高构建的速度，Gradle在执行任务时都会检查任务的输入与输出，如果输入输出相对上次构建没有变化那么会将此任务标记为`UP-TO-DATE`来跳过任务的执行。当然你也可以通过`inputs`和`outputs`的`upToDateWhen{}`来控制这种行为。

```groovy
task one{
	enabled false
    doLast{
         println "Hello frist"
    }
}
task two(dependsOn:one){
    doLast{  
         println "Hello two"
    }

}

task three{
    dependsOn two
     doLast {
        println "Hello three"
    }
}

```

### 动态任务

　 得益于`Gradle`基于`groovy`的`dsl`可以方便的定义一个动态任务。

```groovy
4.times { counter ->
    task "task$counter" {
        doLast{
       	 println "I'm task number $counter"
        }
    }
}
```



## 类型任务

　` Gradle`及其各种插件提供了许多内置的任务类型，我们可以直接创建需要的类型任务来实现一些自定义效果。下面的代码创建了一个`Copy`类型的任务。`Copy`任务实现了`CopySpec`接口，通过查阅`CopySpec`的API说明我们可以自定义该任务的属性和方法的实现。

```groovy
task copyTask(type: Copy) {
    from '.'
    into 'abc'
    include 'in.txt'
}
```



## 四、自定义任务

　 在`Gradle`中自定义一个任务是十分方便的，只需要编写一个继承自`DefaultTask  `的类即可。你可以直接在你的脚本文件中编写，也可以放到`buildSrc`中，当然出于可维护性的考虑以及视觉上的感受更推荐后者的方式。

　 若要在`buildSrc`下定义，只需要在`build.gradle`同级目录创建``buildSrc``并把任务类放在`src\main\java`或`src\main\groovy`下即可。

```groovy
// 直接在脚本文件中定义自定义任务
class Inner extends DefaultTask {
    String words = 'Inner'

    @TaskAction
    def action1() { println words + name }

    @TaskAction
    def action2() { println words + ' InnerTom'  }
}

// 使用buildSrc下定义的任务
task say(type: Hello) {
    words = 'Aloha '
    doFirst { println 'fisrt blood' }
    doLast { println 'double kill' }
}

task sayIn(type: Inner) {
    words = 'Aloha Inner '
    doFirst { println 'Inner blood' }
    doLast { println 'Inner kill' }
}
```

