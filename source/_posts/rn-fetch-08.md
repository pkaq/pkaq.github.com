title: RN（react native）入坑指南-08,如何加载远程数据
date: 2016-04-20 12:36:07
tags: ['React Native']
categories: ['React Native']
author: Frank.Wu
---

#### 前言
　　通过前面的一系列联系现在页面布局技巧已经掌握,页面跳转已经搞定,页面之间的参数传递也已经搞定,我们的代码也进行了分层组织,但我们的应用到现在为止都是死的.如何让应用活起来读取远程数据呢.此篇我们便是用fetch来拉去远程数据	  
　　当然如果你想了解更多方式和内容欢迎[阅读官方文档](http://reactnative.cn/docs/0.23/network.html#content)

#### 开始
<!-- more -->
fetch可以接受两个参数,`fetch(string,object)`,第一个参数是请求的远程地址;第二个参数是一个可选对象可以设定header,method,body等

现在在我们的代码中添加如下代码
```
_onRegister(){    
   fetch('http://192.168.191.1:8080/home/register', {
      //请求类型 
      method: 'POST',      
      //请求header
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // 发送请求参数
      body: JSON.stringify({
        name: 'tom'        
      })
    }).then((response) => response.json())
      .then((jsonData) => {
        // 回写数据
        this.setState({
          text : jsonData.text
        });
      })
      .catch((error) => {
         this.setState({
          text : '获取服务器数据错误'
        });
      });
}
```
放置一个区域来显示数据文本并且在注册按钮上添加一个点击事件,这样点击的时候就可以看到数据变化了
```
<Text style={styles.welcome}>
  {this.state.text}
</Text>  

<TouchableHighlight
    style={styles.th}
    underlayColor="rgb(210, 230, 255)"
    onPress={this._onRegister.bind(this)}>
    <Text>注册</Text>               
</TouchableHighlight>

```