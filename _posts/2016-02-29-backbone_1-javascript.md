---
layout: post
title: Backbone.JS 从入门到放弃
date: 2016-02-29
categories: blog
tags: [javascript]
description: none
---

## 1.认识backbone

backbone.js提供了一套web开发的框架，通过Models进行key-value绑定及custom事件处理，通过Collections提供一套丰富的API用于枚举功能通过Views来进行事件处理及与现有的Application通过RESTful JSON接口进行交互.它是基于jquery和underscore的一个js框架。

通过backbone，你可以把你的数据当作Models，通过Models你可以创建数据，进行数据验证，销毁或者保存到服务器上。当界面上的操作引起model中属性的变化时，model会触发change的事件;那些用来显示model状态的views会接受到model触发change的消息，进而发出对应的响应，并且重新渲染新的数据到界面。在一个完整的backbone应用中，你不需要写那些胶水代码来从DOM中通过特殊的id来获取节点，或者手工的更新HTML页面，因为在model发生变化时，views会很简单的进行自我更新。

## 2.通过helloworld来认识backbone

## 3.backbone中的model实例

backbone中最基础的东西就是model，这个东西就像后端开发中数据库映射的model一样，也是数据对象模型。

### 3.1最简单的一个对象

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

### 3.2对象赋值的两种方法

直接定义，设置默认值

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

赋值时定义

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

### 3.3对象中的方法

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

### 3.4监听对象中属性的变化

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

### 3.5为对象添加验证规则，以及错误提示

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

## 4.backbone的collection实例

collection是model对象的一个有序的集合

### 4.1关于book和bookself的例子

    Book = Backbone.Model.extend({
        default : {
            title : 'default'
        },
        initalize : function(){
            // init事件
        }
    });

    BookShelf = Backbone.Collection.extend({
        model : Book
    });

    var book1 = new Book({title:'book1'});
    var book2 = new Book({title:'book2'});
    var book3 = new Book({title:'book3'});
    // 添加图书，或者使用bookShelf.add(book1);
    var bookShelf = new BookShelf([book1, book2, book3]);

    bookShelf.each(function(book){
        console.log(book.get('title'));
    })

### 4.2使用fetch从服务器端获取数据

    bookShelf.fetch({
        url :'/getbooks/', 
        success : function(collection, res){
            collection.each(function(book){
                console.log(book.get('title'));
            }),
        error : function(){
            console.log('error');
        }
    }})

### 4.3reset方法

这个方法是要喝fetch进行配合使用，collection在fetch到数据后，会调用reset方法。

    bookShelf.bind('reset', showAllBooks);
    showAllBooks = function(){
        bookShelf.each(function(book){
            // 操作
        })
    }

> 绑定的步骤要在fetch之前进行

## 5.backbone中的router实例

router是路由，Backbone.Router承担了一部分控制器的工作，会把链接中的#标签当作是url路径，将特定的url或者锚点规则绑定到一个指定的方法。

### 5.1一个简单的例子

    var AppRouter = Backbone.Router.extend({
        routes : {
            "" : 'main',
            "topic" : 'renderList',
            "topic/:id" : 'renderDetail',
            "*actions" : "defaultRoute"
        },
        main : function(){
            console.log('应用入口方法');
        },
        renderList : function(){
            console.log("渲染列表方法");
        },
        renderDetail : function(id){
            console.log("渲染详情的方法为：" + id);
        },
        defaultRoute : function(actions){
            console.log(actions);
        }
    });

    var app_router = new AppRouter;
    Backbone.history.start();

通过调用Backbone.history.start()来初始化这个Router。
传参的方式有两种，一种是用 ":" 来把#后对应位置作为参数，一种是"*"通配符。

## 6.backbone中的view实例

Model和Collection都是用于数据管理和交互，视图（View）将这些数据渲染到页面。

Backbone中的视图提供了一组处理DOM和渲染模型数据的方法。

视图类提供的方法就是在Backbone.View的基础上进行扩展。

### 6.1定义和创建视图

    <div title="列表" style="color:red" id="list" class="listview"></div>  
    <script type="text/javascript">  
        var ListView = Backbone.View.extend({  
            el : '#list'  
        });  
        var listview = new ListView();  
    </script> 

listView中的el属性为字符串形式的dom选择器，还可以动态生成dom。

    <script type="text/javascript">  
        var ListView = Backbone.View.extend({  
            tagName : 'div',  
            className : 'listview',  
            id : 'list',  
            attributes : {  
                title : '列表',  
                style : 'color:red'  
            },  
            render : function() {  
                this.el.innerHTML = 'Hello World!';  
                document.body.appendChild(this.el);  
            }  
        });  
        var listview = new ListView(); 
        //rander()方法将新标签添加到页面，不然只会保存在el中。 
        listview.render();  
    </script> 

### 6.2处理DOM事件

    <p id="view">  
        <input type="button" value="Create" id="create" />  
        <input type="button" value="Read" id="read" />  
        <input type="button" value="Update" id="update" />  
        <input type="button" value="Delete" id="delete" />  
    </p>  
    <script type="text/javascript">  
        var MyView = Backbone.View.extend({  
            el : '#view',  
            events : {  
                'click #create' : 'createData',  
                'click #read' : 'readData',  
                'click #update' : 'updateData',  
                'click #delete' : 'deleteData'  
            },  
            createData : function() {  
                // todo  
            },  
            readData : function() {  
                // todo  
            },  
            updateData : function() {  
                // todo  
            },  
            deleteData : function() {  
                // todo  
            }  
        });  
        var view = new MyView();  
    </script> 

### 6.3View中的模板