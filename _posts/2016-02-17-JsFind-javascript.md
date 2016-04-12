---
layout: post
title: 查找——JavaScript基础算法
date: 2016-02-17
categories: blog
tags: [数据结构与算法]
description: none
---

### 查找

#### 二分法

    var arr = [1, 2, 3, 4, 5, 6, 7, 8];
    var a = 1;
    var start = 0;
    var end = arr.length - 1;

    // 二分法递归方法
    function find(arr, a, start, end) {
        var temp = Math.ceil((end + start) / 2);
        if (start > end) {
            console.log('找不到');
            return false;
        }
        if (arr[temp] == a) {
            console.log("找到了");
            return true;
        } else if (arr[temp] > a) {
            end = temp - 1;
            find(arr, a, start, end);
        }
        else if (arr[temp] < a) {
            start = temp + 1;
            find(arr, a, start, end);
        }
    }

    // 二分法非递归
    function find2(arr, a, start, end) {
        while ((end - start) >= 0) {
            var temp = Math.floor((end + start) / 2);
            console.log(temp)
            if (arr[temp] == a) {
                console.log('找到了');
                return true;
            } else if (arr[temp] > a) {
                end = temp - 1;
            } else if (arr[temp] < a) {
                start = temp + 1;
            }
        }
        console.log('找不到');
        return;
    }

    find(arr, a, start, end);
    find2(arr, a, start, end);