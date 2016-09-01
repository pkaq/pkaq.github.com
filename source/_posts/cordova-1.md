title: cordova笔记-配置安装以及hello world
date: 2015-11-24 12:00:39
tags: ['Cordova','Android']
author: PKAQ
---

[>>请点击这里查看原文<<](http://segmentfault.com/a/1190000002560220)

<!-- more -->
1.安装nodejs 

2.安装coordova模块
```shell
	npm install -g cordova
```
这个安装过程需要花费很长的时间，推荐采用 [淘宝的npm镜像](http://segmentfault.com/a/1190000000471219)

3.安装android开发环境并且配置环境变量，在Terminal里面输入android看看有没有android的版本管理器出来就说明配置有没有做好，关于如何配置环境变量搜素一下，[mac的看这里](http://www.micmiu.com/lang/java/set-javahome-on-mac-os-x/)  

4.安装ant，cordova采用ant来做的持续集成，需要配置ant环境，搜素一下，
[mac的看这里](http://blog.csdn.net/crazybigfish/article/details/18215439)

5.创建HelloWorld执行命令
```shell
	cordova create hello com.example.hello HelloWorld
```
这个过程异常的艰难，希望你有个好网络

6.配置开发平台，进入hello目录，执行
```shell
	cordova platform add android
```
7.编译
```shell
	cordova build
```
8.安装，非常不喜欢虚拟机，所以直接插上android运行
```shell
cordova run android
```

如果希望启动虚拟机
```shell
cordova emulate android
```
然后一个很傻的，没有什么功能的应用就装在手机上了

9.进一步开发，用Android Studio导入工程，在\hello\www目录下就是html开发内容，hybrid的开发就在这里做
在这个阶段中对环境变量的修改
```shell
    export PATH="$PATH:/Users/xxx/android-sdk-macosx/platform-tools"
    export PATH="$PATH:/Users/xxx/android-sdk-macosx/tools"
    export PATH="$PATH:/Users/xxx/android-sdk-macosx"
    export PATH="$PATH:/Users/xxx/apache-ant-1.9.4/bin"
    export JAVA_HOME=`/usr/libexec/java_home`
```



