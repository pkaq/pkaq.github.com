title: ArchLinux配置alias
author: PKAQ
date: 2014-07-18 17:31:26
tags: ['Arch']
categories: 'archlinux'
---

直接用如下命令可以设置alias,但此种方式重启后会丢失,可通过将如下命令加到profile文件的方式来使其永久生效
```shell  
	alias ll='ls -l'
	alias ..='cd ..'
```
编辑~/.bashrc,将所需alias添加到此文件中即可.
另:有的发行版可以通过添加~/.bash_aliases文件来进行指定,在arch中没有进行尝试.不知道是否可行.  
```shell  
	vim ~/.bashrc  
```  