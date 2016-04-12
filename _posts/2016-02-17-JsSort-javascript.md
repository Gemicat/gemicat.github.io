---
layout: post
title: 排序——JavaScript基础算法
date: 2016-02-17
categories: blog
tags: [数据结构与算法]
description: none
---

### 排序

#### 快速排序

    **
     * 快速排序
     */

    var temp;
    Object.prototype.swap = function (arr, index_1, index_2) {
        var tmp = arr[index_1];
        arr[index_1] = arr[index_2];
        arr[index_2] = tmp;
    }

    function partition(arr, start, end) {
        temp = arr[start];
        while (start < end) {
            while (start < end && arr[end] >= temp)--end;
            swap(arr, start, end);
            while (start < end && arr[start] <= temp)++start;
            swap(arr, end, start);
        }
        return start;
    }

    function quickSort(arr, start, end) {
        if (start < end) {
            var num = partition(arr, start, end);
            quickSort(arr, num + 1, end);
            quickSort(arr, start, num - 1);
        } else {
            console.log(arr);
            return;
        }
    }

    var arr = [2, 1, 3, 2];

    quickSort(arr, 0, 3);

    /**
     * 找出数组第k小的值
     * 在快速排序的基础上引用二分法的概念，当找到第k位时，说明是最小
     */
    var temp;
    Object.prototype.swap = function (arr, index_1, index_2) {
        var tmp = arr[index_1];
        arr[index_1] = arr[index_2];
        arr[index_2] = tmp;
    }

    function partition(arr, start, end) {
        temp = arr[start];
        while (start < end) {
            while (start < end && arr[end] >= temp)--end;
            swap(arr, start, end);
            while (start < end && arr[start] <= temp)++start;
            swap(arr, end, start);
        }
        return start;
    }

    function findK(arr, key) {
        // if (start == (key - 1)) {
        //     console.log('第k小的为' + arr[key-1]);
        //     return;
        // }
        var start = 0;
        var end = arr.length - 1;
        var num = partition(arr, start, end);

        while (start < end) {
            if (num == key - 1) {
                console.log(arr[num]);
                return;
            }
            else if (num < key) {
                start = num + 1;
                num = partition(arr, start, end);
            }
            else {
                end = num - 1;
                num = partition(arr, start, end);
            }
        }

        console.log("not found!");
    }

    var arr = [10, 25, 38, 44];
    findK(arr, 6);