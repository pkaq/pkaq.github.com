---
title: 使用Renovate更新项目依赖
date: 2021-08-07 12:36:07
tags: ['build tools']
categories: ['build tools']
author: PKAQ
---
# 概述
  Renovate是一款依赖管理工具，用于“保持一切处于最新状态”。Renovate于2019年11月被WhiteSource收购，通过帮助软件项目中的依赖项更新实现自动化以节约开发者时间、降低安全风险。

<!-- more -->

# 安装 renovate
与常见的 Github Apps 一样，首先在 Github Market place 搜索 renovate 并进行安装，按需授予权限。

https://github.com/marketplace/renovate

# 配置 renovate
安装 renovate 之后无须手动操作，等待即可。

此时 renovate 将会扫描你授予权限的仓库，做一些简要分析，分析你的各个项目主力语言、依赖管理方式，之后将会对哪些可以被通过 renovate 管控更新依赖的仓库，分别提交一份 Pull Request.

这个 Pull Request 的标题叫做 **Configure Renovate，**中间附带了一个文件更变，他会在项目的更目录下添加 renovate 的配置文件，名为 renovate.json 。

这个配置文件描述了一些 renovate 管理此仓库依赖的相关选项，默认生成的 config:base 已经能够满足日常需要。

如果开发者很不爽在项目根目录增添这样一个 json 配置文件，可以按照他们官方配置发现的目录查找顺序，移入到 .github 目录下。(具体查找规则，官方有较为详细的说明文档)

#  Pin Dependencies
配置完之后，不久就会收到第二个初始化类型的 PR: Pin Dependencies。

顾名思义，这里的意思是锁定目前的依赖版本，且为以后持续接受依赖更新做准备。

以 Node 类型仓库来讲，这个 PR 的具体内容，便是先在每个 package.json 内容中，将依赖的版本无损更新到最新版本号 (指符合 semver versioning 的更新规则) 之后，去除 package.json 中每项依赖版本号之前的 ^ 和 ~ ，以将模糊的 semver versioning 版本监控行为变成确定的版本号。

# Update Dependencies
接下来的就是日常的监控依赖更新了。

每当依赖的新版本发布时，他会针对单条依赖的更新提交 PR，如果依赖中有符合标准的 CHANGELOG 也会直接加入到 PR 的 description 中。

其中，他们也会对发布到 registry 的依赖文件内容，进行 diff，以生成 renovate 自己分析的的"依赖构建产物" diff，以供查看。

在对项目的依赖描述文件扫描、分析更新这部分依赖。
对于非私有依赖， renovate 都能逐个帮你进行监控，并在版本更新的时候及时提出 PR。

意外惊喜
惊喜的是，在 merge PR 时，renovate 还会增加一个 conventional commit 的检测: 如果你在项目中显式地配置了主流的 commit lint 以及 commit message 风格检测，他会按照这些常见的风格来修改 PR 的标题.

在使用了一段时间 renovate 之后，发现 renovate 已经提供了很多 automerge 的判断条件，以减少人工合并这种机械化请求的次数。

我个人来讲，目前使用如下配置，来做到:

不管项目是否使用了的 semantic-release，bot 的 PR 风格 commit 也会自带 semantic-release 风格
在 dependencies 非 major 更新时，所有 checking pass 之后，自动 merge
在 devDependencies 有依赖版本更新时，所有 checking pass 之后，自动 merge
```json
{
  "semanticCommits": true,
  "packageRules": [
    {
      "updateTypes": ["minor", "patch", "pin", "digest"],
      "automerge": true
    },
    {
      "depTypeList": ["devDependencies"],
      "automerge": true
    }
  ],
  "extends": ["config:base"]
}
```