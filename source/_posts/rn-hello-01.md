title: RN（react native）入坑指南-01,Hello RN
date: 2015-12-16 15:36:07
tags: ['React Native','Hybrid']
categories: ['React Native','Hybrid']
author: PKAQ
---
#### 写在前面

  目前最热的框架之一,可以通过更新远端JS，直接更新app, 用 JavaScript 调起 native 组件，将增强与高性能组件交给 native 来处理 ，相比其他hybrid框架而言并非通过webview来调用原生组件,而是直接调用操作系统自带的javascriptCore
  React Native only supports Android 4.1 and above
  
  由于Facebook基本人手mac+iphone，所以用win+android来搞的同学 如果你在学习使用的过程中出现了各种莫名其妙的意想不到的问题，辣么 这一切都在情理之中，有条件的同学建议宁愿linux也不要win下搞，此处送你前人踩坑宝典两册    
   [点我传送 - 踩坑宝典<上>](https://github.com/pkaq/react-native-android-lession/blob/master/react-android-lession2.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E6%B1%87%E6%80%BB.md/)
   
   [点我传送 - 踩坑宝典<下>](http://bbs.react-native.cn/category/3/blogs)

   -- 2018/07/31更新
    
<!-- more -->

#### 0.环境
	0.rn：0.56
	1.windows : 10
	2.node : 10.0.4
	3.npm : 6.1.0
	4.yarn 1.7

#### 1.安装
  安装比较简单 基本按照官网说明走就行了,唯一需要注意的就是
___请时刻保持翻墙状态___
___请时刻保持翻墙状态___
___请时刻保持翻墙状态___

当然最好使用安装git后自带的git bash 不要用cmd了。   
   
   [官网说明传送门](https://facebook.github.io/react-native/docs/getting-started.html#content)
    
为了方便小语种的同学，这里简单赘述一下
1.你需要安装nodejs 10.0 以上的版本

然后你就可以开始安装RN了,这里需要注意的是win下可能会提示你缺少各种依赖的模块包，耐心安装，并不是没有尽头...
```shell
	npm install -g create-react-native-app
```

#### 2.Hello World
折腾完了现在开始创建你的项目吧，用下面的命令(AwesomeProject(超屌的项目),名字你可以随便起（其实不能随便起，千万不要带有react这个单词，否则会出现莫名其妙的问题），这是官方示例给的一个名字)
```shell 
	create-react-native-app AwesomeProject
```
创建完成后跳到项目跟目录让他在你的安卓机上跑起来吧：）
[官方文档传送门](https://facebook.github.io/react-native/docs/getting-started.html)

安装Expo , 并且保证你的机器所用的网络跟pc在同一个局域网段,可以使用 `set REACT_NATIVE_PACKAGER_HOSTNAME` 来设置使用哪个ip


```shell
	cd AwesomeProject
	yarn start
```

真机或者用模拟器运行程序
```shell
	yarn android
```

现在 你应该已经看到官方为你准备的Welcome页面了，这个页面在项目根目录下的app.js下

参考链接:
  [点我传送 - 官方文档](https://facebook.github.io/react-native/docs/getting-started.html)
  [点我传送 - 踩坑宝典<上>](https://github.com/pkaq/react-native-android-lession/blob/master/react-android-lession2.%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E6%B1%87%E6%80%BB.md/)
  [点我传送 - 踩坑宝典<下>](http://bbs.react-native.cn/category/3/blogs)