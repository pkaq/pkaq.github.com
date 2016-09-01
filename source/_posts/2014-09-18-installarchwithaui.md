title: installarchwithaui
date: 2014-09-19 06:03:54
author: PKAQ
tags: ['Arch']
categories: 'archlinux'
---
最近在Github上发现一Arch脚本,可以极大简化Arch安装,今日已在实体机亲测,非常好使  
 [archlinux安装脚本](https://github.com/helmuthdu/aui)  

## 先决条件
 1.网络畅通
 2.以root用户登陆

## 如何获取

### 采用Git方式获取  
•安装Git
```shell  
	pacman -Sy git  
```  
•获取脚本
```shell  
	git clone git://github.com/helmuthdu/aui   
```  


### 采用非Git方式

```shell  
	wget --no-check-certificate https://github.com/helmuthdu/aui/tarball/master -O - | tar xz  
```  
或者采用短地址
```shell  
	wget --no-check-certificate http://bit.ly/NoUPC6 -O - | tar xz  
```
或者采用更短的:)  
```shell  
	wget ow.ly/wnFgh -o aui.zip  
```

## 如何使用
切换到脚本所在目录执行./fifo或者./lilo然后按提示步骤操作即可,关于两个脚本的区别请参阅github介绍.这里不再翻译.~~:},
如果采用fifo脚本安装可以再安装完成后自行安装图形界面等,具体可参考[拥抱Arch Linux-安装配置小记](/2014/06/19/installarch)  
•FIFO [system base]:  cd <dir> && ./fifo  
•LILO [the rest...]:  cd <dir> && ./lilo  


