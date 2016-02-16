---
layout: post
title: 栈
date: 2015-11-13
categories: blog
tags: [数据结构与算法]
description: none
---

##栈

###1.栈的定义

栈是一种特殊的列表，栈内的元素只能通过列表的一端访问，这一端叫做栈的栈顶。栈被称为一种后入先出（LIFO）的数据结构。

对栈的两种主要操作是将一个元素压入栈和将一个元素弹出栈。入栈使用push() 方法，出栈使用pop()方法。预览栈顶元素使用peek()方法。

###2.栈的实现

    function Stack() {
        this.dataStore = [];
        this.top = 0;
        this.push = push;
        this.pop = pop;
        this.peek = peek;
        this.length = length;
        this.clear = clear;
    }

    //push入栈操作
    function push(element) {
        this.dataStore[this.top++] = element;
    }

    //pop出栈操作
    function pop() {
        return this.dataStore[--this.top];
    }

    //peek预览栈顶元素
    function peek() {
        return this.dataStore[this.top - 1];
    }

    //length查询栈元素个数
    function length() {
        return this.top;
    }

    //clear清空栈
    function clear() {
        this.top = 0;
    }

###3.使用Stack类

####3.1数制间的相互转换

可以利用栈将一个数字从一种数制转换成另一种数制。假设想将数字n 转换为以b 为基数的数字，实现转换的算法如下。

1.最高位为n%b，将此位压入栈。

2.使用n/b代替n。

3.重复步骤1 和2，直到n 等于0，且没有余数。

4.持续将栈内元素弹出，直到栈为空，依次将这些元素排列，就得到转换后数字的字符串形式。

>此算法只针对基数为2~9的情况。

    function mulBase(num, base) {
        var s = new Stack();
        do {
            var eachBit = num % base;
            var num = num / base;
            s.push(eachBit);
        } while (num > 0);
        var str = '';
        while (s.length() > 0) {
            str += s.pop();
        }
        return str;
    }

####3.2回文

回文是指这样一种现象：一个单词、短语或数字，从前往后写和从后往前写都是一样的。比如，单词“dad”、“racecar”就是回文;

使用栈，可以轻松判断一个字符串是否是回文。我们将拿到的字符串的每个字符按从左至右的顺序压入栈。当字符串中的字符都入栈后，栈内就保存了一个反转后的字符串，最后的字符在栈顶，第一个字符在栈底.

    function isPalidrome(word) {
        var s = new Stack();
        for (var i = 0; i < word.length; i++) {
            s.push(word[i]);
        }
        var rword = "";
        while (s.length() > 0) {
            rword += s.pop();
        }
        if (word === rword) {
            return true;
        } else {
            return false;
        }
    }

####3.3递归的演示

使用栈来模拟阶乘

    function factorial(n) {
        var s = new Stack();
        for (var i = 0; i < n; i++) {
            s.push(i);
        }
        var product = 1;
        while (s.length() > 0) {
            product *= s.pop();
        }
        return product;
    }

###4.练习

####4.1栈可以用来判断一个算术表达式中的括号是否匹配。编写一个函数，该函数接受一个算术表达式作为参数，返回括号缺失的位置。下面是一个括号不匹配的算术表达式的例子：2.3 + 23 / 12 + (3.14159×0.24。

>遍历一遍表达式，如果遇到"("则压入栈，如果遇到")"检查栈顶是否是"("，如果不是则不匹配，遍历一遍之后，检查栈是否为空，如果不为空则不匹配。

    function cheackBracket(str) {
        var arr = str.split("");
        var s = new Stack();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === "(") {
                s.push(arr[i]);
            }
            if (arr[i] === ")") {
                if (s.pop() === "(") {
                    return true;
                } else {
                    return i;
                }
            }
        }
        if (s.length() > 0) {
            return str.lastIndexOf("(");
        }
        return true;
    }
