---
layout: post
title: 初识backbone
date: 2016-02-29
categories: blog
tags: [初识backbone]
description: none
---

## 认识backbone

backbone.js提供了一套web开发的框架，通过Models进行key-value绑定及custom事件处理，通过Collections提供一套丰富的API用于枚举功能通过Views来进行事件处理及与现有的Application通过RESTful JSON接口进行交互.它是基于jquery和underscore的一个js框架。

通过backbone，你可以把你的数据当作Models，通过Models你可以创建数据，进行数据验证，销毁或者保存到服务器上。当界面上的操作引起model中属性的变化时，model会触发change的事件;那些用来显示model状态的views会接受到model触发change的消息，进而发出对应的响应，并且重新渲染新的数据到界面。在一个完整的backbone应用中，你不需要写那些胶水代码来从DOM中通过特殊的id来获取节点，或者手工的更新HTML页面，因为在model发生变化时，views会很简单的进行自我更新。

## 通过helloworld来认识backbone

## backbone中的model实例

backbone中最基础的东西就是model，这个东西就像后端开发中数据库映射的model一样，也是数据对象模型。

### 最简单的一个对象

    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body>

    </body>
    <script type="text/javascript" src="./lib/jquery.min.js"></script>
    <script type="text/javascript" src="./lib/underscore.js"></script>
    <script type="text/javascript" src="./lib/backbone.js"></script>
    <script type="text/javascript">
        (function($){
            
            // 创建一个Man对象
            Man = Backbone.Model.extend({
                // 构造函数，默认调用alert弹出 “hi”
                initialize : function(){
                    alert('hi');
                }
            });
            // 实例化man
            var man = new Man();

        })(jQuery);
    </script>
    </html>

### 对象赋值的两种方法

1. 直接定义，设置默认值

code

    // 创建一个Man对象
    Man = Backbone.Model.extend({
        // 构造函数，默认调用alert弹出 “hi”
        initialize : function(){
            alert('hi');
        },
        defaults : {
            name : '张三',
            age : 38
        }
    });
    // 实例化man
    var man = new Man();
    alert(man.get('age'));

2. 赋值时定义

code

    // 创建一个Man对象
    Man = Backbone.Model.extend({
        // 构造函数，默认调用alert弹出 “hi”
        initialize : function(){
            alert('hi');
        }
    });
    // 实例化man
    var man = new Man();
    man.set({name:'李四', age:28});
    alert(man.get('age'))

### 对象中的方法

    // 创建一个Man对象
    Man = Backbone.Model.extend({
        // 构造函数，默认调用alert弹出 “hi”
        initialize : function(){
            alert('hi');
        },
        defaults : {
            name : '张三',
            age : 38
        },
        aboutMe : function(){
            return '我叫' + this.get('name') + '，今年' + this.get('age') + '岁。';
        }
    });
    // 实例化man
    var man = new Man();
    alert(man.aboutMe());

### 监听对象中属性的变化

    // 创建一个Man对象
    Man = Backbone.Model.extend({
        // 构造函数，默认调用alert弹出 “hi”
        initialize : function(){
            alert('hi');
            // 在初始化时绑定监听 change:监听的对象
            this.bind('change:name', function(){
                var name = this.get('name');
                alert('你改变了name属性为：' + name);
            })
        },
        defaults : {
            name : '张三',
            age : 38
        },
        aboutMe : function(){
            return '我叫' + this.get('name') + '，今年' + this.get('age') + '岁。';
        }
    });
    // 实例化man
    var man = new Man();
    // 设置name的值来触发change事件
    man.set({name:'gemicat'});

### 为对象添加验证规则，以及错误提示

    // 创建一个Man对象
    Man = Backbone.Model.extend({
        // 构造函数，默认调用alert弹出 “hi”
        initialize : function(){
            console.log('hi');
            // 在初始化时绑定监听 change:监听的对象
            this.bind('change:name', function(){
                var name = this.get('name');
                console.log('你改变了name属性为：' + name);
            });
            // 绑定当遇到错误出如何处理
            this.on('invalid', function(model, error){
                console.log(error);
            });
        },
        defaults : {
            name : '张三',
            age : 38
        },
        // 设置错误类型，当名字为空时返回以下字符串
        validate : function(attrs){
            if(attrs.name == ''){
                return "name不能为空";
            }
        },
        aboutMe : function(){
            return '我叫' + this.get('name') + '，今年' + this.get('age') + '岁。';
        }
    });
    // 实例化man
    var man = new Man();
    // 设置空 name，必须要加{validate:true}来强制使用错误检测
    man.set({name:''},{validate:true});

