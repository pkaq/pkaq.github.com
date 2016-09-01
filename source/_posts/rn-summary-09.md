title: RN（react native）入坑指南-09,单元学习小结
date: 2016-04-09 18:36:07
tags: ['React Native']
categories: ['React Native']
author: PKAQ
---
现在我们已经做了一个简单的登录示例,它包含的知识点有页面布局、图标字体的使用、结构化开发、远程数据获取等。
[代码在这里](https://github.com/pkaq/TaraRn)

那么如果想让自己的水平提高一个层次,此时你应该注意到了要玩转RN你应该储备如下技能
**1.Flex布局**:[Flex 布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)
**2.ES6语法**:这里有一份  [ES5 ES6对照表](http://reactnative.cn/post/15)
下面是一点补充说明 完整教程可以看阮一峰的[es6 入门教程](http://es6.ruanyifeng.com/)
> es6语法说明 ...Obj ,三个点遍历对象所有属性并赋值给xx,举个例子
> ```
> var Obj = {};
> Obj.foo="1";
> Obj.bar="2";
> 
> <H1 {...Obj} foo="2"></H1>
> ```
> 这里{...Obj}会遍历Obj的所有属性给H1,同时由于后面再次制定了foo="2" 所以这里会覆盖前面的foo="1"

箭头函数
> (a)=>{alert("a")}
> 相当于
> function(a) {
> 	alert("a");
> }

**3.JSX语法** : [深入了解JSX语法](http://reactjs.cn/react/docs/jsx-in-depth.html)
还是补充说明
> JSX组件类和标签首字母都要大写

**4.关于样式**
> 样式要采用驼峰规范书写

**5.关于事件**
> 事件绑定 比如onClick={_onclickHandler.bind(this,"a")},这里接受两个参数,第一个设定作用域,第二个接收一个参数,同时onClick必须符合驼峰命名规则

下一步我们就可以开始熟悉组件使用,redux等更多内容了.