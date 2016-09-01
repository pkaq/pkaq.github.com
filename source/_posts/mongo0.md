title: MongoDB 3.x 笔记 - 1：安装
date: 2015-10-24 19:47:01
tags: [mongoDB]
---
MongoDB Version : 3.0.x

  关于mongodb的好处，优点之类的这里就不说了，唯一要讲的一点就是mongodb中有三元素：数据库，集合，文档
其中“集合”就是对应关系数据库中的“表”，“文档”对应“行”。

安装比较简单，比如

Arch下可通过pacman -Sy mongodb进行安装
Windows下可下载msi进行安装

更多可以参考官网DOC有十分详细的说明，安装完成后把bin目录加入path即可直接在命令行下调用mongo，mongod等命令了
<!-- more -->

启动时可以通过指定yaml格式的参数文件设置一些参数
```shell
	mongod mongocfg/mongodb.conf
```
例如如下配置
```yaml
systemLog:
    destination: file
    path: /opt/mongoHome/log/mongod.log
storage:
    dbPath: /opt/mongoHome/db
```
Win下可以用如下命令将mongodb安装为系统服务
```shell
	mongod --config "mongod.cfg" --install
```

可以输入services.msc通过服务管理器启动或者使用如下命令启动
```shell
	net start MongoDB
```


启动后可通过输入mongo（如果配置了环境变量），或者进入安装目录\bin下运行mongo进入mongo控制台

输入help可以看到基本操作命令：
show dbs:显示数据库列表 
show collections：显示当前数据库中的集合（类似关系数据库中的表） 
show users：显示用户

use <db name>：切换当前数据库，这和MS-SQL里面的意思一样 
db.help()：显示数据库操作命令，里面有很多的命令 
db.foo.help()：显示集合操作命令，同样有很多的命令，foo指的是当前数据库下，一个叫foo的集合，并非真正意义上的命令 
db.foo.find()：对于当前数据库中的foo集合进行数据查找（由于没有条件，会列出所有数据） 
db.foo.find( { a : 1 } )：对于当前数据库中的foo集合进行查找，条件是数据中有一个属性叫a，且a的值为1

更多参数配置请参考官方文档(https://docs.mongodb.org/manual/reference/parameters/)

