---
layout: post
title: 刷题
date: 2016-02-17
categories: blog
tags: [LeetCode]
description: none
---

### PermMissingElem

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

### 1.Two Sum

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