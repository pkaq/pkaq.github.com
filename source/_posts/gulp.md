title: grunt -- > gulp,从grunt转向gulp管理前端构建
date: 2016-01-14 16:48:03
tags: ['gulp',前端','构建工具']
categories: ['构建工具','前端']
author: PKAQ
---

#### 写在前面
  在JavaScript的世界里，Grunt.js是基于Node.js的自动化任务运行器。2013年02月18日，Grunt v0.4.0 发布。Fractal公司积极参与了数个流行Node.js模块的开发，它去年发布了一个新的构建系统Gulp，希望能够取其精华，并取代Grunt，成为最流行的JavaScript任务运行器。
  
  不好意思，上面一段是抄的，原文请看[前端工程的构建工具对比 Gulp vs Grunt](http://segmentfault.com/a/1190000002491282)  
  
  没错，正是因为这篇文章，无意中发现了gulp，试用之后也大有当年从maven切换到gradle的快感   
  所以，以后的日子还是让gulp来陪伴吧

<!-- more -->

#### 安装
  [官方入门指南](http://www.gulpjs.com.cn/docs/getting-started/)
```shell
	npm install --global gulp
```

#### 初始化
  同样的安装完在你的项目目录用npm init初始化一个package.json文件，并且创建gulpfile.js文件   
  
#### 寻找插件
 [点我传送](http://gulpjs.com/plugins/)
 
#### 继续
因为实在太简单，所以我打算直接贴脚本并且通过在脚本里加注释的方式来说明剩下的部分   
因为基本就是引入插件然后配置下插件相关属性就行了，而这一切插件介绍里也说的很明白了  
关于复制目录结构的事情 下面的复制任务里有  

```javascript
var gulp = require('gulp'),
//	图片压缩插件
	imagemin = require('gulp-imagemin'),
//	深度压缩png图片插件
	imageminPngquant = require('imagemin-pngquant'),
//	使用”gulp-cache”只压缩修改的图片插件
	cache = require('gulp-cache');
    
//图片压缩任务
gulp.task('imagemin', function() {
 	gulp.src('image/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()] 
        }))
        //图片压缩质量
    	.pipe(imageminPngquant({quality: '65-80', speed: 2})())
    	.pipe(gulp.dest('dist/img'));
});
//复制任务
gulp.task('copy',function(){
	//复制frozenUI相关依赖
	gulp.src('bower_components/frozenui/dist/css/*')
	    .pipe(gulp.dest('css/fronzenUI/css'));
	//复制font-awesome相关依赖
    //想复制目录结构？没错，在你想复制的目录后面加*这个目录会被一同复制过去
	gulp.src(['bower_components/font-awesome/css*/*.min.*',
	'bower_components/font-awesome/fonts*/*'])
	    .pipe(gulp.dest('css/font-awesome'));
});
```

#### THE END