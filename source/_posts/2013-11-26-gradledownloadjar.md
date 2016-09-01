title: 使用gradle下载jar包
date: 2013-11-26 10:29:48
tags: ['Gradle']
categories: Gradle
author: PKAQ
---
如题 建立build.gradle文件如下：

```groovy
 apply plugin: 'java'
 
 repositories {
     mavenCentral()
 }

 dependencies {
	/**spring版本号**/
    def springVersion = "3.2.4.RELEASE"
    compile  "org.springframework:spring-webmvc:${springVersion}",
              "org.springframework:spring-jdbc:${springVersion}",
              "org.springframework:spring-tx:${springVersion}"
 }
 
 task copyJars(type: Copy) {
   from configurations.runtime
   into 'lib' // 目标位置
 }
```
<!-- more -->
然后控制台执行
```groovy
	gradle -q copyJars
```

好了去寻找吧 泰罗