title: 使用WSL2读写linux分区
date: 2023-03-18 11:04:56
tags: ['Linux']
categories: 操作系统
author: PKAQ
---

目前WLS2已经支持挂载读写Linux分区，可以无需借助Ext2fsd等工具让Windows下读写Linux分区更加方便，具体操作如下。


1.开始菜单右键点击设置-搜索开发者设置->打开开发人员模式

2.控制面板-程序
安装 
	- 适用于linux得windows子系统
	- hyper-v支持

3.bios打开虚拟化支持,这个根据自己的电脑BIOS版本自行设置。

4.
使用PowerShell 输入如下命令
```bash
wsl -l -v
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

5.安装Linux 内核更新包：

[下载地址](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi),下载完成安装即可

6.设置WSL 2 为默认版本：
```bash
wsl --set-default-version 2
```

7.安装一个发行版
```bash
wsl --list --online

wsl -install Ubuntu
```
8.识别磁盘：列出 Windows 中的可用磁盘。
```bash
GET-CimInstance -query "SELECT * from Win32_DiskDrive" 
```

9.挂载磁盘
```bash
wsl --mount <DeviceId> --bare 
wsl --mount <DeviceId> --partition 1
```
10.打开资源管理器访问
```bash
\\wsl.localhost\Ubuntu\mnt\wsl\PHYSICALDRIVE1p1
```