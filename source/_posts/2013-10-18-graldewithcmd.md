title: 使用Gradle调用CMD
date: 2013-10-18 11:04:56
tags: ['Gradle']
categories: Gradle
author: PKAQ
---
关于如何使用gradle调用命令行来执行一些命令可以参考如下脚本进行修改扩展

build.gradle
```groovy
task javaVersion(type:Exec) {
  //这里在windows下一定要加/c参数 ,否则会报错,/c是 执行字符串指定的命令然后终止
  commandLine 'cmd', '/c', 'java -version'
  //执行结果
  if(null == execResult){
	println 'exec failed'
  }else{
	println 'exec successed'
  }
  //store the output instead of printing to the console:
  standardOutput = new ByteArrayOutputStream()

  //extension method stopTomcat.output() can be used to obtain the output:
  ext.output = {
    return standardOutput.toString()
  }
}
```
<!-- more -->
控制台调用
```shell
	gradle -q jV
```

具体可以查看官方API
[调用命令行](http://www.gradle.org/docs/current/dsl/org.gradle.api.tasks.Exec.html)

P.S:感谢gradle群中的 小和尚 提出和发现了此问题的解决方式