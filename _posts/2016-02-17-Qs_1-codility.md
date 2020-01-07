---
layout: post
title: 刷题
date: 2016-02-17
categories: blog
tags: [LeetCode]
description: none
---

## PermMissingElem

Find the missing element in a given permutation.

> PHP部分

    //时间复杂度O(n),空间复杂度O(1)
    //通过率100%
    function solution($A) {
        // write your code in PHP5.5
        sort($A);
        $len = count($A);
        for($i=1;$i<=$len; $i++){
            if($A[$i-1] != $i){
                return $i;
            }
        }
        return ++$len;
    }

> JS部分

    // 通过率50%，为什么？

    function solution(A) {
        // write your code in JavaScript (Node.js 0.12)
        A.sort();
        var len = A.length;
        for(var i=1;i<=len;i++){
            if(A[i-1] != i){
                return i;
            }
        }
        return ++len;
    }

## 1.Two Sum

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution.

__Example__

    Given nums = [2, 7, 11, 15], target = 9,

    Because nums[0] + nums[1] = 2 + 7 = 9,
    return [0, 1].

> JavaScript

    /**
    - @param {number[]} nums
    - @param {number} target
    - @return {number[]}
    */
    var twoSum = function(nums, target) {
        var length = nums.length;
        var i, j;
        for (i = 0; i < (length - 1); i++) {
            for (j = (i + 1); j < length; j++) {
                if (nums[i] + nums[j] == target) {
                    return [i, j];
                }
            }
        }
        return false;
    };

## 2.ZigZag Conversion

The string `"PAYPALISHIRING"` is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

    P   A   H   N
    A P L S I I G
    Y   I   R

And then read line by line: `"PAHNAPLSIIGYIR"`

Write the code that will take a string and make this conversion given a number of rows:

    string convert(string text, int nRows); 

convert(`"PAYPALISHIRING"`, 3) should return `"PAHNAPLSIIGYIR"`.

> JavaScript

    /**
     - @param {string} s
     - @param {number} numRows
     - @return {string}
     */
    var convert = function(s, numRows) {
        if (s.length === 0 || numRows <= 1 || s.length <= numRows) {
            return s;
        }
        var flag = 2 * (numRows - 1),
            length = s.length,
            ret = '',
            rowId = 1,
            index,
            dist;

        // 第一层字符串
        for (var i = 0; i < length; i = i + flag) {
            ret += s[i]
        }

        // 中间层字符串输出
        while (rowId < numRows - 1) {
            index = rowId;
            //每一层的开头
            ret = ret + s[index];
            while (1) {
                dist = flag - (index % (numRows - 1)) * 2;
                index = index + dist;
                if (index < length) {
                    ret = ret + s[index];
                } else {
                    break;
                }
                dist = 2 * (numRows - 1 - (index % (numRows - 1)));
                index = index + dist;
                if (index < length) {
                    ret = ret + s[index];
                } else {
                    break;
                }
            }
            rowId++;
        }

        // 最底层字符串
        for (var i = rowId; i < length; i = i + flag) {
            ret = ret + s[i];
        }
        return ret;
    };

## 3.Reverse Integer

Reverse digits of an integer.

    Example1: x = 123, return 321
    Example2: x = -123, return -321

> JavaScript

    /**
     - @param {number} x
     - @return {number}
     */
    var reverse = function(x) {
        var result = 0,
            flag = 1;
        if (x < 0) {
            flag = -1;
        }
        x = Math.abs(x);
        x = (x.toString()).split('').reverse();
        result = +(x.join(''));
        if (result > 2147483647 || result < -2147483648) {
            return 0;
        }
        return flag * result;
    };
