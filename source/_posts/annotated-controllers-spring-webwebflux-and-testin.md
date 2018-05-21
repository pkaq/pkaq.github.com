---
title: 基于注解的控制器：Spring Web/WebFlux 和 测试
author: PKAQ
date: 2018-05-21 20:53:09
tags: ['Spring Boot','Spring cloud','Spring']
categories: ['Spring']
---

# 

### Spring Web和Spring WebFlux两个名字看上去很相似，那么进行测试时是否也类似呢？下面就让我们了解一下它们在进行测试时的不同。



原文链接：https://dzone.com/articles/annotated-controllers-spring-webwebflux-and-testin

作者：Biju Kunjummen ，2017-12-05  发布于 Java Zone   

译者：[PKAQ](http://pkaq.org) , 2018-05-20 发布于 Spring4All    



[Spring WebFlux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html#spring-webflux) 和 [Spring Web ](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web) 采用的是两个完全不同的技术栈。不过， Spring Webflux 依旧支持基于注解的编程模型。  

二者定义`endpoint(功能性端点)`的方式是类似的，但是对`endpoint(功能性端点)`进行单元测试时有着明显的不同。你必须明确所选用的技术栈来编写不同的单元测试方法。  

## Endpoint示例   

一个基于注解的`endpoint`示例:   
```java
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
 
 
data class Greeting(val message: String)
 
@RestController
@RequestMapping("/web")
class GreetingController {
     
    @PostMapping("/greet")
    fun handleGreeting(@RequestBody greeting: Greeting): Greeting {
        return Greeting("Thanks: ${greeting.message}")
    }
     
}
```

## Spring Web的单元测试   

如果采用基于`Spring Web`的starter创建应用，那么可以按如下方式在`Gradle`配置文件中引入依赖。   

```groovy
compile('org.springframework.boot:spring-boot-starter-web')
```

接下来采用 [Mock MVC ](https://docs.spring.io/spring/docs/current/spring-framework-reference/testing.html#spring-mvc-test-framework)来对上面的`endpoint(功能性端点)`执行一个模拟的web测试。   

```java
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
 
 
@RunWith(SpringRunner::class)
@WebMvcTest(GreetingController::class)
class GreetingControllerMockMvcTest {
 
    @Autowired
    lateinit var mockMvc: MockMvc
 
    @Test
    fun testHandleGreetings() {
        mockMvc
                .perform(
                        post("/web/greet")
                                .content(""" 
                                |{
                                |"message": "Hello Web"
                                |}
                            """.trimMargin())
                ).andExpect(content().json("""
                    |{
                    |"message": "Thanks: Hello Web"
                    |}
                """.trimMargin()))
    }
}
```

## Spring WebFlux的单元测试

首先，像上面一样，采用如下方式引入`Spring-WebFlux`相关依赖

```groovy
compile('org.springframework.boot:spring-boot-starter-webflux')
```

然后，可以使用 [WebTestClient](https://docs.spring.io/spring/docs/current/spring-framework-reference/testing.html#webtestclient) 类对上面的`endpoint`编写单元测试。

```java
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.http.HttpHeaders
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters
 
 
@RunWith(SpringRunner::class)
@WebFluxTest(GreetingController::class)
class GreetingControllerTest {
 
    @Autowired
    lateinit var webTestClient: WebTestClient
 
    @Test
    fun testHandleGreetings() {
        webTestClient.post()
                .uri("/web/greet")
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .body(BodyInserters
                        .fromObject(""" 
                                |{
                                |   "message": "Hello Web"
                                |}
                            """.trimMargin()))
                 //使用exchange（）方法来检索响应           
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .json("""
                    |{
                    |   "message": "Thanks: Hello Web"
                    |}
                """.trimMargin())
    }
}
```

## 结论

显而易见，`Spring Web`和`Spring WebFlux`两者的编码方式十分相似，并且`Spirng WebFlux`也延续了`Spring  Web`的测试方式。但是，作为一名开发者，应该注意到它们之间潜在的不同并根据实际情况编写测试代码。希望你通过这篇文章能了解到来如何编写不同的用例代码。