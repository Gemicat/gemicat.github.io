---
layout: post
title: 高性能javascript
date: 2016-03-08
categories: javascript
tags: [javascript]
description: 当浏览器遇到 script 标签时，无法预知javascript是否在页面中新添加内容，因此，浏览器停下来运行javascript代码，然后再加载例如css，图片等资源，然后继续解析或翻译页面。在整个过程中，浏览器必须先下载外部脚本文件，并解析完成后才能继续后面的步骤。在这个过程中，页面的解析和用户交互是完全被阻塞的...
author: "Gemicat"
---

### 1.加载和运行

#### 1.1脚本位置

当浏览器遇到 script 标签时，无法预知javascript是否在页面中新添加内容，因此，浏览器停下来运行javascript代码，然后再加载例如css，图片等资源，然后继续解析或翻译页面。在整个过程中，浏览器必须先下载外部脚本文件，并解析完成后才能继续后面的步骤。在这个过程中，页面的解析和用户交互是完全被阻塞的。

如果把脚本的加载放到 head 标签中，那么浏览器会优先加载 script 脚本，第一个js文件下载并运行完成后才开始第二个js文件的加载。现在的浏览器都允许并行加载js文件，但并没有解决根本性的问题，因此，最好的解决方法就是：

> 将javscript脚本放在底部

#### 1.2成组脚本

减少js脚本数量，减少http请求，最好将js压缩合并。

#### 1.3非阻塞脚本

意思就是等页面加载完成之后在加载js代码。

1.延期脚本

使用 script 的扩展属性 defer，作用是告知浏览器当前 js 脚本没有操作dom，因此代码可以稍后执行，但是缺点是只支持ie和ff。

2.动态脚本元素

使用 script 操作dom来动态加载js，这样，无论在何处下载，都不会阻塞页面的其他进程。

```javascript
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
```

3.XHR脚本注入

使用XMLHttpRequest()对象来请求所需要加载的脚本，请求成功后动态添加到页面。最主要的限制是不能跨域，只能在同一个域中。正因为这个原因，大型网站通常不用XHR脚本注入技术。

### 2.数据访问

数据存储在哪里，关系到代码运行期间数据被检索到的速度，在javascript中有四种基本的数据访问位置。

1.直接量:直接量仅代表自己，包括：字符串，数字，布尔值，对象，数组，函数，正则表达式，null，undefined。

2.变量:使用var创建用于存储数据值。

3.数组项:具有数字索引，存储一个js数组对象。

4.对象成员:具有字符索引，存储一个js对象。

#### 2.1管理作用域

对所有浏览器来说，一个标识符所在的位置越深，读写他的速度就越慢，在没有优化的js引擎中，最好尽可能使用局部变量，或用局部变量存储全局变量从而减少访问全局变量的次数。

> 尽可能不使用with()，小心使用try-catch

### 3.DOM编程

dom操作的代价非常昂贵，通常是一个网页的性能瓶颈。

1.在页面大量添加或修改DOM节点时，最好将所有的节点保存起来，最后再添加到页面上。

>innerHTML和DOM操作的性能差别不大，区别是innerHTML在旧版本浏览器效率高，而DOM操作在新版浏览器效率高。具体选择哪一个要根据你所在团队的编码风格和你的编码习惯来看。

2.如果同一个DOM属性或方法被访问一次以上，最好使用一个局部变量来缓存次DOM成员。

3.在获取元素节点时，nextSibling和childNode在不同浏览器上运行时间基本相等，但是，在老的IE中，nextSibling要快的多。

4.在新版本浏览器中，使用querySelectorAll()和firstElementChild()的效率更加高。

```javascript
// 将class为warning和notice的div选择出来
document.querySelectorAll('div.warning,div.notice');
```

5.在IE中，大量使用:hover这个伪选择器会降低反应速度。

6.使用时间委托（事件逐层冒泡总能被父元素捕获）。

### 4.算法和流程控制

代码整体结构是执行速度的决定因素之一。代码量少不一定运行速度快，代码量多也不一定运行速度慢。性能损失与代码组织方式和具体问题解决办法直接相关。

#### 4.1循环

for,while,do-while的性能特性相似，但是for-in的效率较慢。

1.要尽可能减少迭代的次数，使用达夫循环。

```javascript
// 每次循环中最多8次调用process()函数，循环次数为元素综合/8.
// startAt存放余数,指出第一次循环的次数。
var interations = Math.floor(items.length / 8);
var startAt = items.length % 8;
var i = 0;
do {
    switch (startAt) {
        case 0:
            process(items[i++]);
        case 7:
            process(items[i++]);
        case 6:
            process(items[i++]);
        case 5:
            process(items[i++]);
        case 4:
            process(items[i++]);
        case 3:
            process(items[i++]);
        case 2:
            process(items[i++]);
        case 1:
            process(items[i++]);
    }
    startAt = 0;
} while (--interations);
```

下面是优化版本，将余数处理和主循环分开：

```javascript
var i = items.length % 8;
while (i) {
    process(items[i--]);
}
i = Math.floor(items.length / 8);
while (i) {
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
    process(items[i--]);
}
```

2.基于函数的迭代——forEach()，虽然比较便利，但是比起基于循环的迭代还是要慢一些。

#### 4.2递归

1.浏览器的调用栈尺寸限制了递归算法在JavaScript中的应用：栈溢出错误导致其他代码也不能执行。

2.运行的代码总量越大，使用这些策略带来的提升就越明显。

### 5.字符串和正则表达式

#### 5.1字符串连接

1.在拼接字符串时，使用str = str + 'one' + 'two'，如果在一个循环中，基本字符串位于最左端，就可以避免多次复制一个越来越大的基本字符串。

2.使用数组辅助生成字符串：

```javascript
while (appends--) {
    strs[strs.length] = str;
}
newStr = strs.join('');
```

3.大多情况下，concat比 +和+= 要慢。

#### 5.2正则表达式优化

1.正则表达式的工作原理

第一步：编译

当创建一个正则表达式对象之后，浏览器检查模板有没有错误，然后将它转换成一个本机代码用于匹配工作。

第二步：设置起始位置

确定目标字符串中开始搜索的位置，但当匹配失败时，此位置将位于最后一次尝试起始位置退后的一个字符的位置上。

第三步：匹配每个正则表达式的子元

正则表达式一旦找好起始位置，将一个一个地扫描目标文本和正则表达式模板。当一个特定子元匹配失败时，正则表达式将试图回溯到扫描之前的位置上，然后进入正则表达式其他可能的路径上。

第四步：匹配成功或失败

2.理解回溯

[理解回溯(来自博客园)](http://www.cnblogs.com/aaronjs/archive/2012/06/30/2570805.html)

回溯即时正则表达式匹配功能基本的组成部分，又是正则表达式影响效率的常见原因。

回溯失控发生在正则表达式本应该很快发现匹配的地方，因为某些特殊的匹配夫妇串动作，导致运行缓慢甚至浏览器崩溃。避免此问题的技术包括：使相邻子元互斥，避免嵌套量词对一个字符串的相同部分多次匹配，通过重复利用前瞻操作的院子特性去除不必要的回溯。

### 6.响应接口

总的来说，大多数浏览器有一个单独的处理进程，它由两个任务所共享：JavaScript任务和用户界面更新任务。每个时刻只有其中的一个操作得以执行，也就是说当JavaScript代码运行时用户界面不能对输入产生反应，反之亦然。或者说，当JavaScript运行时，用户界面就被‘锁定’了。

1.JavaScript运行时间不应该超过100毫秒，过长的运行时间导致UI更新出现可察觉的延迟，从而对整体用户体验产生负面影响。

2.定时器可用于安排代码推迟执行，它使得你可以将长运行脚本分解成一系列较小的任务。

```javascript
/**
    - 封装的使用定时器运行程序
    - @param  {items}  事件数组
    - @param  {process}  事件
    - @param  {callback}   回调方法
    */
function processArray(items, process, callback) {
    var todo = items.concat();
    setTimeout(function() {
        process(todo.shift());
        if (todo.length > 0) {
            setTimeout(arguments.callee, 25);
        } else {
            callback(items);
        }
    }, 25);
}

//调用
var items = [123, 789, 323, 232, 778, 654, 543];
function outputVal(val) {
    console.log(val);
}
processArray(items, outputVal, function() {
    console.log('Done!');
});
```

3.网页应用越来越复杂，积极主动地管理UI现成就越显得重要。没有什么JavaScript代码可以重要到允许影响到用户体验的程度。

### 7.Ajax异步JavaScript和XML

Ajax是高性能JavaScript的基石，它可以通过延迟下载大量资源使页面加载更快。

>在选在ajax传输的数据格式时，最好选用较轻便的json。





