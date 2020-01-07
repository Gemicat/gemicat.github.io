---
layout: post
title: redux 学习笔记
date: 2016-09-12
categories: blog
tags: [javascript]
description: none
---

### 基础

#### Action

Action 创建函数 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。

在 Redux 中的 action 创建函数只是简单的返回一个 action:

    function addTodo(text) {
      return {
        type: ADD_TODO,
        text
      }
    }

Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程。

    dispatch(addTodo(text))
    dispatch(completeTodo(index))

store 里能直接通过 store.dispatch() 调用 dispatch() 方法，但是多数情况下你会使用 react-redux 提供的 connect() 帮助器来调用。bindActionCreators() 可以自动把多个 action 创建函数 绑定到 dispatch() 方法上。

#### Reducer

reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

    (previousState, action) => newState

>只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。

combineReducers 接收一个对象，可以把所有顶级的 reducer 放到一个独立的文件中，通过 export 暴露出每个 reducer 函数，然后使用 import * as reducers 得到一个以它们名字作为 key 的 object：

    import { combineReducers } from 'redux'
    import * as reducers from './reducers'
    const todoApp = combineReducers(reducers)

#### Store

Store 就是把它们联系到一起的对象。Store 有以下职责：

* 维持应用的 state；
* 提供 getState() 方法获取 state；
* 提供 dispatch(action) 方法更新 state；
* 通过 subscribe(listener) 注册监听器;
* 通过 subscribe(listener) 返回的函数注销监听器。

根据已有的 reducer 来创建 store 是非常容易的。我们使用 combineReducers() 将多个 reducer 合并成为一个。现在我们将其导入，并传递 createStore()。

    import { createStore } from 'redux'
    import todoApp from './reducers'
    let store = createStore(todoApp)

createStore() 的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

    let store = createStore(todoApp, window.STATE_FROM_SERVER)

#### 数据流

严格的单向数据流是 Redux 架构的设计核心。

Redux 应用中数据的生命周期遵循下面 4 个步骤：

1. 调用 store.dispatch(action)。

Action 就是一个描述“发生了什么”的普通对象。比如：

    { type: 'LIKE_ARTICLE', articleId: 42 };
    { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } };
    { type: 'ADD_TODO', text: 'Read the Redux docs.'};

2. Redux store 调用传入的 reducer 函数。
3. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。
4. Redux store 保存了根 reducer 返回的完整 state 树。