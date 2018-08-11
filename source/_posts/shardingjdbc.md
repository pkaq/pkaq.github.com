---
title: mybatis plus整合sharding-jdbc在基于spring boot的项目中的单库分表应用
author: PKAQ
date: 2018-08-10 23:11:04
tags: ['spring', '分库分表']
categories: ['后台开发']
---

# 引言   
　　在产品应用中，当某些业务数据量过大时会导致数据库读写性能急剧下降甚至拖慢其它业务的情况。此时便需要对数据库进行不同维度的拆分，例如水平拆分或者垂直拆分。   
　　**垂直拆分（分库）：**按业务相关度将相关业务的表拆分到不同数据库中，例如订单库、商品库。通过这种拆分相关业务模块仅需请求其业务相关的库即可。   
　　**水平拆分（分表）：**按数据相关度将单表拆分为多张表，与垂直拆分不同的是水平拆分是针对单表，当系统中某张表数据量太大时可以采用水平拆分的方式根据定义的规则拆分成多张表以提高读写性能。   
　　具体选择哪种拆分方式还需要结合实际业务情况。在实际应用中，采用两种方式进行联合拆分的情况也是非常常见的，当然，如果在小规模应用的情况下非要做两种拆分，那除了炫技之外同时还会增加开发运维成本，是毫无意义的。   
　　本文讨论的情况仅限于水平拆分，即对单库大数据量表进行拆分。具体原理也很简单,只要把mybatis plus的数据源换成shardingJdbcDatasource即可。下面的示例是以订单表为例，按表中的month字段按月分表。   
# 版本   
  - sharding-jdbc: 3.0.0.M2
  - mybatis plus: 2.3
  - druid: 1.1.10

<!-- more -->

# 步骤
## 规则定义
　　拆分之前首先要确定好拆分规则，并且根据拆分规则在数据库中建立好相关表
## 依赖引入
```
ext {
   	druid = "1.1.10"
    mybatis_plus = "2.3"
    mybatis_plus_starter = "1.0.5"
    sharding_jdbc = "3.0.0.M2"
}

compile "io.shardingsphere:sharding-jdbc:${sharding_jdbc}",
		"com.baomidou:mybatis-plus-core:${mybatis_plus}"

compile("com.alibaba:druid-spring-boot-starter:${druid}"){
            exclude group: 'com.alibaba', module: 'jconsole'
            exclude group: 'com.alibaba', module: 'tools'
}
```
## 规则配置
　　
** 配置类 **
```java
package org.pkaq.config;

import com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean;
import io.shardingsphere.core.api.ShardingDataSourceFactory;
import io.shardingsphere.core.api.config.ShardingRuleConfiguration;
import io.shardingsphere.core.api.config.TableRuleConfiguration;
import io.shardingsphere.core.api.config.strategy.StandardShardingStrategyConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * shardingjdbc 配置类
 * Datetime: 2016-11-25 11:44
 * @author PKAQ
 */

@Slf4j
@Configuration
@AutoConfigureAfter(DataSource.class)
public class ShardingJDBCConfiguration {

    private final DataSource dataSource;

    private DataSource shardingDataSource;

    @Autowired
    public ShardingJDBCConfiguration(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void shardingDataSource() throws SQLException {
        ShardingRuleConfiguration shardingRuleConfig = new ShardingRuleConfiguration();
        //分表策略
        shardingRuleConfig.getTableRuleConfigs().add(getOrderTableRuleConfiguration());
        //绑定表规则列表
        this.shardingDataSource = ShardingDataSourceFactory.createDataSource(createDataSourceMap(), shardingRuleConfig,  new HashMap<>(1), new Properties());
    }
    /**
     * 分表策略
     * @return
     */
    private TableRuleConfiguration getOrderTableRuleConfiguration() {
        TableRuleConfiguration rule = new TableRuleConfiguration();
        //逻辑表名称
        rule.setLogicTable("T_ORDER");
        //源名 + 表名
        rule.setActualDataNodes("ds0.T_ORDER_$->{2018..2019}_$->{['01','08','12']}");
        // 表分片策略
        StandardShardingStrategyConfiguration strategyConfiguration =
                new StandardShardingStrategyConfiguration("month", new MonthTableShardingAlgorithm());
        rule.setTableShardingStrategyConfig(strategyConfiguration);
        //自增列名称
        rule.setKeyGeneratorColumnName("id");
        return rule;
    }

    private Map<String, DataSource> createDataSourceMap() {
        Map<String, DataSource> result = new HashMap<>(1);
        result.put("ds0", dataSource);
        return result;
    }

    /**
     * 设置数据源为sharding jdbc
     * @return
     */
    @Bean
    public MybatisSqlSessionFactoryBean mybatisSqlSessionFactoryBean() {
        MybatisSqlSessionFactoryBean mysqlplus = new MybatisSqlSessionFactoryBean();
        mysqlplus.setDataSource(this.getShardingDataSource());
        return mysqlplus;
    }

    public DataSource getShardingDataSource(){
        return this.shardingDataSource;
    }
}
```
** 分片规则实现 **
　　这里的分片规则理论上是可选配置，只是如果不配置的话默认会进行全表路由，即从所有拆分的表中进行查询。   
```java
package org.pkaq.config;

import cn.hutool.core.date.DateUtil;
import io.shardingsphere.core.api.algorithm.sharding.PreciseShardingValue;
import io.shardingsphere.core.api.algorithm.sharding.standard.PreciseShardingAlgorithm;

import java.util.Collection;
import java.util.Date;

/**
 * 精准分片策略类
 * @author: S.PKAQ
 * @Datetime: 2018/8/10 0:15
 */
public class MonthTableShardingAlgorithm implements PreciseShardingAlgorithm<Date> {

    /**
     * 等值查询分表路由策略, 根据传入date返回响应以年月结尾的表
     * @param availableTargetNames 可用表名
     * @param shardingValue 分片条件
     * @return 符合分片条件的表名
     */
    @Override
    public String doSharding(Collection<String> availableTargetNames, PreciseShardingValue<Date> shardingValue) {
		// 根据配置的分表规则生成目标表的后缀
        String tableExt = DateUtil.format(shardingValue.getValue(), "yyyy_MM");

        for (String availableTableName : availableTargetNames) {
            if (availableTableName.endsWith(tableExt)) {
                return availableTableName;
            }
        }
        return null;
    }
}

```