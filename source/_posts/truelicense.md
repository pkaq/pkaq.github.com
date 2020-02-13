---
title: 基于 TrueLicense 的项目证书验证
author: PKAQ
date: 2020-02-13 16:31:56
tags: ['Spring boot', 'License']
categories: ['Spring Boot']
---


## 一、简述

开发的软件产品在交付使用的时候，往往有一段时间的试用期，这期间我们不希望自己的代码被客户二次拷贝，这个时候 license 就派上用场了，license 的功能包括设定有效期、绑定 ip、绑定 mac 等。授权方直接生成一个 license 给使用方使用，如果需要延长试用期，也只需要重新生成一份 license 即可，无需手动修改源代码。

TrueLicense 是一个开源的证书管理引擎，详细介绍见 https://truelicense.java.net/

首先介绍下 license 授权机制的原理：

1. 生成密钥对，包含私钥和公钥。
2. 授权者保留私钥，使用私钥对授权信息诸如使用截止日期，mac 地址等内容生成 license 签名证书。
3. 公钥给使用者，放在代码中使用，用于验证 license 签名证书是否符合使用条件。

<!-- more -->
## 二、生成密钥对

以下命令在 window cmd 命令窗口执行，注意当前执行目录，最后生成的密钥对即在该目录下：
1、首先要用 KeyTool 工具来生成私匙库：（-alias别名 -validity 3650 表示10年有效）

```bash
keytool -genkey -alias privatekey -keysize 1024 -keystore privateKeys.store -validity 3650
```

2、然后把私匙库内的证书导出到一个文件当中

```bash
keytool -export -alias privatekey -file certfile.cer -keystore privateKeys.store
```

3、然后再把这个证书文件导入到公匙库

```bash
keytool -import -alias publiccert -file certfile.cer -keystore publicCerts.store
```

最后生成的文件 privateKeys.store（私钥）、publicCerts.store（公钥）拷贝出来备用。



## 三、准备工作

首先，我们需要引入 truelicense 的 jar 包，用于实现我们的证书管理。

```groovy
 implementation  "cn.hutool:hutool-all:${hutool}",
                    "de.schlichtherle.truelicense:truelicense-core:1.33"
```

然后，我们建立一个单例模式下的证书管理器。

```java
public class LicenseManagerHolder {

    private static volatile LicenseManager licenseManager = null;

    private LicenseManagerHolder() {
    }

    public static LicenseManager getLicenseManager(LicenseParam param) {
        if (licenseManager == null) {
            synchronized (LicenseManagerHolder.class) {
                if (licenseManager == null) {
                    licenseManager = new LicenseManager(param);
                }
            }
        }
        return licenseManager;
    }
}
```



## 四、利用私钥生成证书

利用私钥生成证书，我们需要两部分内容，一部分是私钥的配置信息（私钥的配置信息在生成私钥库的过程中获得），一部分是自定义的项目证书信息。如下展示：

```yaml
eva:
  license:
    ########## 私钥的配置信息 ###########
    priv:
      # 私钥的别名
      key_alias: private_license_key
      # privateKeyPwd（该密码是生成密钥对的密码 — 需要妥善保管，不能让使用者知道）
      key_pwd: 7u8i9o0p
      # keyStorePwd（该密码是访问密钥库的密码 — 使用 keytool 生成密钥对时设置，使用者知道该密码）
      keystore_pwd: 7u8i9o0p
      # 密钥库的地址（放在 resource 目录下）
      path: /license/private_license.store
    ########## 公钥的配置信息 ###########
    pub:
      # 公钥别名
      alias: publiccert
    # 该密码是访问密钥库的密码 — 使用 keytool 生成密钥对时设置，使用者知道该密码
      keystore_pwd: 7u8i9o0p
      # 公共库路径（放在 resource 目录下
      path: /license/publicCerts.store
      # 证书路径（我这边配置在了 linux 根路径下，即 /license.lic ）
      license: /license/license.lic
    # 项目的唯一识别码
    subject: eva
    ########## license content ###########
    # 发布日期
    issuedTime: 2020-02-09 00:00:00
    # 有效开始日期
    notBefore: 2020-02-09 00:00:00
    # 有效截止日期
    notAfter: 2029-02-09 23:16:00
    # ip 地址
    ipAddress: 192.168.0.107
    # mac 地址
    macAddress: 70-C9-4E-E6-6D-D1
    # 使用者类型，用户(user)、电脑(computer)、其他（else）
    consumerType: user
    # 证书允许使用的消费者数量
    consumerAmount: 1
    # 证书说明
    info: power by xiamen yungu
    #生成证书的地址
    licPath: D:\eva_license\license.lic
```

接下来，就是如何生成证书的实操部分了

```java
package io.nerv.license;

import cn.hutool.core.date.DateUtil;
import de.schlichtherle.license.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.security.auth.x500.X500Principal;
import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.prefs.Preferences;

@Slf4j
@Component
public class LicenseGenerator {

    @Autowired
    private LicenseConfig licenseConfig;
    /**
     * X500Princal 是一个证书文件的固有格式，详见API
     */
    private final static X500Principal DEFAULT_HOLDERAND_ISSUER = new X500Principal("CN=Eva, OU=Nerv, O=Nerv, L=Nerv, ST=Unknown, C=CN");

    /**
     * 生成证书，在证书发布者端执行
     *
     * @throws Exception
     */
    public void create() throws Exception {
        LicenseManager licenseManager = LicenseManagerHolder.getLicenseManager(initLicenseParams());
        licenseManager.store(buildLicenseContent(), new File(licenseConfig.getLicPath()));
        log.info("------ 证书发布成功 ------");
    }

    /**
     * 初始化证书的相关参数
     *
     * @return
     */
    private LicenseParam initLicenseParams() {
        Class<LicenseGenerator> clazz = LicenseGenerator.class;
        Preferences preferences = Preferences.userNodeForPackage(clazz);
        // 设置对证书内容加密的对称密码
        CipherParam cipherParam = new DefaultCipherParam(licenseConfig.getPriv().getKeystorePwd());
        // 参数 1,2 从哪个Class.getResource()获得密钥库;
        // 参数 3 密钥库的别名;
        // 参数 4 密钥库存储密码;
        // 参数 5 密钥库密码
        KeyStoreParam privateStoreParam = new DefaultKeyStoreParam(clazz, licenseConfig.getPriv().getPath(),
                                                                          licenseConfig.getPriv().getKeyAlias(),
                                                                          licenseConfig.getPriv().getKeystorePwd(),
                                                                          licenseConfig.getPriv().getKeyPwd());
        // 返回生成证书时需要的参数
        return new DefaultLicenseParam(licenseConfig.getSubject(), preferences, privateStoreParam, cipherParam);
    }

    /**
     * 通过外部配置文件构建证书的的相关信息
     *
     * @return
     * @throws ParseException
     */
    public LicenseContent buildLicenseContent() throws ParseException {
        LicenseContent content = new LicenseContent();
//        SimpleDateFormat formate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");


        content.setConsumerAmount(licenseConfig.getConsumerAmount());
        content.setConsumerType(licenseConfig.getConsumerType());
        content.setHolder(DEFAULT_HOLDERAND_ISSUER);
        content.setIssuer(DEFAULT_HOLDERAND_ISSUER);
        content.setIssued( DateUtil.parseDateTime(licenseConfig.getIssuedTime()) );
        content.setNotBefore( DateUtil.parseDateTime(licenseConfig.getNotBefore()) );
        content.setNotAfter( DateUtil.parseDateTime(licenseConfig.getNotAfter()) );
        content.setInfo(licenseConfig.getInfo());
        // 扩展字段
        Map<String, String> map = new HashMap<>(4);
        map.put("ip", licenseConfig.getIpAddress());
        map.put("mac", licenseConfig.getMacAddress());
        content.setExtra(map);

        return content;
    }
}
```

最后，来尝试生成一份证书吧！

```java
    public static void main(String[] args) throws Exception {
           licenseVerify.init();
    }
```



## 四、利用公钥验证证书

利用公钥生成证书，我们需要有公钥库、license 证书等信息。


接下来就是怎么用公钥验证 license 证书，怎样验证 ip、mac 地址等信息的过程了~

```java
package io.nerv.license;

import cn.hutool.core.net.NetUtil;
import de.schlichtherle.license.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.net.InetAddress;
import java.util.Map;
import java.util.Objects;
import java.util.prefs.Preferences;

@Slf4j
@Component
public class LicenseVerify {

    @Autowired
    private LicenseConfig licenseConfig;

    /**
     * 安装证书证书
     */
    public void install() {
        try {
            LicenseManager licenseManager = getLicenseManager();
            licenseManager.install(new File(licenseConfig.getLicPath()));
            log.info("安装证书成功!");
        } catch (Exception e) {
            log.error("授权已过期, 安装证书失败!", e);
            Runtime.getRuntime().halt(1);
        }

    }

    private LicenseManager getLicenseManager() {
        return LicenseManagerHolder.getLicenseManager(initLicenseParams());
    }

    /**
     * 初始化证书的相关参数
     */
    private LicenseParam initLicenseParams() {
        Class<LicenseVerify> clazz = LicenseVerify.class;
        Preferences pre = Preferences.userNodeForPackage(clazz);
        CipherParam cipherParam = new DefaultCipherParam(licenseConfig.getPub().getKeystorePwd());
        KeyStoreParam pubStoreParam = new DefaultKeyStoreParam(clazz,
                                                               licenseConfig.getPub().getPath(),
                                                               licenseConfig.getPub().getAlias(),
                                                               licenseConfig.getPub().getKeystorePwd() , null);
        return new DefaultLicenseParam(licenseConfig.getSubject(), pre, pubStoreParam, cipherParam);
    }

    /**
     * 验证证书的合法性
     */
    public boolean vertify() {
        try {
            LicenseManager licenseManager = getLicenseManager();
            LicenseContent verify = licenseManager.verify();
            log.info("验证证书成功!");
            Map<String, String> extra = (Map) verify.getExtra();
            String ip = extra.get("ip");
            InetAddress inetAddress = InetAddress.getLocalHost();
            String localIp = inetAddress.toString().split("/")[1];
            if (!Objects.equals(ip, localIp)) {
                log.error("IP 地址验证不通过");
                return false;
            }
            String mac = extra.get("mac");
            String localMac = getLocalMac(inetAddress);
            if (!Objects.equals(mac, localMac)) {
                log.error("MAC 地址验证不通过");
                return false;
            }
            log.info("IP、MAC地址验证通过");
            return true;
        } catch (LicenseContentException ex) {
            log.error("证书已经过期!", ex);
            return false;
        } catch (Exception e) {
            log.error("验证证书失败!", e);
            return false;
        }
    }

    /**
     * 得到本机 mac 地址
     *
     * @param inetAddress
     */
    private String getLocalMac(InetAddress inetAddress) {
        return NetUtil.getMacAddress(inetAddress).toUpperCase();
    }
}
```

有了公钥的验证过程了，等下！事情还没结束呢！我们需要在项目启动的时候，安装 licnese 证书，然后验证ip、mac 等信息。如果校验不通过，就阻止项目启动！

```java
 if (evaConfig.getLicense().isEnable()){
 	// 安装license
    licenseVerify.init();

	// 验证license
    if (!licenseVerify.vertify()) {
    log.error("授权验证未通过, 请更新授权文件");
    	Runtime.getRuntime().halt(1);
    }
  }
```