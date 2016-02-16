---
layout: post
title: 队列
date: 2015-11-16
categories: blog
tags: [数据结构与算法]
description: none
---

##队列

###1.队列的定义

队列是一种先进先出（FIFO）的数据结构。队列的两种主要操作是向队列中插入新元素和删除队列中的元素。插入操作也叫做入队，删除操作也叫做出队。入队操作在队尾插入新元素，出队操作删除队头的元素。

队列的另外一项重要操作是读取队头的元素。这个操作叫做peek()。该操作返回队头元素，但不把它从队列中删除。除了读取队头元素，我们还想知道队列中存储了多少元素，可以使用length属性满足该需求；要想清空队列中的所有元素，可以使用clear() 方法来实现。

###2.队列的实现

    function Queue() {
        this.dataStore = [];
        this.enqueue = enqueue;
        this.dequeue = dequeue;
        this.front = front;
        this.back = back;
        this.toString = toString;
        this.empty = empty;
    }

    //enqueue向队尾添加一个元素
    function enqueue(element) {
        this.dataStore.push(element);
    }

    //dequeue()删除队首的元素
    function dequeue() {
        this.dataStore.shift();
    }

    //front()读取队首元素
    function front() {
        return this.dataStore[0];
    }

    //back()读取队尾元素
    function back() {
        return this.dataStore[this.dataStore.length - 1];
    }

    //toString()显示所有元素
    function toString() {
        var retStr = "";
        for (var i = 0; i < this.dataStore.length; i++) {
            retStr += this.dataStore + "\n";
        }
        return retStr;
    }

    //empty()判断是否为空
    function empty() {
        if (this.dataStore.length === 0) {
            return true;
        }
        return false;
    }

###3.优先队列

在一般情况下，从队列中删除的元素，一定是率先入队的元素。但是也有一些使用队列的应用，在删除元素时不必遵守先进先出的约定。这种应用，需要使用一个叫做优先队列的数据结构来进行模拟。

从优先队列中删除元素时， 需要考虑优先权的限制。比如医院急诊科（Emergency
Department）的候诊室，就是一个采取优先队列的例子。当病人进入候诊室时，分诊护士会评估患者病情的严重程度，然后给一个优先级代码。高优先级的患者先于低优先级的患者就医，同样优先级的患者按照先来先服务的顺序就医。



