---
layout: post
title: javascript创建对象的7种方法
date: 2015-11-11
categories: javascript
tags: [javascript]
description: 工厂模式、构造函数模式、原型模式、组合使用构造函数模式和原型模式、动态原型模式、寄生构造模式、稳妥构造函数模式...
author: "Gemicat"
---

### 1.工厂模式

>工厂模式抽象了创建对象的过程，用函数来封装以特定接口创建对象的细节

```javascript
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        console.log(this.name);
    }
    return o;
}

var person1 = createPerson('Nick', 20, 'worker');
var person2 = createPerson('Greg', 30, 'Doctor');
```

>函数createPerson()能根据接受的参数来构建一个包含必要信息的Person对象，虽然解决了创建多个相似对象的问题，但没有解决对象识别的问题（即怎么样知道一个对象的类型）。

### 2.构造函数模式

>使用 new 操作符创建对象，所创建的对象既是Object的实例，同时也是Person的实例。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        console.log(this.name);
    }
}

var person1 = new Person('Nick', 20, 'worker');
var person2 = new Person('Greg', 30, 'Doctor');
```

>但是这种方式的缺点，是每个方法都要在每个实例上重新创建一遍，创建两个具有相投功能的函数没有意义。以下是优化后的代码：

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName() {
    console.log(this.name);
}

var person1 = new Person('Nick', 20, 'worker');
var person2 = new Person('Greg', 30, 'Doctor');

person2.sayName();
```

>这种方式将sayName()方法放到全局作用域，但是没有体现封装性。

### 3.原型模式

>原型模式创建对象的好处是可以让所有的实例共享属性和方法，而不必在实例的时候重复创建

```javascript
function Person() {
}

Person.prototype = {
    constructor: Person,
    name: "Nick",
    age: 29,
    job: "Worker",
    sayName: function () {
        console.log(this.name);
    }
}

var person1 = new Person();
person1.sayName();
```

>但是这种方法所有实例共享原型里的属性，当其中一个实例改变属性，会导致全局更改。

### 4.组合使用构造函数模式和原型模式

>既可以自定义传参，而且还共享方法，是用来定义引用类型的一种默认形式。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
}

Person.prototype = {
    constructor: Person,
    sayName: function () {
        console.log(this.name);
    }
}

var person1 = new Person("Nick", 29, 'Worker');
person1.sayName();
```

### 5.动态原型模式

>将所有构造函数和原型封装到一个构造函数中，通过检查某个应该存在的方式是否有效来决定是否需要初始化原型。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    if(typeof this.sayName != 'function'){
        Person.prototype.sayName = function(){
            console.log(this.name);
        }
    }
}

var person1 = new Person("Nick", 29, 'Worker');
person1.sayName();
```

### 6.寄生构造模式

>在前几种模式不适用的情况下，可以使用寄生构造模式。模式的思想是构造一个函数，该函数仅仅封装创建对象的代码，再返回新创建的对象。

```javascript
function Person(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        console.log(this.name);
    }
    return o;
}

var person1 = new Person("Nick", 29, 'Worker');
person1.sayName();
```

>* 除了特殊情况，最好不要使用

### 7.稳妥构造函数模式

>没有公共属性，而且其他的方法不引用this对象，适合在一些安全性相对要求高的环境下使用

```javascript
function Person(name, age, job) {
    var o = new Object();
    /**
        * 这里定义私有属性
        */
    o.sayName = function () {
        console.log(name);
    }
    return o;
}

var person1 = Person("Nick", 29, 'Worker');
person1.sayName();
```



