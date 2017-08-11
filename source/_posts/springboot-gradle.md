---
title: 采用Gradle快速构建基于Spring boot的MVC应用
author: PKAQ
date: 2016-12-13 15:01:06
tags: ['Spring-boot','Gradle']
categories: spring-boot
---

　　`Spring boot`是用以简化`Spring`配置开发的一枚框架，采用`Spring boot`可以抛弃繁琐的XML配置，采用`JavaConfigure`的方式进行快速配置。同时该框架提供了包含预配置的众多的`starter`可以极大的简化配置工作量。下面的代码便是采用`web-starter`和`Gradle`进行快速创建一个mvc应用的示例。

<!-- more -->
#### 目录结构
![](structure.jpg)

#### 引入依赖
```groovy
apply plugin: "war"
// 版本号
ext {
    bootVersion = "1.4.2.RELEASE"
    tomcat_embed = "8.5.4"
}
// 仓库配置
repositories {
    maven { url"https://repo.spring.io/libs-release" }
    jcenter()
    mavenCentral()
}
// 依赖配置
dependencies {
    compile "org.springframework.boot:spring-boot-starter-web:${bootVersion}",
            "org.apache.tomcat.embed:tomcat-embed-jasper:${tomcat_embed}"            
}
```
#### 个性化配置
　　如果你采用的是标准目录结构，那么可以通过在`src/main/resources`下创建`application.yaml`文件对预配置项进行修改，无论是在`IDEA`还是在`STS`中，编辑此文件输入`spring.`都会有相应的代码提示，相关配置项的名字基本也是见名知意，大家可以自己去体会一下。当然你也可以`ctrl+click`查看下源码做深入了解。
```yaml
spring:
  mvc:
    date-format: yyyy-MM-dd
    view:
       prefix: /WEB-INF/web/
       suffix: .jsp
```
#### 启动类配置
```java
@SpringBootApplication
public class Booter implements CommandLineRunner {
    /**
     * 入口函数.
     * @param args args
     */
    @Autowired
    public static void main(String[] args) {
        SpringApplication.run(Booter.class, args);
    }

    public void run(String... args) throws Exception {
        System.out.println("  --- --- --- [ web started ] --- --- ---  ");
    }
}
```
#### 一个示例controller
　　这里需要注意，如果没有配置 `ComponentScan` 指定扫描的包，`controller` 应该放在启动类的同级或者子包下，否则无法扫描到相应的Bean。
```java
@Controller
public class TigerController {
    @RequestMapping("/tiger")
    public ModelAndView tiger(){
        return new ModelAndView("Tiger","tigerName","Scott");
    }
}
```
#### view页面
　　无他，JSP尔。
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Hello Spring MVC</title>
</head>
<body>
Tiger's name is : ${tigerName}
</body>
</html>

```