title: RN（react native）入坑指南-05,使用图标字体Fontawesome
date: 2016-04-16 12:36:07
tags: ['React Native']
categories: ['React Native']
author: PKAQ
---

#### 先决条件
* rn 0.23
* npm 3.7.3
* node 5.9.1
* system winX
* python 2.7.x

#### 前言
　　开发过程中各式各样的图标自然少不了,如果能使用fontawesome等图标字体,自然可以带来极大的方便,然而在rn中并无法直接引用,还好已经有人做好了相关组件,react-native-vector-icons便是其中的佼佼者.   
　　如果你对此组件感兴趣可以去github页面star此项目    
　　https://github.com/oblador/react-native-vector-icons   
  
<!-- more -->
#### 安装
　　官方README如何使用已经写得很详细,此处需要指出的是几个注意点.  
　　由于安装时依赖node-gyp,而node-gyp在win下又会有一堆依赖这里以winX为例说一下winX下需要安装的依赖   
  
　　1.[python环境](https://www.python.org/downloads/):截止博客发表时仅支持到2.7.X版本,如果是下载的zip包需要将python路径添加到环境变量中   
   
　　2.vs c++:为了方便 我直接安装了[Microsoft Visual Studio Express](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx)
npm install react-native-vector-icons --save   

　　3.[rnpm](https://github.com/rnpm/rnpm):`npm install rnpm -g`

#### 使用
确保以上三点没问题后,可以通过如下命令安装本组件
```shell
	npm install react-native-vector-icons --save
```

由于我是开发android App,所以依据官方文档继续执行
```shell
	rnpm link
```

在所需使用图标的地方,这里采用的是es6的写法,es5的写法也是可以的
```shell
	import Icon from 'react-native-vector-icons/FontAwesome';
```
使用组件
```js
	<Icon name="qq" size={30} color="#52C0FE"/>
```

#### 备注
**参数说明**   

|参数|类型|默认值|说明|
|--------------------|
|name|String|无|图标名称,这里需要注意的是 如果你使用font-awesome的图标,例如qq仅写qq即可,无需写fa fa-qq|
|size|数值|12|图标的大小|
|color|[rn支持的颜色格式](http://reactnative.cn/docs/0.23/colors.html#content)|自动继承|图标的颜色|

**支持的图标**    

* [`Entypo`](http://entypo.com) by Daniel Bruce (**411** icons) 
* [`EvilIcons`](http://evil-icons.io) by Alexander Madyankin & Roman Shamin (v1.8.0, **71** icons) 
* [`FontAwesome`](http://fortawesome.github.io/Font-Awesome/icons/) by Dave Gandy (v4.5, **605** icons) 
* [`Foundation`](http://zurb.com/playground/foundation-icon-fonts-3) by ZURB, Inc. (v3.0, **283** icons)
* [`Ionicons`](http://ionicons.com/) by Ben Sperry (v2.0.1, **733** icons)
* [`MaterialIcons`](https://www.google.com/design/icons/) by Google, Inc. (v2.1.1, **893** icons)
* [`Octicons`](http://octicons.github.com) by Github, Inc. (v3.5.0, **196** icons)
* [`Zocial`](http://zocial.smcllns.com/) by Sam Collins (v1.0, **100** icons)

**错误记录**
未正确安装python会出现
```shell
-gyp ERR! configure error 
gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
gyp ERR! stack  
```   

未正确安装vs c++会出现
```shell
未能加载Visual C++ 组件VCBuild.exe ”，要求安装.NET FramMS Build 、.NET Framework 2.0 SDK 、 Microsoft Visual Studio 2005。
```