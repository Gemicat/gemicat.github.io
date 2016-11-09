---
layout: post
title: JS运动框架
date: 2016-02-17
categories: javascript
tags: [javascript]
description: 小型运动框架，可以实现缓冲运动，进一步理解js...
author: "Gemicat"
---

[运动框架，进入另存为](https://raw.githubusercontent.com/Gemicat/gemicat.github.io/master/demo/Frame/move.js)

### Coding

```javascript
// 兼容性获取对象属性
function getStyle(obj, attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj, false)[attr];
    }
}

// 运动框架
function startMove(obj, json, fn){
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        
        // 检测是否所有运动都完成
        var bStop = true;
        
        for(var attr in json){

            // 检测对象当前属性
            var iCur = 0;
            if(attr == "opacity"){
                iCur = parseInt(parseFloat(getStyle(obj, attr))*100);
            }else{
                iCur = parseInt(getStyle(obj, attr));
            }

            // 缓冲运动速度计算
            var iSpeed = (json[attr] - iCur) / 8;
            iSpeed = iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            // 检测是否所有运动都完成
            if(iCur != json[attr]){
                bStop = false;
            }

            // 对象属性变化
            if(attr == "opacity"){
                obj.style.filter = 'alpha(opacity:'+(iCur+iSpeed)+')';
                obj.style.opacity = (iCur+iSpeed)/100;
            }else{
                obj.style[attr] = iCur + iSpeed + "px";
            }
        }

        // 停止运动
        if(bStop){
            clearInterval(obj.timer);
            if(fn){
                fn();
            }
        }
    },30);
}
```