---
layout: post
title: 笔试题
date: 2016-02-17
categories: blog
tags: [Codility]
description: none
---

### 笔试题

1.检测字符串中字母是否被“+”包围.

    function testSymbols(str) {
        var arr = str.split("");
        var reg = /^[A-Za-z]*$/gi;
        var len = arr.length;

        if (reg.test(arr[0]) || reg.test(arr[len - 1])) {
            return false;
        }

        for (var i = 1; i < len - 1; i++) {
            if (reg.test(arr[i])) {
                if (arr[i - 1] != "+" || arr[i + 1] != "+") {
                    return false;
                }
            }
        }
        return true;
    }

2.给定一个数组，问数组中最大的数能否用除此数字外任意个数组中的元素相加而成.

    var str = "++d+-o+u+b--a++-";
    console.log(testSymbols(str));

    function isMagicSum(arr) {
        var arr = arr.sort(function (a, b) {
            return a - b;
        });
        var max = arr[arr.length - 1];
        arr.pop();
        for (var i = 1; i < 1 << arr.length; i++) {
            var sum = 0;
            for (var j = 0; j < arr.length; j++) {
                if ((i & 1 << j) != 0) {
                    sum += arr[j];
                }
            }
            if (sum == max) {
                return true;
            }
        }
        return false;
    }

3.小熊分苹果

    function apple(n) {
        var i = 1, final = 1;
        var temp = n;
        var sum;

        while (temp > 1) {
            var tmp1 = ((i * n) + 1), tmp2 = (n - 1);
            var num = tmp1 / tmp2;

            if (tmp1 % tmp2 != 0) {
                ++final;
                i = final;
                temp = n;
                continue;
            }

            i = num, temp--;
        }

        return i * n + 1;
    }
    console.log(apple(5));

4.年终奖问题

    function findMax(x, y, sum) {
        sum += arr[x][y];
        if ((x == 5) && (y == 5) && (sum > max)) {
            max = sum;
        }
        if (x < 5) {
            findMax(x + 1, y, sum);
        }
        if (y < 5) {
            findMax(x, y + 1, sum);
        }
    }

    var arr = [
        [200, 120, 400, 150, 180, 300],
        [150, 250, 360, 120, 200, 130],
        [350, 300, 250, 100, 500, 260],
        [100, 150, 260, 320, 100, 150],
        [500, 130, 260, 100, 200, 170],
        [160, 100, 250, 200, 600, 200]
    ];
    var max = 0;
    findMax(0, 0, 0);
    console.log(max);