title: WebSphere安装
date: 2015-01-27 18:59:53
tags:
---

### 下载与安装
首先需要下载install manager :  
https://jazz.net/downloads/ibm-installation-manager/

然后下载websphere
http://www.ibm.com/developerworks/cn/downloads/ws/wasdevelopers/

安装install manager后,解压WebSphere,通过install manager选择WebSphere解压目录作为安装源,根据向导安装完成即可.
<!-- more -->
### 部署
安装完毕后会启动一个toolbox向导,创建一个应用服务器的概要文件即可,启动与停止可以通过webaphere application server控制台窗口进行控制
具体部署应用可通过应用程序->新建应用程序,按照向导提示进行部署
![项目部署](/images/2015/WebSphere/deploy.png) 

### 配置SSL

我们这里介绍的WAS SSL配置是基于WAS的Application Server基础之上，如果要基于WAS的Http Server请参考其它章节。这里介绍的是在已安装好的WAS Application Server上配置SSL，因为WAS提供了完善的可视化配置界面，所以整个配置过程相比Tomcat要简单和直观很多，具体配置步骤如下。
1.首先进入WAS的管理控制台，展开左边菜单当中"安全性一栏"，点击其中的"证书和密钥管理"，如下图所示：
![项目部署](/images/2015/WebSphere/1.png) 
点击之后，在右边出现的页面当中点击"管理端点安全配置"，如下图所示：
![项目部署](/images/2015/WebSphere/2.png) 
在出现的"管理端点安全配置"出现的配置页面当中，我们首先选择"入站"配置，点击如下图所示的链接：
![项目部署](/images/2015/WebSphere/3.png) 
在当前节点配置页面当中，点击"管理证书"按钮，将我们创建的名为server.keystore的证书文件添加到WAS当中。如下图所示：
![项目部署](/images/2015/WebSphere/4.png) 
在出现的证书管理窗口当中，通过点击"导入"按钮，将我们创建的名为server.keystore证书文件导入到证书库中。
![项目部署](/images/2015/WebSphere/5.png) 
当然，如果您没有这个server.keystore文件，也可以通过这个窗口当中的提供的名为"创建自签署证书"按钮来创建一个新的证书，可以看到，这个创建界面与JDK当中提供的功能相同，只是它是以可视化的方式供我们创建一个证书。
选择导入证书后，我们可以看到如下图所示界面：
![项目部署](/images/2015/WebSphere/6.png) 
密钥文件名：是指包含完整路径的本地和server.keystore的位置，比如：E:\cas\server.keystore等
类型:我们的server.keystore加密类型为JKS，所以需要从下拉框中选择JKS即可。
密钥文件密码:我们在生成这个server.keystore证书时使用的密码，我们这里是changeit，所以输入changeit即可。
一旦这三个属性输入完成，可以点击"密钥文件密码"属性边上的"获取密钥文件别名"按钮，如果我们前三个属性输入正确，就可以在下面的"要导入的证书别名"属性列表中看到server.keystore证书的别名，我们这里为"tomcat"，最后点击确定保存即可，输入好的信息如下图所示：
![项目部署](/images/2015/WebSphere/7.png) 
返回到"管理端点安全配置"窗口，点击入站Node节点，进入到该节点的具体配置界面，将其"密钥库中的证书别名"属性值修改为我们之前添加的server.keystore证书，它的别名为tomcat，如下图所示：
![项目部署](/images/2015/WebSphere/8.png) 
再次回到"管理端点安全配置"窗口，点击出站Node节点，进入到该节点的具体配置界面,同样将其"密钥库中的证书别名"属性值修改为我们之前添加的server.keystore证书，它的别名为tomcat，这些工作做完之后，我们就将当前WAS Application Server的SSL采用的证书修改成我们自定义的名为server.keystore的证书。
WAS Application Server证书配置完成之后，为了验证当前证书配置的正确性，可以点击浏览器的地址栏中的证书信息进行查看，如下图所示：
![项目部署](/images/2015/WebSphere/9.png) 
最后可以将我们的CAS Server部署到WAS application Server当中，并配置好相应的应用客户端，测试其运行是否正常。