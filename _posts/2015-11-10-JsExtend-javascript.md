---
layout: post
title: javascript继承的6种方法
date: 2015-11-10
categories: blog
tags: [javascript]
description: none
---

[TOC]

* 原型链

利用原型让一个引用类继承另一个引用类型的属性和方法

```javascript
function superType() {
    this.property = true;
}

superType.prototype.getSuperValue = function () {
    return this.property;
}

function subType() {
    this.subProperty = false;
}

subType.prototype = new superType();
subType.prototype.getSubValue = function () {
    return this.subProperty;
}

var instance = new subType();
console.log(instance.getSuperValue());
```

* 借用构造函数

在子类的构造函数的内部调用超类的构造函数，使用call()或apply()函数。

`javascript
function superType(name) {
    this.name = name;
}

function subType() {
    // 继承了超类，同时还传递了参数
    superType.call(this, 'Nick');
    this.age = 29;
}

var instance = new subType();
console.log(instance.name);
`

方法都是在构造函数中创建的，无法进行复用。

* 组合继承

结合原型链继承和借用构造函数继承的优点，可以让两个实例有不同的属性，又可以拥有共同的方法

`javascript
function superType(name) {
    this.name = name;
    this.color = ["red", "blue"];
}

superType.prototype.sayName = function () {
    console.lgo(this.name);
}

function subType(name, age) {
    superType.call(this, name);
    this.age = age;
}
// 继承
subType.prototype = new superType();
subType.prototype.sayAge = function () {
    console.log(this.age);
}

var instance = new subType('Nick', 29);
instance.sayAge();
`

* 原型式继承

```javascript
function object(o) {
    function F() { };
    F.prototype = o;
    return new F();
}
// 这个方法和 Object.create()函数类似，不过后者只兼容主流浏览器
var person = {
    name: "Nick",
    age: 29
}

var another = Object.create(person);
console.log(another.name);
`

* 寄生

 类似于寄生构造模式和工厂模式，即创建一个函数将这个过程封装。

`javascript
function another(original) {
    var clone = Object.create(original);
    clone.sayHi = function () {
        console.log('Hi');
    }
    return clone;
}

var person = {
    name: 'Nick',
    age: 29
}

var ins = another(person);
ins.sayHi();
`

* 寄生组合式继承

只需要调用一次超类构造函数，效率高，并且避免了在prototype和子类上创建不必要的、多余的属性。与此同时，原型链不会变，还可以正常使用instance和isPrototypeOf()。

`javascript
function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype);    // 创建对象
    prototype.costructor = subType; //增强对象
    subType.prototype = prototype; // 指定对象
}

function superType(name) {
    this.name = name;
    this.color = ["red", "blue"];
}

superType.prototype.sayName = function () {
    console.log(this.name);
}

function subType(name, age) {
    superType.call(this, name);
    this.age = age;
}

inheritPrototype(subType, superType);

subType.prototype.sayAge = function () {
    console.log(this.age);
}

// 实例化
var instance = new subType("Boer", 40);
instance.sayName();
`



