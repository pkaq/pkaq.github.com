title: 借助Libreoffice/Openoffice实现Excel在线预览
date: 2013-10-16 17:44:40
tags: ['Java']
categories: ['Java']
author: PKAQ
---

有时候你可能需要对客户上传的excel文件提供在线预览的方式,类似很多邮箱直接点击就可以在线查看.但很多第三方工具都是收费的而自己遍历excel重绘界面又比较麻烦;
当然如果要求事先将excel另存为html然后上传直接显示是没问题的,但显然这不够科学;那如何才能实现科学预览呢.其实直接借助Libreoffice/Openoffice在点击预览后,后台悄悄把excel另存成html就好了;具体方式如下

以Centos 6.4为例;
### 1.安装桌面环境和office(如果已经安装的可以忽略此步骤)
如果没有安装桌面环境的话需要先执行如下命令安装

**安装x window**
```shell
	yum groupinstall 'X Window System' -y 
```

**安装桌面**
```shell
	yum groupinstall 'Desktop' -y 
```

**安装office**
```shell
	yum groupinstall 'Office Suite and Productivity' -y 
```
<!-- more -->

P.S:不同版本的系统可能名称会有些许差异,这时可以用yum grouplist | more 来查看要安装的具体名称

### 2.启动openoffice 服务

进行这一步之前,如果你进行了步骤1,安装完成后需要startx 进入桌面环境,否则会报如下错误
```shell
/program/soffice.bin X11 error: Can't open display: 
  Set DISPLAY environment variable, use -display option 
  or check permissions of your X-Server 
  (See "man X" resp. "man xhost" for details) 
```
可以修改/etc/inittab,设置默认从桌面启动
```shell
	vi /etc/inittab
```
找到里面的 
```shell
	id:3:initdefault:
```
将里面的3改成5,3是文本模式,5是桌面模式;

运行如下命令启动openoffice服务
```shell
soffice --headless --accept="socket,host=127.0.0.1,port=8100;urp;" --nofirststartwizard &
```

### 3.程序调用
其实就是通过程序调用office服务,然后很猥琐的将excel偷偷转化成html输出到项目下的某个文件夹里,然后页面直接加载这个html文件就可以了,以下是我当前项目的调用示例,依赖的jar我放到网盘了 需要可以下载.

[下载依赖jar](http://url.cn/MG3Lwn)

```java
        String fileID = this.getRequest().getParameter("fileID");
        
        FileUpDown fileUpDown = this.fileUpDownManager.get(fileID);
        
        String filePath = fileUpDown.getFilePath();
        String fileName = fileUpDown.getFileName();
        
        //处理文件扩展名
        String[] fileNameArr = fileName.split("\\.");
        String extendName = fileNameArr[fileNameArr.length-1];
        extendName = extendName.toLowerCase();

        /**浏览器支持格式*/
        String[] browserFormatArr = {"txt","jpg","jpeg","bmp","gif","png"};
        /**Openoffice支持格式*/
        String[] officeFormatArr = {"doc","docx","xls","xlsx","ppt","pptx"};

        boolean browserFormatFlag = false;
        boolean officeFormatFlag = false;
        for(int i=0;i<officeFormatArr.length;i++){
            if(extendName.equals(browserFormatArr[i])){
                browserFormatFlag = true;
            }
            if(extendName.equals(officeFormatArr[i])){
                officeFormatFlag = true;
            }
        }
        
        //处理输入的文件
        String fullRelativePath = filePath+"/"+fileName;
        String realPath = ServletActionContext.getServletContext().getRealPath(fullRelativePath);
        File inFile = new File(realPath);
        
        //处理输出目录
        UserView userView = (UserView) this.getSession().getAttribute(Constants.USER_VIEW);
        String outFileParentRelativePath = "tmpUploadFile/preview/"+userView.getId();
        String outFileParentRealPath = ServletActionContext.getServletContext().getRealPath(outFileParentRelativePath);
        
        //输出文件处理前  先清空输出目录
        File outFileParent = new File(outFileParentRealPath);
        if(outFileParent.exists()){
            deleteFiles(outFileParent);
        }

        //分辨文件类型  执行不同处理
        if(browserFormatFlag){                      //浏览器可直接打开的文件，复制文件到预览目录并重命名为preview.(extendName)
            String outFileRelativePath = outFileParentRelativePath + "/preview"+new Date().getTime()+"." + extendName ;
            String outFileRealPath = ServletActionContext.getServletContext().getRealPath(outFileRelativePath);
            File outFile = new File(outFileRealPath);
            
            if("txt".equals(extendName)){
                //文本文件要特殊处理一下   全部转换为web.xml中设置的编码格式  UTF-8   否则会乱码
                FileUtils.writeLines(outFile, "UTF-8", FileUtils.readLines(inFile, "GBK")); 
            }else{
                FileUtils.copyFile(inFile, outFile);    
            }
            
            this.print("{success:true,previewPath:'"+outFileRelativePath+"'}");
        }else if(officeFormatFlag){     //Office文档，使用Openoffice处理成html
            String outFileRealPath = outFileParentRealPath + "/preview.html" ;
            File outFile = new File(outFileRealPath);
            
            if(convertDocToHtml(inFile,outFile)){
                //更改扩展名html -> htm   原因：html已经被设置为struts的Action后缀名
                String jspFileRelativePath = outFileParentRelativePath + "/preview.htm" ;
                File jspFile = new File(outFileParentRealPath + "/preview.htm" );
                outFile.renameTo(jspFile);
                this.print("{success:true,previewPath:'"+jspFileRelativePath+"'}");
            }else{
                this.print("{success:false,msg:'文件转换出现错误，预览失败。'}");
            }
        }else{
            this.print("{success:false,msg:'不支持的文件格式("+extendName+")，请下载到本地计算机上预览。'}");
        }
        
        return NONE;
 ```   