---
title: 使用pt-archiver进行数据归档
author: PKAQ
date: 2018-12-04 18:50:07
tags: ['mysql']
categories: ['数据库']
---



# 引言

​	pt-archiver是percona工具集的一员 ,可以方便针对数据库数据不同场景进行清理\导出\合并等操作。

<!-- more -->

# 版本
- mysql: 5.7.22
- Percona Toolkit: 3.0.12
# 步骤

### 1.安装依赖

```shell
yum install -y perl perl-IO-Socket-SSL perl-DBD-MySQL perl-Time-HiRes perl-Digest-MD5 perl-ExtUtils-MakeMaker
```
### 2.下载 安装pt-archiver

[下载Percona Toolkit](https://www.percona.com/downloads/percona-toolkit/LATEST/)，选择与目标系统匹配的版本，下载相应rpm进行安装。

```shell
rpm ivh percona-toolkit-3.0.12-1.el7.x86_64.rpm
```

### 3.配置归档规则

`pt-archiver `的基本用法如下

```shell
pt-archiver [OPTIONS] --source DSN [--dest DSN] --where WHERE

DSN的详细参数：
a:查询
A:字符集
b：true代表禁用binlog
D：数据库
u：数据库链接账号
p：数据库链接密码
h：主机IP
F：配置文件位置
i：是否使用某索引
m：插件模块
P：端口号
S：socket文件
t：表
```



```shell
pt-archiver  \
--source h=ip,P=3306,p='pwd!',D=dbname,t=tablename  \
--charset=UTF8  \
--where 'condition=curdate()-1'  \
--progress 5000 --file "/opt/data/pt-archinver/%t-%Y%m%d.dat"  \
--statistics --limit 5000 --txn-size 1000 --bulk-delete
```

> 参数说明:
>
> --source : 来源数据, 子参数参见上文
>
> --charset: 字符编码
>
> -- where: 归档条件
>
> --progress 5000: 每5000行打印一次信息
>
> --file : 导出的文件名 **导出的路径必须存在**
>
> --statistics:结束的时候给出统计信息：开始的时间点，结束的时间点，查询的行数，归档的行数，删除的行数，以及各个阶段消耗的总的时间和比例，便于以此进行优化。 
>
> --limit 5000: 每次事务删除5000条数据，默认1条 
>
> --txn-size 1000: 每个事务提交的数据行数（包括读写操作），批量提交 
>
> --bulk-delete: 批量删除source上的旧数据 

## 定时归档

把归档命令存成`.sh`脚本后,使用`crontab -e`创建定时任务实现定时归档。如下示例为每小时执行一次:

```shell
* */1 * * *  sh /opt/cronjob/archiver.sh
```

## 附录

**常用参数说明**

> **--limit10000**       每次取1000行数据用pt-archive处理，Number of rows to fetch and archive per statement.
> **--txn-size  1000**   设置1000行为一个事务提交一次，Number of rows pertransaction.
> **--where‘id&lt;3000‘**   设置操作条件
> **--progress5000**     每处理5000行输出一次处理信息
> **--statistics**       输出执行过程及最后的操作统计。（只要不加上--quiet，默认情况下pt-archive都会输出执行过程的）
> **--charset=UTF8**     指定字符集为UTF8
> **--bulk-delete**      批量删除source上的旧数据(例如每次1000行的批量删除操作)
> **--bulk-insert**      批量插入数据到dest主机 (看dest的general log发现它是通过在dest主机上LOAD DATA LOCAL INFILE插入数据的)
> **--replace**          将insert into 语句改成replace写入到dest库
> **--sleep120**         每次归档了limit个行记录后的休眠120秒（单位为秒）
> **--file ‘/root/test.txt‘**：数据存放的文件，最好指定绝对路径，文件名可以灵活地组合
> **--purge**             删除source数据库的相关匹配记录
> **--header**            输入列名称到首行（和--file一起使用）
> **--no-check-charset**  不指定字符集
> **--check-columns**    检验dest和source的表结构是否一致，不一致自动拒绝执行（不加这个参数也行。默认就是执行检查的）
> **--no-check-columns**    不检验dest和source的表结构是否一致，不一致也执行（会导致dest上的无法与source匹配的列值被置为null或者0）
> **--chekc-interval**      默认1s检查一次
> **--local**            不把optimize或analyze操作写入到binlog里面（防止造成主从延迟巨大）
> **--retries**         超时或者出现死锁的话，pt-archiver进行重试的间隔（默认1s）
> **--no-version-check**   目前为止，发现部分pt工具对阿里云RDS操作必须加这个参数
> **--analyze=ds**      操作结束后，优化表空间（d表示dest，s表示source）
>  默认情况下，pt-archiver操作结束后，不会对source、dest表执行analyze或optimize操作，因为这种操作费时间，并且需要你提前预估有足够的磁盘空间用于拷贝表。一般建议也是pt-archiver操作结束后，在业务低谷手动执行analyze table用以回收表空间。














