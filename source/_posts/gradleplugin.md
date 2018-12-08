---
title: 为Gradle创建一个自定义插件
author: PKAQ
date: 2018-12-08 08:33:56
tags: ['Gradle']
categories: ['Build Tools']
---



# 概述

　 在对`Gradle`有了一定的了解后，你会发现通过使用Gradle的内置任务以及各种插件可以轻松地达成构建目标，例如使用了`war`插件后，无需编写任何`Task`即拥有了打`war`包的能力。大多数情况下，官方提供的插件和众多第三方插件可以满足你的绝大部分需求，但或许你也想为团队提供一个定制化功能的插件。本章节就是来讲解如何编写、发布一个自定义插件来实现`Gradle`功能的扩展。

<!-- more -->

# 目录结构

　 在前面的章节已经介绍了`如何自定义一个Task`，编写插件其实与之类似，也可以把插件看作为若干任务的包装器。甚至方式也与编写一个`Task`相同，你可以选择把插件代码直接编写到脚本中或者作为一个独立的工程发布出去。出于可维护性、易用性等方面的考虑，本章节只介绍如何采用独立工程的方式编写插件。

　 一个插件工程的目录结构与一个普通的`java`工程一致，你可以选择使用Java或者Groovy来作为插件的实现。

```tex
|-src   
	|-main   
		|-java
        |-groovy
		|-resources   
			|-META-INF   
	|-test   
		|-java 
        |-groovy
		|-resource  

```

# 如何开始

　 接下来我们便携与一个名为`org.pkaq.foLeng`的插件，来描述一个插件编写的步骤，该插件提供一个名为`mlfl`的`Task`，该`Task`可接受一个名为`words`的输入属性，运行插件任务后会在控制台显出佛祖真身，保佑你的代码不受`bug`侵扰。

　 该插件主要有三部分：任务定义、插件定义、插件的扩展属性。

　 开始编写之前你需要引入`Gradle`相关依赖:

```groovy
dependencies {
    compile localGroovy() 
    compile gradleApi() 
}
```



## 1.任务定义

　 首先定义一个插件任务，方式与`如何自定义一个Task`提到的方式相同。只需继承`DefaultTask`类，并添加相应注解即可。`@Input`定义了该任务接受一个名为`words`的入参，`@TaskAction`注解了`Task`的行为，表示该`Task`调用时将执行注解动作。该动作执行后会在控制台打印出佛祖真身以及输入的参数。

```groovy
package org.pkaq

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction

class FoLengTask extends DefaultTask {
   @Input
    String words = 'Hello'

    FoLengTask(){
       description = "Mai Le FoLeng?"
       group = "FoLeng"
    }

    @TaskAction
    void mlfl() {
        // 获取输入的属性
        words = getWords()
        println '''
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\\  =  /O
               ____/`---'\\____
             .'  \\\\|     |//  `.
            /  \\\\|||  :  |||//  \\
           /  _||||| -:- |||||-  \\
           |   | \\\\\\  -  /// |   |
           | \\_|  ''\\---/''  |   |
           \\  .-\\__  `-`  ___/-. /
         ___`. .'  /--.--\\  `. . __
      ."" '<  `.___\\_<|>_/___.'  >'"".
     | | :  ` - `.;`\\ _ /`;.`/ - ` : | |
     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /
======`-.____`-.___\\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            佛祖保佑       永无BUG

            '''
        println "            < -   ${words}   ->"
    }
}
```



## 2.扩展属性

　 为插件添加一个名为`words`的扩展属性。这样我们在插件发布后可以采用定义的扩展容器来方面的设定插件的各类参数。

```groovy
package org.pkaq

// 扩展属性
class FolengExtension {
   String words
}
```

## 3.插件定义

　 定义插件只需实现`Plugin`接口即可，该接口只提供了一个方法：`void apply(Project project)；`。由`DefaultTask`继承而来的`Task`都有一个`conventionMapping`属性，通过这个属性可以将扩展模型的值赋值给`Task`的`@Input``@Output`参数。



```groovy
package org.pkaq
import org.gradle.api.Plugin
import org.gradle.api.Project

class FoLengPlugin implements Plugin<Project>{
	@Override		
    void apply(Project project) {
        /**注册一个扩展容器，扩展容器可以使我们在一个闭包中为task赋值*/
        project.extensions.create('foleng', FolengExtension)
        folengTask(project)
    }

    private void folengTask(Project project){
        project.tasks.withType(FoLengTask) {
            /**查找扩展容器中已配置的属性*/
            def extension = project.extensions.findByName('foleng')
            /**将闭包中的扩展属性值赋给 FoLengTask 的相关属性*/
            conventionMapping.words = { extension.words }
        }
        project.task('mlfl', type: FoLengTask) {
            conventionMapping.words = {
               project.hasProperty('words') ?
                       project.words :
                       project.extensions.findByName('foleng').words
            }
            doLast {
                println ' The End '
            }
        }
    }
}
```



# 发布插件

　 　 至此已经完成了一个简单插件的编写，默认情况下插件的ID与工程的名称是一致的，如果要改变这个默认规则可以在`src/main/resources/META-INF/gradle-plugins`下新建一个`pluginId.properties`的文件，该文件的名称即为插件的`id`，在插件发布后可通过`apply plugin:id`来引入插件。内容如下：

```properties
implementation-class=org.pkaq.FoLengPlugin
```

### 发布到maven仓库　 　 

　 　 现在可以把编写好的插件发布到`Maven`仓库来使用了。不过在发布之前可以通过使用`gradle assemble `本地打包测试一下。只需要将打包后的`jar`放到需要调用插件的工程内，通过本地文件仓库的形式引入即可。关于如何上传到`Maven`仓库，请查阅`打包与发布章节`进行详细了解。这里使用了maven插件简单的发布到了本地目录中。

```
apply plugin: 'maven'
// 发布插件到本地目录
uploadArchives {
    repositories {
        mavenDeployer {
             repository(url: uri('/opt/repo'))
        }
    }
}
```

　 　 使用插件

```
buildscript {
	repositories { flatDir name: 'libs', dirs: "libs" }	
    dependencies {
        classpath 'org.pkaq:plugin:1.0'
    }
}
//应用插件
apply plugin: 'org.pkaq.foLeng'

foleng {
	words = 'Tom'
}
```

###  发布到`Gradle Plugin Portal`　 　

 　 　 为了便于插件的推广和检索，更好的形式是将编写好的插件上传到`Gradle Plugin Portal`，上传到`Gradle Plugin Portal`只需如下几步即可。

1. 创建一个Gradle账户和Key获取
2. 配置相关Key和发布参数到Gradle脚本

　 　 注册登录后在个人中心界面可以看到`API Key`的标签页，复制key和secret后保存到`gradle.properties`中即可。

```properties
gradle.publish.key=foo
gradle.publish.secret=bar
```

　 　 脚本配置，首先应用`Gradle`提供的发布插件，然后针对插件参数进行配置。如图该插件提供了见名知意的属性这里不做过多赘述。

```
plugins {
    id 'java-gradle-plugin'
    id 'com.gradle.plugin-publish' version '0.10.0'
}

pluginBundle {
    website = 'https://github.com/GradleCN/GradleSide'
    vcsUrl = 'https://github.com/GradleCN/GradleSide'
    tags = ['买了佛冷', 'pluginlearn']
}
gradlePlugin {
    plugins {
        foLeng {
            id = 'org.pkaq.foLeng'
            displayName = 'Mai le fo leng?'
            description = '<a plugin demo>'
            implementationClass = 'org.pkaq.FoLengPlugin'
        }
    }
}
```



---

完整脚本如下

```groovy
plugins {
    id 'java-gradle-plugin'
    id 'com.gradle.plugin-publish' version '0.10.0'
}
apply plugin: 'groovy'
apply plugin: 'maven'

group = 'org.pakq'
archivesBaseName="plugin"
version = '1.0'

pluginBundle {
    website = 'https://github.com/GradleCN/GradleSide'
    vcsUrl = 'https://github.com/GradleCN/GradleSide'
    tags = ['买了佛冷', 'pluginlearn']
}
gradlePlugin {
    plugins {
        foLeng {
            id = 'org.pkaq.foLeng'
            displayName = 'Mai le fo leng?'
            description = '<a plugin demo>'
            implementationClass = 'org.pkaq.FoLengPlugin'
        }
    }
}

repositories {
    mavenCentral()
}
dependencies {
    compile localGroovy() 
    compile gradleApi() 
}
// 发布插件到本地目录
uploadArchives {
    repositories {
        mavenDeployer {
             repository(url: uri('/opt/repo'))
        }
    }
}
```

