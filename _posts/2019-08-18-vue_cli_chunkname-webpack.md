---
layout: post
title: 记一次 vue-cli chunkname 问题排查
date: 2019-08-18
categories: webpack
tags: [webpack]
author: "Gemicat"
comments: false
---

> 背景：原有项目迁移到 vue-cli，关闭了 `filenameHashing`，打包的 `chunk` 文件虽然后面带了 `hash`，但是部分 `chunk` 内容变了但 `hash` 不变，导致被 cdn 缓存无法更新。

首先在 `vue-cli` 文档中看看 `filenameHashing` 的作用：

```
Type: boolean
Default: true
默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
```

但是当关闭这个选项后，观察生成的 chunk 名，依然带有 hash（chunk-59ac5ce4.js），那看一下这个参数在 cli 中具体做了什么，chunk 名称是如何生成的：

```javascript
// https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L26
const getAssetPath = require('../util/getAssetPath')
// isLegacyBundle : 是否使用面向现代浏览器带自动回退地构建应用，默认 false
const outputFilename = getAssetPath(
  options,
  `js/[name]${isLegacyBundle ? `-legacy` : ``}${isProd && options.filenameHashing ? '.[contenthash:8]' : ''}.js`
)
webpackConfig
  .output
    .filename(outputFilename)
    .chunkFilename(outputFilename)
```

默认情况下，当 `filenameHashing = false` 时，文件名为 `[name].js`，即 chunk 文件名为单纯的 `chunkname`

```javascript
// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/app.js#L132
// keep chunk ids stable so async chunks have consistent hash (#1916)
webpackConfig
.plugin('named-chunks')
  .use(require('webpack/lib/NamedChunksPlugin'), [chunk => {
    if (chunk.name) {
      return chunk.name
    }
    // ...
    return `chunk-` + joinedHash
  }])
```

对没有设置 `chunk` 命名的组件来说，chunk 文件名为 `chunk-[joinedHash].js`，来看下 `joinedHash` 是如何生成的：

```javascript
// https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L139
const hash = require('hash-sum')
const joinedHash = hash(
  Array.from(chunk.modulesIterable, m => m.id).join('_')
)
```

webpack 内部维护了一份自增 id，每个 module 都有一个 id， `joinedHash` 是基于当前 chunk 引用的 module，获取 id 拼接后进行 hash 之后的结果。

由于id是自增的，为了防止新增或删除一个文件导致后续其他 `moduleId` 发生变化，`cli` 使用 `HashedModuleIdsPlugin` 进行处理，该插件会根据模块的相对路径生成一个四位数的 `hash` 作为模块 `id`，如下：

```javascript
// https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/prod.js#L8
// keep module.id stable when vendor modules does not change
webpackConfig
.plugin('hash-module-ids')
  .use(require('webpack/lib/HashedModuleIdsPlugin'), [{
    hashDigest: 'hex'
  }])
```

当我们的改动并没有改变引用 module 的 hash-id 时，`joinedHash` 就不会改变，`chunkname` 也不会改变。

目前的解决方案是将 `filenameHashing = true`，在 `chunkname` 后拼接 `contenthash` 来判断当前 `chunk` 内容是否更新，那么问题来了，`contenthash` 是什么，它和 `hash`、`chunkhash` 有什么区别？

**hash**

> the hash of the module identifier

 `hash` 是基于整个 `moduleId` 序列计算得到的，整个项目共用一个 hash，当增加或删除一个模块，会对整个 `moduleId` 序列造成影响，从而改变 `hash` 的值，不利于项目文件缓存。
 
 **chunkhash**
 
 > the hash of the chunk content
 
 `webpack` 会将所有文件以 js 为入口聚合，如果当前聚合的 css 有变动，那么在计算 `chunkhash` 时，会对整个文件内容进行计算，即使使用 `MiniCssExtractPlugin` 等插件分隔，其 `chunkhash` 也是一致的。
 
 **contenthash**
 
 > the hash of extracted content
 
 针对当前文件内容计算 `hash`，一般来说，`css` 文件必须使用 `contenthash`

参考资料：

- [vue cli源码](https://github.com/vuejs/vue-cli)
- [手摸手，带你用合理的姿势使用webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)
- [用 webpack 实现持久化缓存](https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/)
- [Webpack 4 如何优雅打包缓存文件](https://imweb.io/topic/5b6f224a3cb5a02f33c013ba)