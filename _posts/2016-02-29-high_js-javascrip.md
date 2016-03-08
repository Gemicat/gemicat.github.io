---
layout: post
title: 高性能javascript【连载中】
date: 2016-03-08
categories: blog
tags: [javascript]
description: none
---

### 1.加载和运行

#### 1.1脚本位置

当浏览器遇到<script>标签时，无法预知javascript是否在页面中新添加内容，因此，浏览器停下来运行javascript代码，然后再加载例如css，图片等资源，然后继续解析或翻译页面。在整个过程中，浏览器必须先下载外部脚本文件，并解析完成后才能继续后面的步骤。在这个过程中，页面的解析和用户交互是完全被阻塞的。

如果把脚本的加载放到<head>标签中，那么浏览器会优先加载<script>脚本，第一个js文件下载并运行完成后才开始第二个js文件的加载。现在的浏览器都允许并行加载js文件，但并没有解决根本性的问题，因此，最好的解决方法就是：

> 将javscript脚本放在底部

#### 1.2成组脚本

减少js脚本数量，减少http请求，最好将js压缩合并。

#### 1.3非阻塞脚本

意思就是等页面加载完成之后在加载js代码。

1. 延期脚本、

使用<script>的扩展属性defer，作用是告知浏览器当前js脚本没有操作dom，因此代码可以稍后执行，但是缺点是只支持ie和ff。

2. 动态脚本元素

使用<script>操作dom来动态加载js，这样，无论在何处下载，都不会阻塞页面的其他进程。

    function loadScript(url, callback){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if(script.readyState){  //IE下
            script.onreadystatechange = function(){
                if(script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    callback();
                }
            }
        }else{ //其他浏览器
            script.onload = function(){
                callback();
            }
        }

        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

3. XHR脚本注入

使用XMLHttpRequest()对象来请求所需要加载的脚本，请求成功后动态添加到页面。最蛀牙的限制是不能跨域，只能在同一个域中。正因为这个原因，大型网站通常不用XHR脚本注入技术。

### 2.数据访问

数据存储在哪里，关系到代码运行期间数据被检索到的速度，在javascript中有四种基本的数据访问位置。

1. 直接量

直接量仅代表自己，包括：字符串，数字，布尔值，对象，数组，函数，正则表达式，null，undefined。

2. 变量

使用var创建用于存储数据值。

3. 数组项

具有数字索引，存储一个js数组对象。

4. 对象成员

具有字符索引，存储一个js对象。

#### 2.1管理作用域

对所有浏览器来说，一个标识符所在的位置越深，读写他的速度就越慢，在没有优化的js引擎中，最好尽可能使用局部变量，或用局部变量存储全局变量从而减少访问全局变量的次数。

> 尽可能不使用with()，小心使用try-catch

### 3.DOM编程

dom操作的代价非常昂贵，通常是一个网页的性能瓶颈。




