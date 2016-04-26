---
layout: post
title: 《JavaScript模式》阅读笔记
date: 2016-04-26
categories: blog
tags: [javascript]
description: none
---

### JavaScript：基本概念

#### 面向对象

JavaScript是一门面向对象的语言。函数实际上也是对象，函数有属性和方法。

对象主要有两种类型：

1.原生的（Native）：在ECMAScript标准中有详细描述——内置对象和用户自定义对象。

2.主机的（Host）：在主机环境中定义的（例如浏览器环境）——windows对象和所有的DOM对象。

### 函数

#### 背景

JavaScript中的函数有两个主要特点使其显得比较特殊。第一个特点在于函数是第一类对象，第二个特点是它们可以提供作用域。

1. 函数可以在运行时动态创建，还可以在程序执行过程中创建。
2. 函数可以分配给变量，可以将他们的引用复制到其他变量，可以被扩展，此外，除少数特殊情况外，函数可以被删除。
3. 可以作为参数传递给其他函数，并且还可以由其他函数返回。
4. 函数可以有自己的属性和方法。

#### 回调模式

函数都是对象，这表示它们可以作为参数传递给其他函数。当将函数introduceBugs()作为参数传递给函数writeCode()时，那么在某一时刻writeCode()可能会执行（或者调用）introduceBugs()。在这种情况下，introduceBugs()就被称之为回调函数。

    function writeCode(callback) {
        //执行一些任务
        callback();
        //.............
    }
    
    function introduceBugs() {
        //....引入漏洞
    }
    
    writeCode(introduceBugs);

> 注意writeCode()传递的introduceBugs，是不带括号的。带括号表示传递执行函数，不带括号表示传递引用。

#### 回调与作用域

回调并不是一次性的匿名函数或全局函数，而是对象的方法。如果该回调方法使用this来引用它所属的对象，这可能会导致意想不到的意外发生。

假设回调函数是paint()，它是一个名为myapp的对象的方法:

    var myapp = {};
    myapp.color = "green";
    myapp.paint = function(node) {
        node.style.color = this.color;
    }
    
函数findNodes()执行以下语句：

    var findNodes = function(callback) {
        //...
        if (typeof callback == "function") {
            callback(found);
        }
        //...
    }

如果调用findNodes(myapp.paint)，它并不会按照预期那样执行，这是由于this.color没有定义。由于findNodes()是一个全局函数，因此，对象this引用了全局对象。

对于这个问题的解决方案就是传递回调函数的同事传递改回调函数所属的对象：

    findNodes(myapp.paint, myapp);
    
然后，还需要修改findNodes()以绑定所传入的对象：

    var findNodes = function(callback, callback_obj) {
        //...
        if (typeof callback == "function") {
            callback.call(callback_obj, found);
        }
        //...
    }

#### 异步事件监听器

回调模式有很多用途，比如，当附加一个事件监听器到页面上的一个元素时，实际上提供了一个回调函数指针，该函数将会在事件发生时被调用。

    document.addEventListener("click", console.log, false);

JavaScript特别适合用于事件驱动编程，因为回调模式支持您的程序以异步方式运行，也就是说，可以乱序运行。

#### 自定义函数

如果创建了一个函数并且将其分配给保存了另外函数的同一个变量，那么就以一个新函数覆盖了旧函数。从某种程度上来说，回收了就函数指针以指向一个新函数。

    var scareMe = function () {
        alert("Boo!")；
        scareMe = function () {
            alert("Double boo!");
        };
    };
    // 使用自定义函数
    scareMe();// 输出Boo!
    scareMe();// 输出Double boo!
    
当您的函数有一些初始化准备工作要做，并且仅需要执行一次，这种模式就非常有用。

#### 即时函数

即时函数试试一种可以支持在定义函数后立即执行该函数的语法。

    (function() {
        alert("watch out!");
    })();
    
它为初始化代码提供了一个作用域沙箱，用以将所有代码包装到它的局部作用域中，且不会将任何变量泄露到全局作用域中。

#### 即时对象初始化

保护全局作用域不受污染的另一种方法，类似于前面介绍的即时函数模式，也就是下面介绍的即时函数初始化，该方法在创建对象后会立即执行。init()函数需要负责所有的初始化任务。

    ({
        //在这里可以定义设定值
        maxwidth: 600,
        maxheight: 400,
    
        //定义方法
        gimmeMax: function() {
            return this.maxwidth + "x" + this.maxheight;
        },
    
        //初始化
        init: function() {
            console.log(this.gimmeMax());
        }
    }).init();

优点：保护全局命名空间；使整个初始化过程显得更有结构化。

> 注意：这种模式主要适用于一次性的任务，而且在init()完毕后也没有对改对象的访问。如果想在init()完毕后保存对该兑现的一个引用，可以通过在init()尾部添加`"return this;"`语句实现该功能。

#### 初始化时分支

初始化时分支（加载时分支）是一种优化模式。当知道某个条件在整个程序的生命周期内都不会发生改变的时候，仅对该条件测试一次是深有意义的。浏览器功能检测就是一个典型的例子：

    //优化之前
    var utils = {
        addListener: function(el, type, fn) {
            if (typeof window.addEventListener === "function") {
                el.addEventListener(type, fn, false);
            } else if (typeof document.attachEvent === "function") {
                el.attachEvent("on" + type, fn);
            } else {
                el["on" + type] = fn;
            }
        },
        removeListener: function(el, type, fn) {
            //几乎一样
        }
    }

此代码效率比较低下，每次在调用tuils.addListener()时，都将会重复地执行相同的检查，下面是使用初始化分支进行优化：

    // 接口
    var utils = {
        addListener: null,
        removeListener: null
    };
    
    //实现
    if (typeof window.addEventListener === "function") {
        utils.addListener = function(el, type, fn) {
            el.addEventListener(type, fn, false);
        };
        utils.removeListener = function(el, type, fn) {
            el.removeListener(type, fn, false);
        };
    } else if (typeof document.attachEvent === "function") { // 判断为IE浏览器
        utils.addListener = function(el, type, fn) {
            el.attachEvent("on" + type, fn);
        };
        utils.removeListener = function(el, type, fn) {
            el.detachEvent("on" + type, fn);
        };
    } else { // 更早版本的浏览器
        utils.addListener = function(el, type, fn) {
            el["on" + type] = fn;
        };
        utils.removeListener = function(el, type, fn) {
            el["on" + type] = null;
        };
    }

#### 函数属性——备忘模式

函数是对象，因此他们具有属性。事实上，它们确实还有属性和方法。例如，对于每一个函数，无论使用什么样的语法来创建它，它都会自动获得一个length属性，其中包含了该函数期望的参数数量。

    function func(a, b, c) {}
    console.log(func.length); // 3

可以在任何时候讲自定义属性添加到你的函数中。自动以舒心的其中一个用例是缓存函数结果，因此，在下一次调用就不用重做潜在的繁重计算。缓存函数结果也被称为备忘。

    var myFunc = function(param) {
        if (!myFunc.cache[param]) {
            var result = {};
            // ..开销很大的操作
            myFunc.cache[param] = result;
        }
        return myFunc.cache[param];
    };
    //缓存存储
    myFunc.cache = {};

#### 配置对象

在函数需要传递的参数很多时，可以使用一个对象包含所有参数再作为参数传递到函数中：

    var conf = {
        username: "Boo",
        age: 45
    }
    addPerson(conf);

优点：
- 不需要记住众多的参数以及顺序；
- 可以安全忽略可选参数；
- 更加易于阅读和维护；
- 更加易于添加和删除参数。

缺点：
- 需要记住参数名称；
- 属性名称无法被压缩。

### 对象创建模式

#### 命名空间模式

命名空间有助于减少程序中所需的全局变量的数量，并且同时还有助于避免命名冲突或过长的名字前缀。

    // 全局变量
    var MYAPP = {};
    // 构造函数
    MYAPP.Parent = function() {};
    MYAPP.Child = function() {};
    // 一个变量
    MYAPP.some_var = 1;
    // 一个对象容器
    MYAPP.modules = {};
    // 嵌套对象
    MYAPP.modules.module1 = {};
    MYAPP.modules.module1.data = { a: 1, b: 2 }

缺点：
- 需要输入更多的字符串，每个变脸和函数迁都要附加前缀，总体上增加了需要下载的代码量。
- 仅有一个全局实例意味着任何部分的代码都可以修改全局实例，并且其余的功能能够获得更新后的状态。
- 长嵌套名字意味着更长的属性解析查询时间。

接下来封装一个命名空间函数的创建方法，这个实现是非破坏性的：

    var MYAPP = MYAPP || {};
    MYAPP.namespace = function(ns_string) {
        var parts = ns_string.split("."),
            parent = MYAPP,
            i;
        // 剥离最前面的冗余全局变量
        if (parent[0] === "MYAPP") {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i++) {
            // 如果存在，就创建一个属性
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    }
    
    // 将返回值赋给一个全局变量
    var module2 = MYAPP.namespace("MYAPP.modules.module2");

#### 声明依赖关系

在函数顶部或模块顶部声明代码所以来的模块。

#### 模块模式

JavaScript并没有包（package）的特殊语法，但是模块模式提供了一种创建自包含非耦合代码片段的有力工具，可以将它视为黑盒模式。

    MYAPP.namespace("MYAPP.utilities.array");
    MYAPP.utilities.array = (function() {
        // 依赖
        var uobj = MYAPP.utilities.object,
            ulang = MYAPP.utilities.lang,
            // 私有属性
            array_string = "[Object Array]",
            ops = Object.prototype.toString;
        // 私有方法。。。。。
    
        // 公有API
        return {
            inArray: function(needle, haystack) {
                for (var i = 0, max = haystack.length; i < max; i++) {
                    if (haystack[i] === needle) {
                        return true;
                    }
                }
            },
            isArray: function(a) {
                return ops.call(a) === array_string;
            }
        }
    })();

#### 沙箱模式

在沙箱模式中，可以使用全局构造函数创建对象并且还可以传递回调函数。

    new Sandbox(function(box) {
        // 代码写在这里.....
    });

#### 实现构造函数

    function SandBox() {
        // 将参数转换成一个数组
        var args = Array.prototype.slice.call(arguments),
            // 最后一个参数是回调函数
            callback = args.pop(),
            // 模块可以作为一个数组传递，或作为单独的参数传递
            modules = (args[0] && typeof args[0] === "string") ? args : args[0],
            i;
        // 确保该函数作为构造函数被调用
        if (!(this instanceof SandBox)) {
            return new SandBox(modules, callback);
        }
        // 需要向this添加属性
        this.a = 1;
        this.b = 2;
        // 向this对象添加模块
        if (!modules || modules === '*') {
            modules = [];
            for (i in SandBox.modules) {
                if (SandBox.modules.hasOwnProperty(i)) {
                    modules.push(i);
                }
            }
        }
        // 初始化所需模块
        for (i = 0; i < modules.length; i++) {
            SandBox.modules[modules[i]](this);
        }
        // 调用回调函数
        callback(this);
        // 所需要的任何原型属性
        SandBox.prototype = {
            name: 'My App',
            version: "1.0",
            getName: function() {
                return this.name;
            }
        }
    }

### 代码复用模式

优先使用对象组合，而不是类继承。

###  设计模式

#### 单例模式

单例模式的思想在于保证一个特定类仅有一个实例。这意味着当第二次使用同一个类创建新对象的时候，应该得到与第一次所创建的对象完全相同的对象。

    var obj = {
        myprop = 'my value'
    };
    var obj2 = {
        myprop = 'my value'
    };
    obj === obj2; // false
    obj == obj2; // false

> 可以认为每次在使用对象字面量创建对象的时候，实际上创建一个单例，并且不设计任何特殊语法。

下面是通过使用闭包来实现单例模式

    function Universe() {
        // 缓存实例
        var instance;
        // 重写构造函数
        Universe.instance = function Universe() {
                return instance();
            }
            // 保留原型属性
        Universe.prototype = this;
        // 实例
        instance = new Universe();
        // 重置构造函数指针
        instance.contructor = Universe;
        // 所有功能
        instance.start_time = 0;
        instance.bang = 'big';
        return instance;
    }

#### 工厂模式

设计工厂模式的目的是为了创建对象，它通常在类或者类的静态方法中实现，具有以下目标：
- 当创建相似对象时执行重复操作；
- 在编译时不知道具体类型（类）的情况下，为工厂客户提供一种创建对象的接口。


    // 父构造函数
    function CarMaker() {}
    // 一个父方法
    CarMaker.prototype.drive = function() {
            return "Vroom, I have" + this.doors + +"doors";
        }
        // 静态工厂方法
    CarMaker.factory = function(type) {
            var constr = type,
                newcar;
            // 如果构造函数不存在，则发生错误
            if (typeof CarMaker[constr] !== "function") {
                throw {
                    name: "Error",
                    message: constr + " doesn't exist"
                }
            }
            // 判断是否继承父类
            if (typeof CarMaker[constr].prototype.drive !== "function") {
                CarMaker[constr]..prototype = new CarMaker();
            }
            // 创建一个新的实例
            newcar = new CarMaker[constr]();
            // 可选择性的调用一些方法然后返回。。。
            return newcar;
        }
        // 定义特定的汽车制造商
    CarMaker.Compact = function() {
        this.doors = 4;
    }
    CarMaker.Convertible = function() {
        this.doors = 2;
    }
    CarMaker.SUV = function() {
        this.doors = 24;
    }
    // 调用
    var corolla = Compact.factory('Compact');

> 在JavaScript中，内置的全局Object()构造函数是内置的对象工厂，根据输入类型而创建不同的对象。

#### 迭代器模式

在迭代器模式中，通常有一个包含某种数据集合的对象。该数据可能存储在一个复杂的数据结构中，对象的消费者并不需要知道如何组织数据，所有需要做的就是去除单个数据进行工作。

在迭代器模式中，对象需要提供一个next()方法。依次调用next()必须返回下一个连续的元素。

    var agg = (function() {
        var index = 0,
            data = [1, 2, 3, 4, 5],
            length = data.length;
        return {
            next: function() {
                var element;
                if (!this.hasNext()) {
                    return null;
                }
                element = data[index];
                index = index + 2;
                return element;
            },
            hasNext: function() {
                return index < length;
            }
        }
    }());

#### 装饰者模式

可以在运行时添加附件功能到对象中。

    function Sale(price) {
        this.price = (price > 0) || 100;
        this.decorators_list = {};
    }
    Sale.decorators = {};
    Sale.decorators.fedtax = {
        getPrice: function(price) {
            return price + price * 5 / 100;
        }
    };
    Sale.decorators.quebec = {
        getPrice: function(price) {
            return price + price * 7.5 / 100;
        }
    };
    Sale.decorators.money = {
        getPrice: function(price) {
            return "$" + price.toFixed(2);
        }
    };
    Sale.prototype.decorate = function(decorators) {
        this.decorators_list.push(decorator);
    };
    Sale.prototype.getPrice = function() {
            var price = this.price,
                i,
                max = this.decorators_list.length,
                name;
            for (i = 0; i < max; i++) {
                name = this.decorators_list[i];
                price = Sale.decorators[name].getPrice(price);
            }
            return price;
        }
        // 使用
    var sale = new Sale(100); // 该价格为100美元
    sale.decorate('fedtax'); // 增加联邦税
    sale.decorate('quebec'); // 增加省联邦税
    sale.decorate('money'); // 格式化为美元格式
    sale.getPrice(); // "$112.88"

#### 策略模式

策略模式支持您正在运行时选择算法。代码的客户端可以使用同一个接口来进行工作，但是它却根据客户正在试图执行任务的上下文，从多个算法中选择出用于处理特定任务的算法。

使用策略模式的一个例子是解决表单验证的问题。无论表单的对象具体是什么，该方法都会被调用，并且总是返回相同的结果，一个未经验证的书列表以及任意的错误信息。

    var validator = {
            // 所有可用的检查
            types: {},
            // 在当前验证回话中的错误信息
            messages: [],
            // 当前验证配置 名称：验证类型
            conifg: {},
            //接口方法
            validate: function(data) {
                var i, msg, type, checker, result_ok;
                // 重置所有消息
                this.messages = [];
                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        type = this.types[type];
                        checker = this.types[type];
                        if (!type) {
                            continue; // 不需要验证
                        }
                        if (!checker) {
                            throw {
                                name: "ValidationError",
                                message: "No handler to validate type " + type;
                            }
                        }
                        result_ok = checker.validate(data[i]);
                        if (!result_ok) {
                            msg = "Invalid value for *" + i + "*, " + checker.instructions;
                            this.messages.push(msg);
                        }
                    }
                }
                return this.hasErrors();
            },
            // 帮助操作
            hasErrors: function() {
                return this.messages.length !== 0;
            }
        }
        // 配置
    validator.config = {
            age: 'isNumber'
        }
        // 验证方法
    validator.types.isNumber = {
        validate: function(value) {
            return !isNaN(value);
        }
        instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010";
    }

#### 外观模式

外观模式为对象提供了一个可选择的接口，可保持方法的间接性并且不会使它们处理过多的工作。

适用于处理浏览器脚本处理

    var myevent = {
        // ...
        stop: function(e) {
            // 其他
            if (typeof e.preventDefault === "function") {
                e.preventDefault();
            }
            if (typeof e.stopPropagation === "function") {
                e.stopPropagation();
            }
            // IE浏览器
            if (typeof e.returnValue === "boolean") {
                e.returnValue = false;
            }
            if (typeof e.cancelBubble === "boolean") {
                e.cancelBubble = true;
            }
        }
    }

#### 代理模式

代理模式给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。

所谓代理，就是一个人或者机构代表另一个人或者机构采取行动。在一些情况下，一个客户不想或者不能够直接引用一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用。代理模式的思想是为了提供额外的处理或者不同的操作而在实际对象与调用者之间插入一个代理对象。这些额外的操作通常需要与实际对象进行通信。

#### 中介者模式

中介者模式（Mediator），用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

软件开发中，中介者是一个行为设计模式，通过提供一个统一的接口让系统的不同部分进行通信。一般，如果系统有很多子模块需要直接沟通，都要创建一个中央控制点让其各模块通过该中央控制点进行交互。中介者模式可以让这些子模块不需要直接沟通，而达到进行解耦的目的。

[设计模式之中介者模式](http://www.cnblogs.com/TomXu/archive/2012/03/13/2374789.html)

#### 观察者模式

观察者模式又叫发布订阅模式（Publish/Subscribe），它定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使得它们能够自动更新自己。

使用观察者模式的好处：
1. 支持简单的广播通信，自动通知所有已经订阅过的对象。
2. 页面载入后目标对象很容易与观察者存在一种动态关联，增加了灵活性。
3. 目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用。


[设计模式之观察者模式](http://www.cnblogs.com/TomXu/archive/2012/03/02/2355128.html)