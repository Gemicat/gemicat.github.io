---
layout: post
title: 列表
date: 2015-11-12
categories: blog
tags: [数据结构与算法javascript描述]
description: none
---

##列表

###定义

列表是一组有序的数据，每个列表中的数据项成为元素。在JavaScript中，列表中的元素可以使任意数据类型。列表中可以保存多少元素并没有事先定义好，而是根据实际使用时程序内存的限制。

不包含任何元素的列表成为空列表，列表中包含元素的个数成为列表的length。在内部实现上，用一个变量listSize保存列表中元素的个数。可以再列表末尾append一个元素，也可以再一个给定元素后或列表起始位置insert一个元素。使用remove方法删除指定元素，使用clear方法清空列表。

还可以使用toString() 方法显示列表中所有的元素，使用getElement()方法显示当前元素。列表拥有描述元素位置的属性。列表有前有后（分别对应front 和end）。使用next() 方
法可以从当前元素移动到下一个元素，使用prev() 方法可以移动到当前元素的前一个元素。还可以使用moveTo(n) 方法直接移动到指定位置，这里的n 表示要移动到第n 个位置。currPos 属性表示列表中的当前位置。

###实现

{% highlight bash linenos %}
function list() {
    this.listSize = 0;
    this.pos = 0;
    this.dataStore = [];//初始化一个空数组来保存列表
    this.clear = clear;
    this.find = find;
    this.toString = toString;
    this.insert = insert;
    this.append = append;
    this.remove = remove;
    this.front = front;
    this.end = end;
    this.prev = prev;
    this.next = next;
    this.length = length;
    this.currPos = currPos;
    this.moveTo = moveTo;
    this.getElement = getElement;
    this.contains = contains;
}

//append添加元素
function append(element) {
    this.dataStore[listSize++] = element;
}

//find查找元素
function find(element) {
    var len = this.dataStore.length;
    for (var i = 0; i < len; i++) {
        if (this.dataStore[i] === element) {
            return i;
        }
    }
    return -1;
}

//remove移除元素
function remove(element) {
    var foundAt = this.find(element);
    if (foundAt > -1) {
        this.dataStore.splice(foundAt, 1);
        --this.listSize;
        return true;
    }
    return false;
}

//length列表元素个数
function length() {
    return this.listSize;
}

//toString显示列表元素
function toString() {
    return this.dataStore;
}

//insert想列表插入元素
function insert(element, after) {
    var insertAfter = this.find(after);
    if (insertAfter > -1) {
        this.dataStore.splice(insertAfter, 0, element);
        ++this.listSize;
        return true;
    }
    return false;
}

//clear清空列表
function clear() {
    this.dataStore = [];
    this.listSize = 0;
}

//contains判断元素是否在列表中
function cotains(element) {
    var foundAt = this.find(element);
    if (foundAt > -1) {
        return true;
    }
    return false;
}

//front移动到开头
function front() {
    this.pos = 0;
}

//end移动到末尾
function end {
    this.pos = this.listSize;
}

//先前移动一位
function prev() {
    if (this.pos > 0) {
        --this.pos;
    }
}

//向后移动一位
function next() {
    if (this.pos < this.listSize) {
        ++this.pos;
    }
}

//currPos返回当前位置
function currPos() {
    return this.pos;
}
{% endhighlight %}
