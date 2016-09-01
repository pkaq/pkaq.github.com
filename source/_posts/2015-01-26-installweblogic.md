title: Webloigc 12 zip安装
date: 2015-01-26 21:27:10
tags: ['webloigc']
categories: 'Web server'
---

### 安装  
0.从oracle官网下载webloigc的zip包/jar安装文件  

a.jar安装方式  
	此种方式比较简单直接执行java -jar fmw_xxx.jar即可  
	p.s:默认情况下java命令调用的是jre下面的,需要显示指定jdk/bin目录下的java程序来执行此jar文件才可以,具体安装过程有图形界面基本都是下一步之类的操作,这里不再赘述.  
	
b.zip安装方式  
	1.解压zip包到一个路径下,并指定MW_HOME为该解出目录    
	2.运行configure.sh,此时会进入安装程序,中间过程会询问是否创建新的domain,可以按照步骤进行创建    

![创建domain](/images/2015/weblogic/1.png)  

<!-- more -->  

![启动](/images/2015/weblogic/2.png)  


3.安装成功后如图,访问  
http://localhost:7001/console   
用中途创建的用户名/密码登陆即可  
 ![登陆界面](/images/2015/weblogic/3.png) 
 ![登陆成功](/images/2015/weblogic/4.png) 


p.s: 安装过程中请保证你所有用到的路径中不要有中文或者空格


## 启动与停止  

访问你的domain目录,执行startWeblogic.sh即可;
domain目录在 $MW_HOME/user_projects/domain/domain_name


## 项目发布  
可以直接将war包保存到$MW_HOME/user_projects/domain/domain_name/autodeploy下会自动部署
或者通过控制面板->部署->安装,按照界面提示操作

## SSL配置  
以参考此文章:
http://www.wosign.com/Docdownload/WeblogicSSL证书部署指南.pdf

此文档给出的是weblogic 9的中文版配置,为了方便中文不好的同学,下面我复述一下 weblogic 12 英文版的配置


### 进入配置
0.登陆 Weblogic 成功后，来到此页面点击“environment”中的“servers” 
![登陆服务器](/images/2015/weblogic/0-ssl1.png) 

1.点击图中红圈位置,进入设备管理器
![登陆服务器](/images/2015/weblogic/1-ssl2.png) 

### 启用SSL端口  

将已启用 SSL 监听端口打勾启动，然后将默认“ 7002”改为“ 443”；  
修改完成后，记得要点击“保存”，这样基本的端口设备完成；  
再点击“密钥库”来进行配置证书路径文件；  
![启用端口](/images/2015/weblogic/enableport.png) 

### 配置keystore  

第一： 密钥库：必须选择“自定义标示和 JAVA 标准信任”；  
第二：指定您的 JKS 证书文件路劲(例如： C:\SSL.jks)；并且标示密钥库类型： JKS； 
第三： 输入您的 JKS 密码和再次输入确认您的密码； 
第四：信任区域中，可以不做任何改动； 
第五：修改完成后，记得要点击“保存”； 
注释：（上图长方形圈起的部分，默认密码栏目为空。此处密码可以和自己的 JKS 一样，也可以不做任何改动，此处是不影响证书正常使用。）  
![配置keystore](/images/2015/weblogic/keystore.png)  

### 配置SSL  

第一：标识和信任位置：选择密钥库；  
第二：私钥别名：也就是 JKS 的别名 (WoSign 颁发的 JKS 证书文件中别名默认为： 1)；  
第三： 私钥密码：输入您申请时候设置的密码，以及再次输入确认密码；  
第四：修改完成后，记得要点击“保存”；  
![配置SSL](/images/2015/weblogic/ssl.png)  

重启SSL使配置生效

点击“environment”中的“servers” ,切换到control标签,选中你的domain 点击restartSSL
![配置SSL](/images/2015/weblogic/restartssl.png)  


扩展阅读:
weblogic的基本概念

### Oracle Weblogic Server Domain   
Weblogic Server Domain（域）是一个逻辑的管理单元，一个Oracle WebLogic Server域是多个Java组件的逻辑相关组。Domain是weblogic中最大的概念，一个域下面包含着weblogic应用服务器中的所有东西，weblogic应用服务器的启动，停止都是以domain为单位进行管理的。域是由单个管理服务器管理的WebLogic Server实例的集合。
一个weblogic domain包含了一个特定weblogic 服务器实例：Administration Server，Administration Server是整个domain的配置以及管理所有资源的中心点。通常情况下，还会在这个domain中通过配置来扩展出其他的weblogic服务器实例，扩展出来的服务器实例叫做Managed Server。可以将java组件，例如EJB应用，Web Service，各种JAVAEE应用部署到Managed Server上，与此同时Administration Server只是用来进行配置以及管理的。在一个domain中，成组的managed server会作为集群。
Weblogic domain的目录和weblogic安装目录是区分开的，domain的目录可以放置于任何地方，也可以不在Middleware Home里面。
Domain与Oracle instance是同级的，所有的相关配置文件都在 oracle home外面。
 
### Administration Server  
Administration server是作为整个domain配置的中心控制实体。Admin Server维护着domain的配置文件以及将配置分配到每个managed server中。Admin Server作为整个domain所有资源的监视中心。每个domain都必须存在着一个Admin Server。
与Admin Server交互，可以通过三种方式：Admin Server console，Oracle WebLogic Scripting Tool (WLST)，或者创建Java Management Extension (JMX) 客户端。另外，还可以使用fusion middleware的控制console（EM）来进行其中的某些事情。Console与EM都是运行在Admin Server上的。Console是基于Web用来对整个domain的资源进行管理的，包含了Admin Server以及Managed Server。EM也是基于Web的管理控制台，用以管理所有的中间件组件，例如webcenter，soa，http server等。
 
### Managed Servers和Managed Server Clusters  
Managed Server上包含了商业应用，应用组件，Web Service，其他相关资源等等。为了优化性能，managed server维护着一个只读的domain配置文件。当一个managed server启动的时候，它会连接到Admin Server去同步的配置文件，配置文件是由Admin Server进行维护的。
当创建一个domain的时候，你可以去选择特定的模板去进行创建，这个模板会包含了所有你的domain的配置信息。模板可以针对不同的使用进行额外的安装。模板会支持特定的组件或者是支持特定的某组组件，例如Oracle SOA Suit。一般会针对不同的组件去创建肚子的managed server。
Oracle中间件的java组件（例如Oracle SOA, Webcenter，UCM等）以及自己开发的应用都是部署到managed server上的。Managed Server是java virtrual machine（JVM）进程。
如果你想添加某个组件到domain中，例如webcenter，你可以通过使用相应模板去扩展，创建新的managed server。 
一般情况下，生产环境为了提高应用的性能，吞吐以及高可用，会去配置两个或者多个managed server作为集群来使用。集群就是多个同时运行，一起工作的weblogic 服务器实例的集合，集群提高了可扩展性以及可靠性。在集群中，大多数资源以及服务会对等的部署到每一个managed server中，启用故障切换以及负载均衡。一个domain可以包含多个集群。做集群和不做集群最主要的差别是故障切换与负载均衡。

### Node Manager  
节点管理器是区分于weblogic服务器的一个独立运行的java工具进程，节点管理器使你能够去对managed server进行通常的操作，而不用去管相关的Admin Server在哪里。一般情况下，需要对应用对高可用配置的时候，就会启用节点管理器。节点管理器可以对managed server执行如下操作：
Start
Stop
Process Monitoring
Death Detection
Restart
如果启动了节点管理器对managed server进行管理，你就可以通过weblogic console或者命令行来针对被管理的managed server进行相应的操作。节点管理器还可以在出现未可预料的错误的时候去自动重启managed server。


 __参考资料
 *[WebLogic 12 官方安装指导](http://www.oracle.com/technetwork/middleware/ias/downloads/wls1033-dev-readme-131493.txt)