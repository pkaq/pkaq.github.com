title: 在ArchLinux上安装Oracle12C
author: PKAQ
date: 2014-07-08 08:52:46
tags: ['Arch']
categories:
---

关于这个问题,按照官方Wiki基本可以走通,但中间会有些许问题.  

### 0.安装前准备  
1.首先你得保证可以ping通自己的主机名,关于这点可以参阅上一篇文章[拥抱Arch Linux-安装配置小记](/2014/06/19/installarch)  
2.其次需要有桌面环境,可以参考[安装X环境](/2014/06/19/installarch/#installx)和[安装XFCE4](/2014/06/19/installarch/#xfce4)
3.保证网络畅通(netctl使用以及双网卡配置后续补充

<!-- more -->

### 1.安装软件包
安装Oracle数据库必需的软件包

Arch i686: 
◾base-devel 
◾java-runtime (openjdk6 or jre jdk) 
◾ksh, rpm, gawk, gdb, libaio, libelf, sysstat, unixodbc, libstdc++5 
◾unzip, sudo 

Arch x86_64: 
◾base-devel 
◾java-runtime (openjdk6 or jre jdk) 
◾ksh, rpm, gawk, gdb, libaio, libelf, sysstat, libstdc++5 
◾unzip, sudo 
执行 
```shell
	 pacman -S unzip sudo java-runtime base-devel
```  

Oracle32位数据库需要unixodbc。 
```shell  
	pacman -S unixodbc
```


可选的lib32 软件包 x86_64: 
```shell  
	 pacman -S lib32-libstdc++5 
	 pacman -S lib32-glibc 
	 pacman -S lib32-gcc-libs
```
这里可能会找不到lib32的包,是因为没有开启multilib  
编辑/etc/pacman.d/mirrorlist里把multilib的几行解除注释


Oracle数据库需要32位的libaio和unixodbc在x86_64上，但在32位上是不必要的。 

Oracle Universal Installer需要的一些软链接。 
```shell
	ln -s /usr/bin/rpm /bin/rpm
	ln -s /usr/bin/ksh /bin/ksh
	ln -s /bin/awk /usr/bin/awk
	ln -s /bin/tr /usr/bin/tr
	ln -s /usr/bin/basename /bin/basename
```


Arch x86_64: 
```shell
	ln -s /usr/lib /usr/lib64
```  


### 2.安装KSH
由于这个需要通过AUR安装所以你需要一个yaourt,参阅[安装yaourt](/2014/06/19/installarch/#yaourt)安装yaourt
键入  
```shell
	yaourt ksh
```  
然后根据界面提示进行无脑操作即可.  


### 3.配置

为Orcale数据库创建用户和组： 
```shell  
	groupadd oinstall
	groupadd dba
	useradd -m -g oinstall -G dba oracle
```  

为用户oracle设置密码： 
```shell  
	passwd oracle
```  


可选: Add oracle to the sshd_config file. 
```shell  
	pacman -S openssh
```  


添加如下内容到 /etc/ssh/sshd_config: 
```shell  
	AllowUsers oracle
```  

添加如下内容到 /etc/sudoers.
```shell  
	oracle    ALL=(ALL) ALL
```  

在99-sysctl.conf添加如下内容 /etc/sysctl.d/99-sysctl.conf
```shell  
	# oracle kernel settings
	fs.file-max = 6553600
	kernel.shmall = 2097152
	kernel.shmmax = 2147483648
	kernel.shmmni = 4096
	kernel.sem = 250 32000 100 128
	net.ipv4.ip_local_port_range = 1024 65535
	net.core.rmem_default = 4194304
	net.core.rmem_max = 4194304
	net.core.wmem_default = 262144
	net.core.wmem_max = 262144
```  


在limits.conf 添加如下内容 /etc/security/limits.conf
```shell  
# oracle settings
	oracle           soft    nproc   2047
	oracle           hard    nproc   16384
	oracle           soft    nofile  1024
	oracle           hard    nofile  65536
```  

可选: 想使变化生效您可以重启电脑。 

为Ocale数据库创建一些目录。您可以选择目录路径。下面是参考例子。 
```shell  
	mkdir -p /oracle
	mkdir -p /oracle/inventory
	mkdir -p /oracle/recovery
	mkdir -p /oracle/product/db
```  
<font color="red">注意:根据官方建议这里的路径最好不要改</font>


为目录设定权限。 
```shell  
	chown -R oracle:dba /oracle
	chmod 777 /tmp
``` 


更改.bashrc文件 /home/oracle/.bashrc.
```shell  
	export ORACLE_BASE=/oracle
	export ORACLE_HOME=/oracle/product/db
	export ORACLE_SID=xdb
	export ORACLE_INVENTORY=/oracle/inventory
	export ORACLE_BASE ORACLE_SID ORACLE_HOME
	export PATH=$ORACLE_HOME/bin:$PATH
	export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH
	export EDITOR=VIM
	export VISUAL=nano
```

### 4.安装
切换到安装目录执行./runInstaller 即可

安装过程中可能(基本是必然)出现如下问题

a.安装过程进行到80%多(所有文件复制完毕,并开始链接后), 报错
ins_precomp.mk
INFO: /usr/bin/ld: <ORACLE_HOME>/lib//libnls12.a(lxhlang.o): undefined reference to symbol ‘__tls_get_addr@@GLIBC_2.3′
这是因为oracle安装文件自带的 库文件太老了

需要删除 {ORACLE_HOME}/lib/stubs 这个目录 (对于我的设置,就是 /opt/oracle/product/12.1.0.1.0/lib/stubs
```shell  
	cd /opt/oracle/product/12.1.0.1.0/lib
	rm -rf stubs
```   
2.在图形安装界面 点击Retry继续, 再次报错

ins_rdbms.mk
libclient12.a(kpue.o): undefined reference to symbol 'ons_subscriber_close'
....
libons.so: could not read symbols: Invalid operation
修改 rdbms/lib/ins_rdbms.mk 的 883行 和 901 行
```shell    
$(PLSHPROF) : $(ALWAYS) $(PLSHPROF_DEPS)
        $(SILENT)$(ECHO)
        $(SILENT)$(ECHO) " - Linking hierarchical profiler utility (plshprof)"
        $(RMF) $@
        $(PLSHPROF_LINKLINE) -lons

....
    897 $(RMAN) : $(ALWAYS) $(RMAN_DEPS)
    898         $(SILENT)$(ECHO)
    899         $(SILENT)$(ECHO) " - Linking recovery manager (rman)"
    900         $(RMF) $@
    901         $(RMAN_LINKLINE) -lons
```  
3.在图形节目 Retry, 第3次报错

ins_rdbms.mk
houzi.o: undefined reference to symbol 'ztcsh'
libnnz12.so: could not read symbols: Invalid operation
修改 ins_rdbms.mk 的 1067行
```shell  
   1063 $(TG4PWD) : $(ALWAYS) $(TG4PWD_DEPS)
   1064         $(SILENT)$(ECHO)
   1065         $(SILENT)$(ECHO) " - Linking $(TG4DG4)pwd utility"
   1066         $(RMF) $@
   1067         $(TG4PWD_LINKLINE) -lnnz12
 ```  
 4.安装完成后可能会遇到无法创建数据库、无法启动等诸多奇葩问题，一般重启可解决。。。   

 __参考资料
 *[oracle12c archlinux 安装出错](http://bbs.csdn.net/topics/390743335)

 *Arch wiki - oracle 安装
 https://wiki.archlinux.org/index.php/Oracle_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)

 *[lib32包找不到的问题](http://tieba.baidu.com/p/2494225213)