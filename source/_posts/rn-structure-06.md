title: RN（react native）入坑指南-06,项目开发结构(代码分层组织)
date: 2016-04-17 12:36:07
tags: ['React Native']
categories: ['React Native']
author: PKAQ
---
　　随着代码复杂性的提高,对代码进行分层以及抽象是十分必要的.今天我们就对RN的项目结构进行简单的梳理.
　　这里主要是对样式文件和组件进行分离.可以以业务模块或者以页面的形式划分层级.具体结构如下
- [ ] Project ROOT
    - [ ] index.ios.js
    - [ ] index.android.js
    - [ ] android
    - [ ] ios
    - [ ] resources	 -- 存放各类静态资源文件
    - [ ] src	-- 源代码目录
    	- [ ] module --业务模块
    		- [ ] module.js	-- 业务模块组件
    		- [ ] module.style.js -- 业务模块样式

<!-- more -->
目前关于RN的分层结构没有特定的最佳实践,大家可以根据自己的理解进行组织.   
这里之所以将样式文件与业务模块同级存放主要是由于在import的时候from语句后面的参数是依据当前文件所在的相对路径进行查找,存放在同级目录可以比较方便的进行引用.`Login.js`中如果需要引入`Login.style.js`可如下书写
`Module.js`
```javascript
'use strict'

import React,{View,Text} from 'react-native'

{/**这里styles是引入后的别名,可以在需要的地方以style.xxxx的方式引用样式 */}
import styles from './Login.style.js';

export default class Login extends React.Component{
  render(){
        return (
            <View style={styles.container}>
                <Text>Hello,Tom</Text>
            </View>
        )
    }
}
```

具体样式类书写的例子
`Module.style.js`
```javascript
'use strict';

import React, {StyleSheet} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

module.exports = styles;
```
如此一来我们的入口文件直接引用Module进行展现即可
`index.android.js`
```javascript
'use strict';

import React,{AppRegistry} from 'react-native';

{/**Login */}
import Login from './src/module/Login.js';

class TaraRn extends React.Component {
    
  render() {  
    return (
     	<Login/>
    )
  }
}
  
AppRegistry.registerComponent('TaraRn', () => TaraRn);

```