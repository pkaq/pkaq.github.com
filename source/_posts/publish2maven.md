---
title: 使用Gradle发布Jar包到Maven Repository
author: PKAQ
date: 2021-06-07 09:33:24
tags: ['Gradle','Maven']
categories: ['Gradle']
---

# 概述
由于Jcenter已经停止了服务，之前发布到Jcenter的构件需要转移到Maven仓库中。
在开始之前，先对OSSRH做下了解是很必要的，因为一开始，我并不知道这是个啥玩儿意。我想和我一样的人应该还是有很多的。
OSSRH：Sonatype Open Source Software Repository Hosting Service，为开源软件提供maven仓库托管服务。你可以在上面部署snapshot、release等，最后你可以申请把你的release同步到Maven Central Repository（Maven中央仓库）。

个人的理解，OSSRH是Maven中央仓库的前置审批仓库，只有你完全符合了发布要求，成功的将你的项目发布到了OSSRH，才有机会申请同步到Maven中央仓库。

<!--- more --->
# 一、申请group id

1. **注册Sonatype JIRA账号**

网址：https://issues.sonatype.org/

无非就是填写下注册信息，没有什么特别的

2. **创建一个Issue**
填写资料
可以在头部看到一个Create的按钮
![1](1.png)
sonatype-create-issue-button

会弹出Create Issue表单
![2](2.png)
sonatype-create-issue-form

- Project：选择Community Support - Open Source Project Repository Hosting (OSSRH)
- Issue Type：选择New Project
- Summary：写个标题做个简单概述你要做啥。真不知道写什么，直接把项目名称写上就行，我就这么干了哈。
    Group Id：
    自己有域名
    可以使用子域名作为Group Id 。例：我的项目叫paladin2，那么就用org.pkaq作为Group Id

    注意：不能瞎编一个，因为后面审核人员会来审核你是否是该域名的拥有者
    自己没域名
    可以借助github，例：我的用户名为michaelzx，那么就用com.github.pkaq.eva作为作为Group Id
    Project URL：要与Group Id一定关联性
    例：
    Project URL=https://github.com/pkaq/eva
    Group Id=com.github.pkaq.eva
- SCM url：版本仓库的拉取地址

3. **等待回复**
如果有问题，老外在评论中把问题给你指出来，可以在原有的issue把资料改正确

审核人员要处理的issue很多，你可能要耐心等待一会，不要急
我之前急了，就重新提交了2个新的issue，最后管理员还是耐心的把重复的issue关闭
如果一切顺利，那么你会收到审核人员，这样的一个评论：
![3](3.png)

这里我使用了自己的域名，如果使用自己的域名，需要解析一个TXT记录到你提交的这个issue来证明你是这个域名的持有人即可。

# 二、准备工作
为了确保中央存储库中可用组件的质量水平，OSSRH对提交的文件有明确的要求。

一个基础的提交，应该包含一下文件：
```
example-application-1.4.7.pom
example-application-1.4.7.pom.asc
example-application-1.4.7.jar
example-application-1.4.7.jar.asc
example-application-1.4.7-sources.jar
example-application-1.4.7-sources.jar.asc
example-application-1.4.7-javadoc.jar
example-application-1.4.7-javadoc.jar.asc
```

除了jar包和pom文件，Javadoc和Sources是必须的，后面会说到用Gradle的一些插件来生成
每个文件都有一个对应的asc文件，这是GPG签名文件，可以用于校验文件


**GPG**
Windows下如果使用了cmder那么,cmder已经集成了gpg命令工具

**公钥、私钥、签名**
GPG的默认秘钥类型是RSA，这里涉及涉及几个概念公钥（public-key）、私钥（secret-key）、签名(sign/signature)

- 公钥和私钥是成对
- 公钥加密，私钥解密。
- 私钥签名，公钥验证。

**新建一个密钥**
生成了密钥以后，才能导出公钥、私钥
```bash
	gpg --generate-key
```
创建的时候，会让你输入密码，别输了以后忘记了，后面gradle插件中会用到。

**查看已经生成的密钥**
```bash
	gpg -k
```
![4](4.png)
- pub下面第二行, 936DDBCE5B649E51D37464283F199C01AE4240A5，这个叫做密钥指纹(应该是用来做唯一识别)
- 后面8位DF855F85,叫做标识或KEY ID，在后面需要加到Gradle插件配置中

**导出私钥文件**
```bash
	gpg --export-secret-keys [密钥指纹] > secret.gpg
```
以上命令就可以生成一个二进制的私钥文件，后面需要配置到gradle中，让插件帮我们给文件批量签名

加上-a会生成一个用ASCII 字符封装的文本文件，方便复制,不过我们这里不需要

**上传公钥到公钥服务器**
```bash
	gpg --keyserver keyserver.ubuntu.com --send-keys [密钥指纹]
```

在sonatype的仓库提交后，会需要一个校验步骤
会需要从多个公钥服务器上下载匹配的公钥，然后来校验你上传的文件的签名

简单的说，你用来签名的私钥和你上传的公钥，必须要一对，这样才能通过校验

以下是sonatype会去拉取的公钥服务器列表

```
keys.gnupg.net
pool.sks-keyservers.net
keyserver.ubuntu.com
```
为什么我要特意列出来？
因为有些文章或教程里面，都仅给出了一个服务器，如pool.sks-keyservers.net
但是，我在实际操作有时候因为网络原因，并不是总能成功上传。
所以，如果把公钥上传到keyserver.ubuntu.com也是OK的。

**总结**
- 密钥的key id
- 密钥的password
- 私钥的KeyRingFile
- 公钥上传到了公钥服务器
准备好了以上几项，我们就可以开始撸Gradle了

# 三、编制发布脚本
主要依赖于两个插件：
- signing
- maven-publish

注: maven插件已经过时

编写发布脚本，在工程下新建。`publish.gradle`

```gradle
ext.'signing.keyId'='AE4240A5'
ext.'signing.password'='sai18109'
ext.'signing.secretKeyRingFile'='D:/keys/maven_publish_secret.gpg'
ext.ARTIFACTORY_USER='OSSRH用户名'
ext.ARTIFACTORY_PASSWORD='OSSRH密码'
ext.ARTIFACTORY_CONTEXTURL='https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/'
ext.LOCAL_ARTIFACTORY_USER='本地私服用户名'
ext.LOCAL_ARTIFACTORY_PASSWORD='本地私服密码'
ext.LOCAL_ARTIFACTORY_CONTEXTURL='本地地址'

//#GAV
ext.GROUP='org.pkaq'

//#项目地址相关
ext.POM_URL='http://pkaq.org'
ext.POM_SCM_URL='项目地址'
ext.POM_SCM_CONNECTION='项目地址'
ext.POM_SCM_DEV_CONNECTION='项目地址'

//#项目相关信息
ext.GIT_URL='项目git地址'
ext.ISSUE_URL='issue提交地址'
ext.POM_PACKAGING='jar'
ext.POM_DESCRIPTION='项目描述'

//#开源协议
ext.POM_LICENCE_NAME='The Apache Software License, Version 2.0'
ext.POM_LICENCE_URL='http://www.apache.org/licenses/LICENSE-2.0.txt'
ext.POM_LICENCE_DIST='repo'

//#开发者信息
ext.POM_DEVELOPER_ID='PKAQ'
ext.POM_DEVELOPER_NAME='开发者名称'
ext.POM_DEVELOPER_EMAIL='pkaq@msn.com'
ext.POM_DEVELOPER_URL='http://pkaq.org'

task sourcesJar(type: Jar) {
    from sourceSets.main.allJava
    archiveClassifier = 'sources'
}

task javadocJar(type: Jar) {
    from javadoc
    archiveClassifier = 'javadoc'
}


javadoc {
    options {
        encoding "UTF-8"
        charSet 'UTF-8'
    }

    if(JavaVersion.current().isJava9Compatible()) {
        options.addBooleanOption('html5', true)
    }
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            // groupId,artifactId,version，如果不定义，则会按照以上默认值执行
            // groupId 必须于maven repo申请的group Id一致
            groupId GROUP
			
			afterEvaluate {
				artifactId project.archivesBaseName
			}

			artifact sourcesJar
            artifact javadocJar

			pom {
                name = artifactId
                description = provider { project.description }
                url = POM_URL
                // 许可证
                licenses {
                    license {
                        name = POM_LICENCE_NAME
                        url = POM_LICENCE_URL
                    }
                }
                // 开发者信息
                developers {
                    developer {
                        id = POM_DEVELOPER_ID
                        name = POM_DEVELOPER_NAME
                        email = POM_DEVELOPER_EMAIL
                    }
                }
                // 版本控制仓库地址
                scm {
                    connection = POM_SCM_CONNECTION
                    developerConnection = POM_SCM_DEV_CONNECTION
                    url = POM_SCM_URL
                }
            }		        		
        }
    }
    // 定义发布到哪里
	repositories {
        maven {
           url = ARTIFACTORY_CONTEXTURL
            // 这里就是之前在issues.sonatype.org注册的账号
            credentials {
                username ARTIFACTORY_USER
                password ARTIFACTORY_PASSWORD
           }
        }
        // 本地私服
//        maven {
//            name "local"
//            url = LOCAL_ARTIFACTORY_CONTEXTURL
//            allowInsecureProtocol = true
//            credentials {
//                username LOCAL_ARTIFACTORY_USER
//                password LOCAL_ARTIFACTORY_PASSWORD
//            }
//        }
    }
}

signing {
    sign publishing.publications
}
```
在`build.gradle`中引入发布脚本
```gradle
# 由于publish.gradle中有诸多敏感信息,不建议提交此文件,为了防止其他人报错,这里可以写一个判断.
# 如果一定要提交也可以将敏感信息存储到环境变量中,由环境变量获取
if (project.file('publish.gradle').exists()) {
    apply from: 'publish.gradle'
}
```
# 四、构件上传

首先，用Gradle执行publishToMavenLocal任务，先在本地发布下，看看生成了哪些文件，或还有什么问题

然后，用Gradle执行publish任务，发布到指定的maven仓库

如果没有报错，那么恭喜你，已经成功提交到了sonatype的仓库中

但是提交成功，并不代表发布成功, 上传完成后去你之前提的 ISSUE 中回复一下官方人员 告诉他你已经上传好了, 之后他会给你审核,并且告诉你一个地址
```
I have already completed the first release.
```

# 五、构件发布
用你之前注册的账号密码，登录官方人员给你的回复里的地址
![5](5.png)
登录后查看左侧的Build Promotion->Staging Repositories

你的提交，会出现在最下面. Staging Repositories 中😂
![6](6.png)

**Close**
你的提交在未处理前，是open状态，然后点击Close按钮。

一开始不太明白这个Close是啥意思，后来看了下，主要按照中央仓库的要求来验证下你上传到文件
签名就是其中一个步骤，会去公钥服务器拉取公钥，然后来验证你所有的文件
需要等待一会，等它执行完毕，状态会从open变成closed

如果碰到错误的话，仔细看下Activity选项卡，执行了什么步骤，那个步骤出现了什么错误，很清晰的
**Release**
一般情况下，感觉如果顺利close后，再次选中点击Release，耐心等待一会，就大功告成了！

可以在侧边栏Artifact Search中搜索下你的groupId，此时应该能看到对应的构件名称和版本了

# 六、常见问题
如果不想让某个模块参与发布，可以添加如下代码
```bash
project.tasks.publish.enabled = false
```