title: RN（react native）入坑指南-04,布局容器
date: 2016-04-12 18:36:07
tags: ['React Native']
categories: ['React Native']
author: Frank.Wu
---

react native 支持采用flex方式布局。默认情况下如果不设置flex容器的宽度，那么flex容器会100%自适应屏幕宽度。
学习flex布局要明白两个概念：主轴和交叉轴。所谓主轴即容器延伸方向，默认是row(横向延伸)，此时与水平垂直的轴即为交叉轴，反之亦然。

<!-- more -->
伸缩容器有以下七大属性  ：

**1.flexDirection(主轴方向,子元素在父容器中的排列位置)**
  flexDirection:row | row-reverse | column(默认) | column-reverse   
  
**2.flexWrap(子元素超出父容器时是否换行)**
  flexWrap:nowrap | wrap | wrap-reverse   
  
**3.justifyContent(主轴内容对齐方式)**
  justifyContent:flex-start(默认值) | flex-end | center | space-between | space-around    
  
**4.alignItems(交叉轴项目对齐方式)**
  alignItems:flex-start(默认) | flex-end | center | stretch    
  
**5.flex(flex-grow,flex-shrink,flex-basis的合体，默认0 1 auto)**
	a.flex-grow(元素扩展占比,默认0，0不起作用，值越大扩展能力越强，表示在 item 总宽度比容器小的时候，为了让 item 填满容器，每个 item 增加的宽度)
	b.flex-shrink(元素的收缩能力，默认1,值越大收缩能力越大，shrink 表示在 item 总宽度比容器大的时候，为了让 item 填满容器，每个 item 减少的宽度)
	c.flex-basis(元素伸缩基准值 默认auto)

**6.alignSelf(指定特定元素的对齐方式)**

举个例子，如果有一段文本要设置水平垂直居中，并且超出部分换行可以书写为   
```
  justifyContent:center;
  alignItems：center;
```

