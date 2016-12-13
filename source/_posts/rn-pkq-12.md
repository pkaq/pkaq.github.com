title: RN（react native）入坑指南-12,打正式签名包和发布
date: 2016-04-24 12:36:07
tags: ['React Native']
categories: ['React Native']
author: PKAQ
---

**0.启动打包服务器**
首先执行
react-native start启动打包服务器,此时可以通过chrome打开`http://localhost:8081/index.android.bundle?platform=android`请求获取打包后的js文件,该文件是通过分析rn代码动态生成的,包含了应用中的全部逻辑.
<!-- more -->
**1.生成签名秘钥**
用JDK自带的keytool工具生成证书：
```shell
	keytool -genkey -v -keystore app-key.keystore -alias app-alias -keyalg RSA -keysize 2048 -validity 10000
``` 

<!-- more -->

> Keytool 是一个Java 数据证书的管理工具 ,Keytool 将密钥（key）和证书（certificates）存在一个称为keystore的文件中。
> 在keystore里，包含两种数据：
> (1)密钥实体（Key entity）——密钥（secret key）又或者是私钥和配对公钥（采用非对称加密） 
> (2)可信任的证书实体（trusted certificate entries）——只包含公钥
> 
> |-v           |显示密钥库中的证书详细信息|
> |-alias       |产生别名,每个keystore都关联这一个独一无二的alias，这个alias通常不区分大小写|
> |-keystore    |指定密钥库的名称(产生的各类信息将不在.keystore文件中)|
> |-keyalg      |指定密钥的算法 (如 RSA  DSA（如果不指定默认采用DSA）)|
> |-validity    |指定创建的证书有效期多少天|
> |-keysize     |指定密钥长度|

此时在你执行命令的所在目录会生成一个`app-key.keystore`的秘钥文件

**2.转移bundle文件**
查看`android/app/src/main`是否有assets文件夹,若不存在创建之,然后执行如下命令,将bundle文件下载并存储到assets文件夹内
```shell
curl -k "http://localhost:8081/index.android.bundle" > android/app/src/main/assets/index.android.bundle
```
p.s:由于win下不存在crul命令,建议直接用安装git后自带的git bash执行

**3.配置gradle脚本**
将如下脚本放置到`android/build.gradle`中的defaultConfig下面.
```groovy
   signingConfigs{
        release {
            storeFile file("/app-key.keystore")
            storePassword "密码"
            keyAlias "keyAlias的名字"
            keyPassword "密码"
         }
    }
```
然后在buildTypes里添加
```groovy
//引用签名配置
signingConfig signingConfigs.release
```

**4.代码混淆**
修改`android/app/build.gradle`开启混淆,如果需要额外的混淆配置可以修改`proguard-rules.pro`文件.
```groovy
def enableProguardInReleaseBuilds = true
```
5.开始打包
此时,切换到`android/app`目录下,执行`gradlew aR`,经过一段与你的机器性能相关的时间等待后,你可以在`android/pp/build/outputs/apk`下找到两个apk文件,此时你就可以把apk文件交给其他人进行安装了

**p.s:**

- aR即assembleRelease的短简写形式,在gradle中,可以采用驼峰任务的首字母调用任务,前提是不要存在相同的.

- 另外如果你本地安装了gradle也可以采用你本地的gradle,但需要注意的是[android插件版本和gradle之间的对应关系](http://tools.android.com/tech-docs/new-build-system/version-compatibility
),具体可以点击链接进行了解.插件版本可以通过修改`android/build.gradle`中的` dependencies {        classpath 'com.android.tools.build:gradle:1.3.1'    }`
进行修改

- 关于gradle环境的配置可以参考,[gradle下载和安装](http://gradlecn.coding.io/download/)

**热更新**
如果要实现热部署,在代码中添加代码检查远程服务器,更新asset中的bundle文件即可实现热更新