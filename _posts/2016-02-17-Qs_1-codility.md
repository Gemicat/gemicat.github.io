---
layout: post
title: 刷题
date: 2016-02-17
categories: blog
tags: [Codility]
description: none
---

### PermMissingElem

问题：Find the missing element in a given permutation.

1.PHP部分

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

2.JS部分

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