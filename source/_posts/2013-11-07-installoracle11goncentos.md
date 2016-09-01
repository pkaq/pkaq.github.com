title: Centos 6.4安装oracle 11G
date: 2013-11-07 17:13:31
tags: ['linux','oracle']
categories: 'linux'
author: PKAQ
---
### 1.安装centos
### 2.配置sshd
```shell
	vi etc/ssh/sshd_config 
	PasswordAuthentication yes
	PermitRootLogin yes
	service sshd restart
```
### 3.安装ftp
```shell
	yum install vsftpd
```
允许root登录
```shell
	vi /etc/vsftpd/ftpusers
	vi /etc/vsftpd/userlist
```
把里面root前面加#
启动ftp
```shell
	service vsftpd start
```
<!-- more -->
### 4.关闭SELINUX
```shell
	vi /etc/selinux/config   
```
 修改SELINUX=disabled，然后:wq保存退出后，输入setenforce 0 使修改生效，或者重启下电脑 
### 5.放开防火墙对ftp和1521的限制
```shell
	vi /etc/sysconfig/iptables 
	-A INPUT -m state --state NEW -m tcp -p tcp --dport 21 -j ACCEPT
	-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
	-A INPUT -m state --state NEW -m tcp -p tcp --dport 1521 -j ACCEPT
```
### 6.使用懒人包
```shell
	sh Oracle11gPreInstaller.sh
```
### 7.安装oracle
```shell
	./runInstaller
```
### 8.配置.bash_profile
```shell
vi.bash_profile 
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

export PATH

ORACLE_BASE=/opt/app/oracle
ORACLE_HOME=/opt/app/oracle/product
ORACLE_SID=mord
TMP=/tmp
TMPDIR=/tmp
NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS'
export ORACLE_BASE ORACLE_HOME ORACLE_SID TMP TMPDIR NLS_DATE_FORMAT
export NLS_LANG=AMERICAN_AMERICA.AL32UTF8
export ORA_NLS33=$ORACLE_HOME/nls/data
export ORACLE_BASE
export ORACLE_HOME
export ORACLE_SID
export LANG=en_US.UTF-8

PATH=$PATH:$HOME/bin:$ORACLE_HOME/bin

export PATH

/bin/dbstart 
/bin/emctl start dbconsole
```
### 9.dbca配置创建数据库
### 10.netca设置监听服务名

[懒人包下载](/files/Oracle11gPreInstaller.sh)
