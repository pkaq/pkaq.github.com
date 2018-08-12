---
title: Flutter初体验
author: PKAQ
date: 2018-08-12 17:24:04
tags: ['Flutter', '跨平台App']
categories: ['App']
---

# 引言

　　Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。 

# 版本

　　以下工具均为必要工具：

- Git2.18.0
- Flutter 0.5.1
- Windows 10（64位）

# 步骤

## 下载安装 

　　下载后解压到任意目录即可(注意目录路径中不要有中文\特殊符号\空格)   

1 SDK下载： [https://flutter.io/sdk-archive/#windows](https://flutter.io/sdk-archive/#windows)

2 配置环境变量

- ```
  PUB_HOSTED_URL=https://pub.flutter-io.cn //国内用户需要设置
  FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn //国内用户需要设置
  ```

> **注意：** 由于一些`flutter`命令需要联网获取数据，如果您是在国内访问，由于不可描述的原因，直接访问很可能不会成功。 上面的`PUB_HOSTED_URL`和`FLUTTER_STORAGE_BASE_URL`是google为国内开发者搭建的临时镜像。详情请参考 [Using Flutter in China](https://github.com/flutter/flutter/wiki/Using-Flutter-in-China) 

## 创建

　　在解压目录执行`flutter_console.bat`会打开一个石青色的控制台界面，根据提示可以运行`flutter docter`检查环境依赖，然后跳转到你的`workspace`目录执行`flutter create hello`就生成了一个简单计数器应用。

- `ios`目录包含了ios的全部代码可以直接使用xcode（需要9.0+版本）进行开发。

-  `android`目录包含了android的全部代码，直接使用android studio开发即可。
-  `lib`目录中包含了两端通用的dart代码，在打包生成应用时，全部的dart代码会被编译为本地代码（如在android端，会被直接编译为so文件）。

 　　此时连接你的安卓手机打开USB调试模式，执行`flutter run`即可将生成的`hello`应用安装到你的手机上。



**参考资料**

- [Flutter中文网](https://flutterchina.club/)

- [Flutter官方网站](https://flutter.io/)

  