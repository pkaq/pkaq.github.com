---
title: 使用Gradle按不同环境打包项目
author: PKAQ
date: 2017-08-09 12:49:36
tags: [Gradle]
categories: Build Tools
---

## 0.概述
在项目开发过程中，开发\测试\生产环境都是独立存在的。在上古时代，猿们通过打包时或者开发时手工修改配置文件的方式来区分生产环境和开发环境。显然这种方式是比较低效且lowbee的；到了`maven`时代，可以通过定义不同的`profile`来实现对不同环境的打包，这一下把程序猿从关闭/打开不同环境注释的桎梏中解救了出来。`Gradle`虽然没有`maven`的`profile`机制,但仍然可以通过多种方式实现对不同环境的打包。
1.通过动态加载不同环境资源文件实现环境包
2.通过`ConfigSlurper`特性实现环境包

<!-- more -->

## 1.通过动态加载不同环境资源文件实现环境包

根据不同环境的参数建立不同的环境文件，打包时只打包相应的环境文件
把环境参数配置到x.properties文件中，打包时从文件中读取相应参数动态修改配置文件
下面的姿势是选取的第一种，在src/main/resources按不同环境建立相应的folder,打包时将不需要环境文件排除掉。当然我这里只是一个示例，实际情况可以自行修改代码实现，比如如果不想保留环境目录直接把环境文件打包到src/main/resources，则直接把环境目录追加到srcDir下即可

执行下面的命令打相关环境的包
```shell
gradle -q -Penv=pro
```
可以修改gradle.properties中的env默认值

gradle.properties
```properties
env=dev   
```
这种方式是直接将环境包目录下的文件打包到resources根目录下的方式   
build.gradle   
```groovy
apply plugin: 'java'   


sourceSets {    
    main {
        resources {
            srcDir "src/main/resources/${env}"
            
            sourceSets.main.resources.srcDirs.each   {      
                it.listFiles().each {
                     if(it.isDirectory()) {        
                        exclude "${it.name}"
                    }
                }                   
            }
        }
    }
}   
```
------------------ ------------------ wei suo fen ge xian ------------------ ------------------

下面这种是保留环境包目录的方式
build.gradle
```groovy
apply plugin: 'java'

sourceSets {    
    main {
        resources {
            sourceSets.main.resources.srcDirs.each   {      
                it.listFiles().each {
                     if(it.isDirectory() && it.name != "${env}") {
                        println "exclude ${it.name}"       
                        exclude "${it.name}"
                    }
                }                   
            }
        }
    }
}
```
## 2.利用ConfigSlurper进行不同环境构建

　　除了通过传入参数加载不同目录下的properties文件来实现多环境打包之外,还有一种更便捷的方式来实现这种操作.    
借助Groovy的[ConfigSlurper](http://docs.groovy-lang.org/latest/html/gapi/groovy/util/ConfigSlurper.html#method_detail)特性可以简洁而明快的达到多环境打包的目的.打包时候仅需通过`-D`参数传入目标环境变量即可如:`gradle build -Denv=dev`,这里可以通过添加`gradle.properties`文件设置默认的环境变量值.

比如当前有如下需求:   

- 需要根据传入的变量参数进行不同环境打包
- 需要根据不同环境参数改变esources目录下属性文件\xml文件等文件的内容


1.与`build.gradle`平级建立`config.groovy`,这里的命名可以随意.

```groovy
environments {
    // 开发环境
    dev {
        db {
            username = "dev"
            password = 'devpwd'
        }        
    }
    // 线上环境
    production { 
        db {
            username = "prod"
            password = 'prodpwd'
        }        
    }
}
```
2.修改`build.gradle`
```groovy
//引入ReplaceToken
import org.apache.tools.ant.filters.ReplaceTokens
//处理资源文件时进行加载替换
processResources {
    println "==> Load configuration for $env"
    def config =  new ConfigSlurper(env).parse(file("config.groovy").toURI().toURL()).toProperties()
    
    from(sourceSets.main.resources.srcDirs) {
       filesMatching('**/*.properties') {
        filter(ReplaceTokens, tokens: config, beginToken : '${', endToken : '}')
       }
    }
    
}
```
　　默认情况下`ReplaceTokens`会将`@attribute@`的值替换成目标值,这里我们修改占位描述符为`${attribute}`

　　经过上面的操作,在执行打包命令时,`Gradle`会加载`config.groovy`文件中的配置对`src/main/resources`资源目录下的资源文件进行替换,注意这里替换的是所有资源文件(properties/xml/txt等)中的占位符,如果只想替换`properties`文件可以添加过滤限制来实现对部分文件内容的替换   

法1.
```groovy
  from(sourceSets.main.resources.srcDirs) {
       filesMatching('**/*.properties') {
        filter(ReplaceTokens, tokens: config, beginToken : '${', endToken : '}')
       }
    }
```
法2.
```groovy
  from(sourceSets.main.resources.srcDirs) {
        include '**/*.properties'       
        filter(ReplaceTokens, tokens: config, beginToken : '${', endToken : '}')
    }
```

完整代码在此:   
https://github.com/GradleCN/GradleSide/tree/master/12-env/02-configfile

