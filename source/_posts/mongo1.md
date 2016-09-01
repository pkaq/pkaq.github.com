title: MongoDB 3.x 笔记 - 2：用户创建和鉴权配置
date: 2015-10-26 13:33:01
tags: [MongoDB]
---

MongoDB默认安装后是不需要密码的。
此时你 show dbs 会看到只有一个local数据库，那个所谓的admin是不存在的。

mongoDB 没有root，只有能管理用户的用户 userAdminAnyDatabase。
<!-- more -->
#### 1.设置鉴权模式 
这里由于Mongo3以后默认的鉴权机制更改为SCRAM-SHA-1,而spring-boot直到 1.3.0 rc 仍然不支持Mongo3 的新默认鉴权方式 所以这里指定为旧版本方式MONGODB-CR
```shell
	#切换到admin库
	use admin
    #查询authSchema
    var schema = db.system.version.findOne({“_id” : “authSchema”}) 
    #设置为MONGODB-CR
    schema.currentVersion = 3 
    ##保存
    db.system.version.save(schema) 
```
定义：
创建一个数据库新用户用db.createUser()方法，如果用户存在则返回一个用户重复错误。

#### 2、用户创建 
语法：
db.createUser(user, writeConcern)
    user这个文档创建关于用户的身份认证和访问信息；
    writeConcern这个文档描述保证MongoDB提供写操作的成功报告。

· user文档，定义了用户的以下形式：
{ user: "<name>",
  pwd: "<cleartext password>",
  customData: { <any information> },
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ]
}

user文档字段介绍：
    user字段，为新用户的名字；
    pwd字段，用户的密码；
    cusomData字段，为任意内容，例如可以为用户全名介绍；
    roles字段，指定用户的角色，可以用一个空数组给新用户设定空角色；
    在roles字段,可以指定内置角色和用户定义的角色。

    Built-In Roles（内置角色）：
    1. 数据库用户角色：read、readWrite;
    2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
    3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
    4. 备份恢复角色：backup、restore；
    5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
    6. 超级用户角色：root  
    // 这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner 、userAdmin、userAdminAnyDatabase）
    7. 内部角色：__system
    PS：关于每个角色所拥有的操作权限可以点击上面的内置角色链接查看详情。

· writeConcern文档（官方说明）
    w选项：允许的值分别是 1、0、大于1的值、"majority"、<tag set>；
    j选项：确保mongod实例写数据到磁盘上的journal（日志），这可以确保mongd以外关闭不会丢失数据。设置true启用。
    wtimeout：指定一个时间限制,以毫秒为单位。wtimeout只适用于w值大于1。

例如：在products数据库创建用户accountAdmin01，并给该用户admin数据库上clusterAdmin和readAnyDatabase的角色，products数据库上readWrite角色。
use products
db.createUser( { "user" : "accountAdmin01",
                 "pwd": "cleartext password",
                 "customData" : { employeeId: 12345 },
                 "roles" : [ { role: "clusterAdmin", db: "admin" },
                             { role: "readAnyDatabase", db: "admin" },
                             "readWrite"
                             ] },
               { w: "majority" , wtimeout: 5000 } )
               
#### 配置安全验证
这里由于Mongo3以后默认的鉴权机制更改为SCRAM-SHA-1,而spring-boot直到 1.3.0 rc 仍然不支持Mongo3 的新默认鉴权方式 所以这里指定为旧版本方式MONGODB-CR

```yaml
security:
    authorization: enabled
setParameter:
    authenticationMechanisms: MONGODB-CR,SCRAM-SHA-1
    enableLocalhostAuthBypass: false
    logLevel: 4      
```