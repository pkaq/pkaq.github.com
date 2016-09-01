title: RN（react native）入坑指南-01,Hello RN
date: 2015-12-16 15:36:07
tags: ['React Native','Hybrid']
categories: ['React Native','Hybrid']
author: Frank.Wu
---
#### 写在前面
  目前最热的框架之一,可以通过更新远端JS，直接更新app, 用 JavaScript 调起 native 组件，将增强与高性能组件交给 native 来处理 ，相比其他hybrid框架而言并非通过webview来调用原生组件,而是直接调用操作系统自带的javascriptCore
  React Native only supports Android 4.1 and above
  
  由于Facebook基本人手mac+iphone，所以用win+android来搞的同学 如果你在学习使用的过程中出现了各种莫名其妙的意想不到的问题，辣么 这一切都在情理之中，有条件的同学建议宁愿linux也不要win下搞，此处送你前人踩坑宝典两册    
   [点我传送 - 踩坑宝典<上>](https://github.com/pkaq/react-native-android-lession/blob/master/react-android-lession2.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E6%B1%87%E6%80%BB.md/)
   
   [点我传送 - 踩坑宝典<下>](http://bbs.react-native.cn/category/3/blogs)
    
<!-- more -->

#### 0.环境
	0.rn：0.22
	1.windows : 10
	2.node : 5.1.0
	3.npm : 3.3.12
	4.react-native-cli : 0.1.7
	5.Genymotion : 2.6, Nexus 6 - 5.1 API 22
	6.git : 2.6.2

#### 1.安装
  安装比较简单 基本按照官网说明走就行了,唯一需要注意的就是
___请时刻保持翻墙状态___
___请时刻保持翻墙状态___
___请时刻保持翻墙状态___

当然最好使用安装git后自带的git bash 不要用cmd了。   
   
   [官网说明传送门](https://facebook.github.io/react-native/docs/getting-started.html#content)
    
为了方便小语种的同学，这里简单赘述一下
1.你需要安装nodejs 4.0 以上的版本
当然如果你正在用5.0以上版本的node那么建议切换到npm2，因为这比3要快 采用如下命令切换
```shell
	npm install -g npm@2.
```
然后你就可以开始安装RN了,这里需要注意的是win下可能会提示你缺少各种依赖的模块包，耐心安装，并不是没有尽头...
```shell
	npm install -g react-native-cli
```

#### 2.Hello World
折腾完了现在开始创建你的项目吧，用下面的命令(AwesomeProject(超屌的项目),名字你可以随便起（其实不能随便起，千万不要带有react这个单词，否则会出现莫名其妙的问题 - 2016.03补充），这是官方示例给的一个名字)
```shell 
 react-native init AwesomeProject
```
创建完成后跳到项目跟目录让他在你的安卓机上跑起来吧：）
[官方文档传送门](http://facebook.github.io/react-native/docs/running-on-device-android.html#content)


新开个终端 ，跳到你的项目目录执行
运行packager，运行下面的命令后此时你可以通过浏览器打开`http://localhost:8081/index.android.bundle?platform=android`查看打包后的脚本。
```shell
	cd AwesomeProject
	react-native start
```

真机或者用模拟器运行程序
```shell
	react-native run-android
```
这里需要注意的地方是
0.设置ip
现在，打开UIExplorer项目，摇一摇你的手机，在弹出的菜单中选择`Dev settings`->`Debug server host & port for device`
设置一下你的无线IP 比如`192.168.1.1:8081`,注意：此处的8081一定要有的否则无法加载   

1.如果是android 5.0+辣么,这一点我用Genymotion创建的虚拟设备不进行此步骤也没问题，真机了也不行，原因未知。
```shell
	adb reverse tcp:8081 tcp:8081
```
现在 你应该已经看到官方为你准备的Welcome页面了，这个页面在项目根目录下的index.android.js和index.ios.js下

参考链接:
  [点我传送 - 官方文档](https://facebook.github.io/react-native/docs/getting-started.html)
  [点我传送 - 踩坑宝典<上>](https://github.com/pkaq/react-native-android-lession/blob/master/react-android-lession2.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E6%B1%87%E6%80%BB.md/)
  [点我传送 - 踩坑宝典<下>](http://bbs.react-native.cn/category/3/blogs)