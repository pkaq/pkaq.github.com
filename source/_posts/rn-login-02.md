title: RN（react native）入坑指南_02,一个登录示例
date: 2015-12-16 18:36:07
tags: ['React Native']
categories: ['React Native']
author: PKAQ
---
  Github上发现一只登录示例，拿来尝鲜,这里需要注意的坑有如下两点
  1.关于注释，恩...

>   // 单行
>   /*多行 */

这个自然不用说，需要说的是，你得在外面加一层{}给包起来

2.win下引用静态资源图片会出现引用到显示不出来的Bug，关于这个问题参考链接1,2里给出了不同的解决方案，我这里采用的是Stackoverflow的解决方式。

<!-- more -->
如果你想引用本地资源辣么有两种方式
1.使用xcassets folder
2.使用相对路径，这里的坑点在于，当你
```javascript
	require('image!google')
```
这么写的时候，很可能红屏或者引用到了不显示，所以建议采用
```javascript
	source={{ uri: "google", isStatic: true }}
```
这种方式去引用，如果你是安德猴的话，把你的图片放到drawable下面就好了。：）

废话不多说 直接撸代码,为什么没有button呢 因为Touchablexxx的就是button啊

```javascript
'use strict';

var React = require('react-native');
//组件注册
var {
    AppRegistry,
    StyleSheet,
    Image,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    RCTImage,
    View
} = React

var react = React.createClass({
    //渲染界面
    render: function() {
        return (
            <ScrollView
                contentContainerStyle={{flex:1}}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps={false}
            >
                <View style={styles.container}>
                    {/*LOGO*/}
                    <Image
                        source={{ uri: "logo", isStatic: true }}
                        style={styles.logo}/>
                    {/*用户名*/}
                    <TextInput
                        ref={(username) => this.username = username}
                        onFocus={() => this.username.focus()}
                        style={styles.input}
                        placeholder='请输入用户名'/>
                    {/*密码*/}
                    <TextInput
                        ref={(password) => this.password = password}
                        onFocus={() => this.password.focus()}
                        style={styles.input}
                        placeholder='请输入密码'
                        password={true}/>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => console.log('press me')}>
                        {/*登录*/}
                        <Text style={styles.text}>登录</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    logo: {
        width: 160,
        height: 160,
        marginTop: 100
    },
    input: {
        marginTop: 10,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightblue'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#FFF'
    },
    btn: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3333FF',
        height: 40,
        borderRadius: 5,
        marginTop: 10
    }
});

AppRegistry.registerComponent('react', () => react);
```
    

参考指南:
   [React Native登录示例](https://github.com/hufeng/iThink/issues/3)
   [Win下RN的图片坑](http://stackoverflow.com/questions/29308937/trouble-requiring-image-module-in-react-native/33472934#33472934)
   [Win下RN的图片坑之改源码解决方案](http://bbs.react-native.cn/topic/17/0-14-0-16-在windows下开发-图片显示不出来)