title: RN（react native）入坑指南-03,运行官方示例UIExplorer
date: 2016-04-09 18:36:07
tags: ['React Native']
categories: ['React Native']
author: Frank.Wu
---

　　学习RN，官方示例是必不可少的，研究和学习官方示例会带来许多帮助。   
在搭建好rn环境之后就可以着手尝试运行官方示例来看下RN的各类组件了。   
 
#### 先决条件   
* node
* npm
* RN
* Git
* Gradle
* ADK/SDK

#### 开始   
首先下载RN代码   
Github: https://github.com/facebook/react-native   
下载成功后 命令行切换到目标目录 执行`npm install`安装所需依赖   
<!-- more -->
#### 配置*DK
这里有两种方式   
法1：
　　切换到react-native目录, 新建local.properties
```
sdk.dir=absolute_path_to_android_sdk
ndk.dir=absolute_path_to_android_ndk
```
法2:
　　环境变量添加ANDROID_NDK,ANDROID_SDK分别指向NDK和SDK的目录   
更多说明请参考   [关于SDK/NDK配置的官方文档](https://facebook.github.io/react-native/docs/android-building-from-source.html)

#### 真机测试
　　如果是windows小伙伴，下面的命令建议用安装完git后自带的gitbash运行

1.执行命令
```
./gradlew :ReactAndroid:assembleDebug
```
2.然后执行
```
./gradlew :ReactAndroid:installArchives
```
3.启动服务
```
./packager/packager.sh
```
4.最后安装到你的手机
```
../gradlew :Examples:UIExplorer:android:app:installDebug
```
这个过程中请不要随意关闭packager运行窗口
5.设置ip
现在，打开UIExplorer项目，摇一摇你的手机，在弹出的菜单中选择`Dev settings`->`Debug server host & port for device`
设置一下你的无线IP 比如`192.168.1.1:8081`,注意：此处的8081一定要有的否则无法加载

更多内容请参考[官方的真机调试文档](http://facebook.github.io/react-native/docs/running-on-device-android.html#content)

