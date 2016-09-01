title: 拥抱Arch Linux-安装配置小记
date: 2014-06-19 17:31:40
tags: ['Arch']
categories: POSIX
author: PKAQ
---

## 目录
1.	[启动虚拟机](#startvirtualbox)   
2.	[磁盘规划](#disk)   
3.	[创建磁盘文件系统](#filesystem)  
4.	[挂载磁盘](#mount)  
5.	[选择镜像-设置更新源](#mirrorlist)  
6.	[安装基本系统](#install)  
7.	[基本系统设置](#basicsetup)  
	a.	[设置语言](#language)  
	b.	[设置主机名](#hostname)  
	c.	[设置时区](#timezone)  
	d.	[创建ramdisk](#ramdisk)  
	e.	[检查syslinux的配置文件是否正确](#checksyslinux)  
	f.	[安装syslinux启动管理器,以便实现ArchLinux的顺利启动](#syslinux)   
	g.	[为root超级用户添加密码](#root)   
	h.	[退出当前系统环境](#exit)   
	i.	[添加用户](#adduser)   
	j.	[配置网络](#network)   
	k.	[安装X桌面环境](#installx)   
	l.	[安装XFCE4 桌面套件](#xfce4)   
	m.	[设置xfce4自启动](#xfce4auto)　　  
	n.	[安装浏览器和输入法](#inputmethod)   
	o.	[安装yaourt](#yaourt)       
8.	[为VBOX安装增强功能](#vbaddition)   

9.	[附录](#adv)  
	a.[为slim安装主题](#slimthemes)  
	b.[看图软件](#feh)  
	c.[zsh](#zsh)  
	d.[ksh](#ksh)  
	e.[office](#office)   
	f.[文本编辑工具sublime](#sublime)   
	j.[网络管理工具wicd](#wicd)
 	h.[使用netctl](#netctl)


<!-- more -->
## <a name="startvirtualbox">一、启动虚拟机</a>
启动虚拟机,选择对应的选项,可以在虚拟机里面安装64位系统又有这个欲望的，选第二个进去。  
![启动](/images/2014/archinstall/1.png)


## <a name="disk">二、磁盘规划</a>
从光驱启动完毕后首先进行磁盘规划
键入  
```shell
	cfdisk
```  
![分区](/images/2014/archinstall/2.png)  

弹出的界面选 New  
![新建分区](/images/2014/archinstall/3.png)  

新手可以不用分区，如果需要分多个区，建议一个 / 一个/home，如果内存大，不需要swap分区。使用cfdisk分区比较直观。
·注意【Bootable】，/ 分区一定要Bootable

因为这里磁盘规划只有三个分区,所以接下来统一用主分区的形式,选Primary,如果磁盘规划超过4个分区的,规划完3个主分区之后自行调整剩下的空间为扩展分区,然后在扩展分区里面再进行剩余磁盘规划操作


![主分区](/images/2014/archinstall/4.png)   

boot 规划100M就很够了

![主分区](/images/2014/archinstall/5.png)   

选Beginning  

![主分区](/images/2014/archinstall/6.png)   

按一下Bootable,激活当前boot所在分区/dev/sda1,之后可以看到sda1的flags标记下面有个boot  

![主分区](/images/2014/archinstall/7.png)  

![主分区](/images/2014/archinstall/8.png)  

光标移动到free space ,选 New 规划swap 交换分区  

![交换分区](/images/2014/archinstall/9.png)  

类型主分区,原因上面已经说过,不喜欢的可以选逻辑分区,大小给1G差不多,多了也没什么太大的用处  
	
![主分区](/images/2014/archinstall/10.png)  
![主分区](/images/2014/archinstall/11.png)  

选Beginning  

![Beginning](/images/2014/archinstall/12.png)   

移动到Type选项回车  

![Type](/images/2014/archinstall/13.png)    

磁盘类型选择82  
![磁盘类型](/images/2014/archinstall/14.png)    
![磁盘类型](/images/2014/archinstall/15.png)  
![磁盘类型](/images/2014/archinstall/16.png)   

光标移动到free space 把剩下的空间全部给根节点  
   
![根分区](/images/2014/archinstall/17.png)     
![根分区](/images/2014/archinstall/18.png)   
![根分区](/images/2014/archinstall/19.png)   


移动到write选项回车  

![Write](/images/2014/archinstall/20.png)  

输入yes保存刚才所做的分区更改  
![Write yes](/images/2014/archinstall/21.png)  

移动到quit选项完成磁盘分区规划操作  
![Quit](/images/2014/archinstall/22.png)  
![Quit](/images/2014/archinstall/23.png)    

## <a name="filesystem">三、创建磁盘文件系统</a>
boot 所在的磁盘分区sda1 用ext4文件系统,当然用其他文件系统也可以
键入  
```shell
	mkfs.ext4 /dev/sda1  
```  

![创建分区](/images/2014/archinstall/24.png)  
![创建分区](/images/2014/archinstall/25.png)    

根节点所在分区sda3 用主流的ext4文件系统即可 
键入  
```shell
	mkfs.ext4 /dev/sda3
```  

![创建分区](/images/2014/archinstall/26.png)  
![创建分区](/images/2014/archinstall/27.png)    

交换分区 
键入  
```shell
	mkswap /dev/sda2
```   
![创建分区](/images/2014/archinstall/28.png)    

激活交换分区
键入  
```shell
	swapon /dev/sda2
```   
![激活](/images/2014/archinstall/29.png)    

## <a name="mount">四、挂载磁盘</a>  
挂载磁盘到AIS Bash安装脚本支持的 mnt 目录:

先挂载根节点
键入  
```shell
	mount /dev/sda3 /mnt
```  
![挂载](/images/2014/archinstall/30.png)    

mnt 目录下面创建boot目录用来挂载 boot所在的分区   
![挂载](/images/2014/archinstall/31.png)    

挂载boot所在分区到 mnt下面的boot目录
键入  
```shell
	mount /dev/sda1 /mnt/boot
```  
![挂载](/images/2014/archinstall/32.png)    

## <a name="mirrorlist">五、选择镜像-设置更新源</a>  
```shell
	nano /etc/pacman.d/mirrorlist
```   
p.s:找带China的，PageDown PageUp 滚屏，Ctrl+V 向下翻页，Ctrl+Y 向上翻页， Alt+6 复制当前行，Ctrl+u 粘贴，Ctrl+x 退出，保存按Y，回车。
163站点在最下面不远处，我复制了2个，放在最上面，如图所示。   
推荐使用   [中国科技大学的源 ](http://mirrors.ustc.edu.cn/archlinux/,"中国科技大学的源")  ,其余的均可以删除。  

![设置源](/images/2014/archinstall/33.jpg)    

## <a name="install">六、安装基本系统</a>  
键入  
```shell
	pacstrap /mnt base base-devel syslinux vim
```   
p.s:这里需要说明一下,一般来说base就够了,不过后期安装软件基本上会用到base-devel,所以把这个系统软件包组也选上;syslinux是引导程序包(可以根据习惯调整为grub2),双系统情况下,如果物理机器上不想用syslinux覆盖磁盘mbr来引导的,可以通过grub4dos之类的引导linux,具体google一大把;vim是编辑软件,仅仅是为了方便安装完基本系统后编辑配置文件,如果不喜欢的可以用nano 或者安装其他编辑工具

![安装基本系统](/images/2014/archinstall/34.png)    

回车后会自动查找源,下载软件包,安装  
![安装基本系统](/images/2014/archinstall/35.png)    

键入   
```shell
	pacstrap -i /mnt net-tools
```    
p.s:也许大多数人对ifconfig这种网络配置命令比较习惯,那么请安装net-tools软件包,而且安装可以添加 i 参数实现一定程度上的交互式安装,这样就不会像上面一样自动下载安装,这里可以不执行,不影响系统搭建  
![安装基本系统](/images/2014/archinstall/36.png)   
![安装基本系统](/images/2014/archinstall/37.png)   

用AIS脚本自动生成fstab,也就是当前磁盘挂载情况的文件
键入  
```shell
	genfstab -p /mnt >> /mnt/etc/fstab
```  
\>> 是Unix Like下面常见的重定向符号  
![安装基本系统](/images/2014/archinstall/38.png)   

chroot到刚才安装完毕的基本系统,进行最基础的系统配置
键入  
```shell
	archroot /mnt
```  
![安装基本系统](/images/2014/archinstall/39.png)   

进入到新环境以后的情况,可以看到终端前面的提示符已经发生了变化  
![安装基本系统](/images/2014/archinstall/40.png)   

## <a name="basicsetup">七、基本系统配置</a>  

### <a name="language">A.设置语言</a>  
设置系统支持的locale,只需要找到en_US 以及zh_CN开头的,然后把注释符号#去掉即可
键入  
```shell
	vim /etc/locale.gen
```  
![语言设置](/images/2014/archinstall/41.png)   
![语言设置](/images/2014/archinstall/42.png)   
![语言设置](/images/2014/archinstall/43.png)    
保存退出  
![语言设置](/images/2014/archinstall/44.png)   

执行
```shell
	locale-gen
```  
![语言设置](/images/2014/archinstall/45.png)   

设置系统默认的locale,这里决定了进入桌面后是英文界面还是中文界面,我习惯了英文界面,所以设置如下图2所示,喜欢中文界面的可以简单设置为LANG=zh_CN.UTF-8
键入  
```shell
	vim /etc/locale.conf  
```  
添加适合自己的locale
![语言设置](/images/2014/archinstall/46.png)  
![语言设置](/images/2014/archinstall/47.png)     

### <a name="hostname">B.设置主机名</a>  
键入  
```shell
	vim /etc/hostname  
```  
里面添加自己喜欢的名称,这里演示输入zhongguoyidou,请根据自己的喜好更改 
![设置主机名](/images/2014/archinstall/48.png)  
![设置主机名](/images/2014/archinstall/49.png)  

修改 hosts文件,添加刚才设置的主机名
键入  
```shell
	vim /etc/hosts
```  
![设置主机名](/images/2014/archinstall/50.png)  
![设置主机名](/images/2014/archinstall/51.png)  

### <a name="timezone">C.设置时区</a>
设置时区为亚洲/上海,创建一个软链接即可
键入 
```shell
	ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  
```   

```shell
	vim /etc/timezone
```  
添加Asia/Shanghai 这一行后保存退出

多系统的可以设置为本地时间,避免出现系统切换时间8小时之差的情况
键入   
```shell
	hwclock --systohc --localtime
```  
![设置时区](/images/2014/archinstall/52.png)  
### <a name="ramdisk">D.创建ramdisk</a>
键入   
```shell
	mkinitcpio -p linux 
```  
如果不满意默认配制的自行根据需要修改 /etc/mkinitcpio.conf 再执行此命令创建,一般来说默认即可  
![创建ramdisk](/images/2014/archinstall/53.png)  
###<a name="checksyslinux">E.检查syslinux的配置文件是否正确</a>  
键入  
```shell
	vim /boot/syslinux/syslinux.cfg  
```  
如果分区规划跟我一样的可以不检查也行,默认的就可以.其他自行检查append root=/dev/sdax 这行的sdax ----- 设置为正确的根节点所在分区即可  

![检查syslinux的配置文件是否正确](/images/2014/archinstall/54.png)  
![检查syslinux的配置文件是否正确](/images/2014/archinstall/55.png)  

### <a name="syslinux">F.安装syslinux启动管理器,以便实现ArchLinux的顺利启动</a>
键入  
```shell
	syslinux-install_update -iam
```  
![检查syslinux的配置文件是否正确](/images/2014/archinstall/56.png)  


###<a name="root">G.为root超级用户添加密码</a>
键入  
```shell
	passwd  
```
输入密码需要两遍以确认是否一致,且密码不会显示在屏幕上  
![为root超级用户添加密码](/images/2014/archinstall/57.png)  

### <a name="exit">H.退出当前系统环境</a>
键入  
```shell
	exit
```
![退出当前系统环境](/images/2014/archinstall/58.png)  

返回到安装镜像启动所在的系统环境
键入  
```shell
	umount /mnt/boot
	umount /mnt/
	reboot
```  
关机并且从磁盘引导系统  
![关机并且从磁盘引导系统](/images/2014/archinstall/59.png)  

重起后的系统初始选择界面   
![重起后的系统初始选择界面](/images/2014/archinstall/60.png)  

启动系统后要求输入用户名以及密码
键入  
```shell
	root
```  
输入密码  
![登录系统](/images/2014/archinstall/61.png)  

顺利进入系统  
![登录系统](/images/2014/archinstall/62.png)    

### <a name="adduser">I.添加用户</a>  
添加一个普通用户,比如这里的kafan_zhongguoyidou,具体的其他参数自己google
键入  
```shell
	useradd -m -s /bin/bash kafan_zhongguoyidou
```  
![添加一个普通用户](/images/2014/archinstall/63.jpg) 
添加完毕为普通用户设定一个密码
键入  
```shell
	passwd kafan_zhongguoyidou
```  
为刚才添加的普通用户添加sudo的相关权限,这里只做一点简要设置,其他自己参阅
键入 visudo
找到图示中root那行,添加图示一行  
![添加一个普通用户](/images/2014/archinstall/64.png)  
![添加一个普通用户](/images/2014/archinstall/65.png) 

### <a name="network">J.配置网络</a>  
```shell
	##查看可用网卡
	ifconfig -a
	##启动网卡
	ifconfig eth0 up
	##获取ip
	dhcpcd  eth0
```  

### <a name="xdestop">K.安装X桌面环境</a>  
这里以xfce4这个折中的桌面套件来演示,可以根据自己的爱好选择其他桌面套件或者窗口管理器,接下来不配过多的图,主要叙述一下软件包安装相关指令
进入系统后首先更新软件包相关数据,如果提示有更新先更新一下软件
键入  
```shell
	pacman -Syu
```  
![添加一个普通用户](/images/2014/archinstall/66.png)

如果你不知道自己是什么显卡，就用下面的命令查看下：  
```shell
	lspci | grep VGA
```  
然后执行下面的命令搜索下匹配你显卡的驱动  
```shell
	pacman -Ss xf86-video | less
```  
我是VirtualBox，所以我就安装一个万能的，你们安装匹配的，比如你是Intel集成的就执行：  
```shell
	pacman -S xf86-video-intel
```  
虚拟机就执行  
```shell
	pacman -S xf86-video-vesa
```  
笔记本还可以装下触摸板驱动  
```shell
	pacman -S xf86-input-synaptics
```  
安装声卡驱动
键入  
```shell
	pacman -S alsa-utils
```  
测试X环境是否安装好了，可以执行下面的命令，其实不用测试。  
```shell  
	pacman -S xorg-twm xorg-xclock xterm 
	startx 
	exit 
	pkill X
```  
###<a name="xfce4">L.安装XFCE4 桌面套件</a>
先安装slim，这是一个图像、登录管理器，可用于xfce4的自启动。  
```shell
	pacman -S slim
```
安装完成后需要执行来自启动
```shell  
	systemctl enable slim.service   
```  
键入
```shell
	pacman -S xfce4
```  
出现的软件包组选择全部即可

安装sudo,让普通用户无需切换执行一些root用户指令
键入  
```shell
	pacman -S sudo
```  

安装中文字体
键入  
```shell
	pacman -S wqy-microhei wqy-zenhei wqy-bitmapfont
```  
至于美化，都是通过界面操作的，system-setting可以设置字体，另外terminal的preference可以设置它用的字体。

现在，大功告成！！启动！！！
```shell
	startxfce4
```  
![添加一个普通用户](/images/2014/archinstall/67.jpg)   

### <a name="xfce4auto">M.设置xfce4自启动</a>　　
要将SLiM配置为加载某个特定的环境，只需编辑~/.xinitrc如下：  
```shell
	#!/bin/sh
	
	#
	# ~/.xinitrc
	#
	# Executed by startx (run your window manager from here)
	#
	
	exec [session-command]
```  
注意：如果你没有~/.xinitrc文件，可以从系统中复制一个：  
```shell
	$ cp /etc/skel/.xinitrc ~
```  
将[session-command]替换为适当的会话命令。例如：

要启动Xfce:  
```shell
	# Xfce
	exec startxfce4
```  
要启动Openbox：  
```shell
	# Openbox
	exec openbox-session
```  
要启动Fluxbox:  
```shell
	# Fluxbox
	exec fluxbox
	# Either fluxbox or startfluxbox is acceptable
```  
要启动GNOME:  
```shell
	# GNOME
	exec gnome-session
```  
要启动KDE:  
```shell
	# KDE
	exec startkde
```  
如果你的桌面环境不在上述列表中，请参考你的软件文档  

###<a name="inputmethod">N.安装浏览器和输入法</a>  
键入  
```shell
	pacman -S firefox
```  
安装火狐浏览器  

键入  
```shell
	pacman -S fcitx fcitx-gtk fcitx-gtk2 fcitx-gtk3 fcitx-qt fcitx-configtool  
```  
安装小企鹅输入法  
p.s:这里如果不安装gtk和configtool的话的是没有图形配置界面的  

然后编辑~/.profile  设置一些参数
```shell
	export GTK_IM_MODULE=fcitx
 	export QT_IM_MODULE=fcitx
	export XMODIFIERS="@im=fcitx"
	killall fcitx
	fcitx &
```   

### <a name="yaourt">O.安装yaourt</a>

Yaourt是archlinux方便使用的关键部件之一，但没有被整合到系统安装中的工具。建议在装完系统重启之后，更新完pacman和基本系统之后，就安装这个工具。   

安装方法有下面两种：建议使用第一种，如果要体验AUR的操作过程和使用方法，建议使用第二种方法安装。   

简便的安装  

最简单安装Yaourt的方式是添加Yaourt源至您的 /etc/pacman.conf:  
```shell
	[archlinuxcn]
	#The Chinese Arch Linux communities packages.
	SigLevel = Optional TrustAll
	Server   = http://repo.archlinuxcn.org/$arch
```  

或者 
```shell
[archlinuxfr]
Server = http://repo.archlinux.fr/$arch
```  

或者 
```shell
 [archlinuxfr]
 Server = http://repo-fr.archlinuxcn.org/$arch
```  
P.S:注意 必须要加上 SigLevel = Optional TrustAll,否则会报package-query: missing required signature错误

同步并安装： 
```shell
# pacman -Syu yaourt
```  

## <a name="vbaddition">八、为VBOX安装增强功能</a>  
键入
```shell
	pacman -S virtualbox-guest-utils
```   
重启即可

## 9.<a name="adv">附录</a>  
### a.<a name="slimthemes">为slim安装主题</a>
键入  
```shell
	cd /usr/share/slim/themes
	ls
```   
可以查看当前所有可用主题   
键入   
```shell
	pacman -S slim-themes
```  
安装其它主题,选择一个喜欢的然后键入   
```shell
	vim /etc/slim.conf
```
找到current theme配置项修改即可  

### b.<a name="feh">看图软件feh</a>
键入  
```shell
	pacman -S feh
```  
### c.<a name="zsh">zsh</a>
键入  
```shell  
	pacman -S zsh
```  
### d.<a name="ksh">ksh</a>
键入  
```shell
	yaourt -S ksh
```  

### e.<a name="office">office</a>
键入 
```shell
	pacman -S libreoffice
```  

### f.<a name="sublime">文本编辑工具sublime</a>
键入   
```shell
	yaourt -S sublime-text-dev
```

### j.<a name="wicd">网络管理工具wicd</a>  
键入   
```shell  
	pacman -Sy wicd wicd-gtk
```  
你很可能还要安装DHCP和无线安全管理程序。
键入   
```shell  
	pacman -S dhclient wpa_supplicant
```
编辑/etc/rc.conf文件
```shell
	vim /etc/rc.conf
	DAEMONS = (syslog-ng !network wicd dbus alsa)
```  
在network前面加上 ! 并在network后加上 wicd

为用户添加组权限  
```shell
	gpasswd -a USERNAME users
	gpasswd -a USERNAME network
```  
启动服务
```shell  
	systemctl start wicd
```  
运行  
```shell  
	wicd-client
```   
通知栏按钮  
```shell  
	wicd-client --tray
```  
清除通知栏按钮  
```shell  
	wicd-client -n
```   


### h.<a name="netctl">使用netctl</a>  
经过一段时间的使用发现wicd有些不尽如人意的地方,所以已经换成了netctl来管理
具体设置可以完全参考wiki,要注意的是需要把dhcpcd关掉不然会启动失败
```shell
	systemctl disable dhcpcd@ethX.service
```
由于我是采用双网卡模式,A网卡是自动获取IP,B网卡是采用静态IP
所以只需要禁用掉B网卡的dhcpcd即可,并且参考wiki将静态ip的profile文件添加到自启动即可
常用命令如下
```shell
	#复制配置文件
	cp /etc/netctl/examples/wireless-wpa /etc/netctl/profile
	#修改配置文件
	vim profile
	#手动启动配置文件
	netctl start profile
	#查看配置文件状态
	netctl status profile
	#设置配置文件自启动
	netctl enable profile
	#去除配置文件自启动
	netctl disable profile
	#重新加载配置文件
	netctl reenable profile
```
p.s:需要注意的是配置文件中
IP和Routes节点不可同时放开,否则会因为冲突而导致加载配置文件失败





__参考资料  
*[Archlinux网络配置](http://www.cnblogs.com/mad/p/3280041.html)  

*[如何安装ArchLinux](http://blog.csdn.net/helloanyone/article/details/7012487)  

*[大道至简,原来你就是这么KISS---ArchLinux基本系统到XFCE4桌面搭建](http://bbs.kafan.cn/thread-1371928-1-1.html)   

*[Arch镜像列表](https://www.archlinux.org/mirrors/status)   

*Arch wiki - slim安装  
https://wiki.archlinux.org/index.php?title=SLiM_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)&oldid=212382  

*Arch wiki - yaourt安装  
https://wiki.archlinux.org/index.php/Yaourt_%28%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%29

*Arch wiki - wicd安装
https://wiki.archlinux.org/index.php/Wicd

*Arch wiki - netctl使用
https://wiki.archlinux.org/index.php/Netctl_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)