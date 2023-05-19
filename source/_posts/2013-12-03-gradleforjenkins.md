title: Jenkins+Gradle搭建CI环境（过时）
date: 2013-12-03 09:52:39
tags: ['Jenkins','Gradle']
categories: ['Build Tools','DevOps']
author: PKAQ
---

#### 版本说明
* jenkins 1.542
* jdk 1.6u45
* gradle 1.9

#### 必要条件
* 需要安装JDK并配置配置好JAVA_HOME和JRE_HOME的环境变量

1. 下载jenkins.war
去[Jenkins官方网站]("http://www.jenkins-ci.org/")下载相应war包即可

2. 使用命令行跳转到jenkins所在目录
可以有两种方法进行运行 jenkins
	a)	直接通过命令行
	转到hudson.war所在的目录，当前为
	java -jar jenkins.war --httpPort=8080
	说明：httpPort为jenkins运行的端口，默认端口为8080，上述命令其实jenkins运行在Winstone容器中；
	b)	在Web容器中运行
	jenkins可以运行在标准的Web服务器中，支持Tomcat、Jboss、WebLogic中，只需要将jenkins.war放置到相应目录，启动服务就可以进行访问；

3. 访问jenkins http://localhost:8080/
<!-- more -->
4. 安装gradle插件
	点击系统管理->插件管理
	选择"可安装插件"tab页,过滤出gradle plugin然后勾选点击直接安装即可
	如果需要自动部署还需要安装deploy plugin

5. 配置
	* 鉴权配置
		点击系统管理 选择Configure Global Security 点击"启用安全"
		在访问控制下的安全域 勾选 jenkins专有用户数据库
		在访问控制下的授权策略里 更改为 "登录用户可以做任何事"
		点击保存会跳转到登陆界面,点击创建一个新用户注册一个新用户即可
	* 系统配置
		系统管理->系统配置->找到gradle项目,把自动安装前面的勾去掉即可设置本地gradle目录
		![gradle config](/images/2013/12/03/6.png)

6. 创建任务
	6.1. 点击界面的"创建一个构建任务"进行创建;填入job名称 选择构建一个自由风格的项目
	![project config](/images/2013/12/03/1.png)
	
	6.2. 点击下一步,在"源码管理"选项下选择 subversion repository URL输入你的项目svn地址,第一次输入完之后会给出红色提示说鉴权不通过,点击enter authority,然后选择username/password输入鉴权信息即可(如果你是采用username/password方式的话),其余的保持默认即可
	![subversion config](/images/2013/12/03/2.png)
	
	6.3. 如果希望定时构建可以在"构建触发器"选项下 选择build periodically填写cron表达式来控制构建周期 比如每天20:00构建 H 20 * * *
	![cron config](/images/2013/12/03/3.png)
	
	6.4. 在"构建"选项下 点击 增加构建步骤 选择 invoke gradle script 在tasks下填入要执行的任务即可
	![gradlescript config](/images/2013/12/03/4.png)
	
	6.5. 自动部署
	在"构建后操作"选项下,点击 增加构建步骤 选择 delply war/ear to a container
	
	在war/ear files下填入war包所在位置 如target/libs/CIMS.war
	context path填写项目名称 如 CIMS
	container选择容器版本 如tomcat
	这里需要更改目标tomcat配置 添加相应用户 然后填入相应内容即可
	![deploy config](/images/2013/12/03/5.png)
	
	p.s:此步需要修改目标tomcat的配置
	```shell
	vi $tomcat/conf/tomcat-usres.xml
	<!-- 必须开启这两个权限,不然会出现 如下错误,同时该错误也可能由于内存溢出而导致ERROR: Publisher hudson.plugins.deploy.DeployPublisher aborted due to exception   -->
	<role rolename="manager-script"/>
	<role rolename="manager-gui"/>	
	<user username="jenkins" password="jenkins" roles="tomcat,manager-script,manager-gui"/>
	```
	
7. 点击保存,搭建完成