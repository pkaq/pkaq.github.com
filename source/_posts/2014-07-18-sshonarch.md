title: ArchLinux配置SSH publickey登录
author: PKAQ
date: 2014-07-18 17:00:21
tags: ['Arch']
categories: 'archlinux'
---
### 1.安装OpenSSH  
```shell  
	#安装
	pacman -S openssh
	#启动
	systemctl start sshd.service
	#添加到守护进程
	systemctl enable sshd.service
```  

### 2.配置  
```shell  
	vim /etc/ssh/sshd_config
```  
修改如下两个参数为  
UsePAM no  
PubkeyAuthentication yes  
设置完成后重启服务  
```shell  
	systemctl restart sshd.service  
```  

### 3.生成key  
```shell  
	ssh-keygen -t rsa  
```  
该过程中会提示输入密码,直接回车略过即可忽略密码  
添加认证
```shell  
	cat ~/.ssh/id_rsa.pub>>authorized_keys  
```   
<!-- more -->
知识普及:  
1. PublicKey认证基本原理
    Public Key（非对称，asymmetric）认证使用一对相关联的Key Pair（一个公钥Public Key，一个私钥Private Key）来代替传统的密码（或我们常说的口令，Password）。顾名思义，PublicKey是用来公开的，可以将其放到SSH服务器自己的帐号中，而PrivateKey只能由自己保管，用来证明自己身份。
使用PublicKey加密过的数据只有用与之相对应的PrivateKey才能解密。这样在认证的过程中，PublicKey拥有者便可以通过PublicKey加密一些东西发送给对应的PrivateKey拥有者，如果在通信的双方都拥有对方的PublicKey（自己的PrivateKey只由自己保管），那么就可以通过这对Key Pair来安全地交换信息，从而实现相互认证。在使用中，我们把自己的PublicKey放在通过安全渠道放到服务器上，PrivateKey自己保管（用一个口令把PrivateKey加密后存放），而服务器的PublicKey一般会在第一次登录服务器的时候存放到本地客户端（严格地说来服务器的PublicKey也应该通过安全渠道放到本地客户端，以防止别人用他自己的PublicKey来欺骗登录）。

2. Public Key认证相对于其它SSH认证的优点
在众多SSH登录认证中，传统的单口令（Password）认证用得比较多，所以在这里我们主要对比一下SSH认证中的口令（Password）认证和PublicKey认证的区别。
a. 基于主机IP（rhost）的认证：对于某个主机（IP）信任并让之登录，这种认证容易受到IP欺骗攻击。 b. Kerberos认证：一个大型的基于域的认证，这种认证安全性高，但是太大、太复杂不方便部署。
c. PAM认证：类似于传统的密码认证，是绝大多数Unix/Linux系统自带的一个认证和记帐的模块，它的功能比较复杂，配置起来比较麻烦。而且，容易由于配置失误而引起安全问题。 汗维
d. 传统的Unix/Linux口令（或密码Password）认证：在客户端直接输入帐号密码，然后让SSH加密传输到服务器端验证。这种认证方式有着如下明显的缺点：
1）为了确保密码安全，密码必须很长很复杂，但是这样的密码很难记忆；
2）对于自己所拥有的每个帐号，为了安全，不同的帐号都要设置不同的密码，管理起来很不方便；
3） 对于默认帐号，默认密码，例如装机时用的帐号，如果一时疏忽没有改密码，被其它不怀好意的人扫描到帐号和密码，可能会造成安全漏洞；
4）如果远程主机已经被攻击，即使使用SSH安全通道进行保护，在网络上发送的密码在到达远程主机时也可能被截获；
5）对于每个帐号的修改都要人工登录（为了安全，不能把Password放到脚本里），随着服务器数量增多，这项工作会变得十分烦琐。

3. Public Key配置
使用一种被称为"公私钥"认证的方式来进行ssh登录. "公私钥"认证方式简单的解释:首先在客户端上创建一对公私钥 （公钥文件：~/.ssh/id_rsa.pub； 私钥文件：~/.ssh/id_rsa）
然后把公钥放到服务器上（~/.ssh/authorized_keys）, 自己保留好私钥.在使用ssh登录时,ssh程序会发送私钥去和服务器上的公钥做匹配.如果匹配成功就可以登录了