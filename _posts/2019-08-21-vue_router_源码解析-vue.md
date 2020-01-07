---
layout: post
title: vue-router 源码解析
date: 2019-08-21
categories: vue
tags: [vue]
author: "Gemicat"
comments: false
---

# vue-router 源码解析

> vue-router version base v3.1.2

首先看下官网中使用 `vue-router` 的例子

```javascript
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

const router = new VueRouter({ routes })

const app = new Vue({
  router
}).$mount('#app')
```

可以看到创建了一个 `routes` 变量，并在实例化 `VueRouter` 时作为参数传入，那么看一下 `new VueRouter()` 过程中具体做了什么。

## 初始化

首先看看声明 `VueRouter` 的类中具体有什么内容

```javascript
// https://github.com/vuejs/vue-router/blob/dev/src/index.js#L18
export default class VueRouter {
    constructor (options: RouterOptions = {}) {
        this.app = null
        this.apps = []
        // 我们传入的参数
        this.options = options
        // beforeEach 导航守卫集合
        this.beforeHooks = []
        // beforeResolve 导航守卫集合
        this.resolveHooks = []
        // afterEach 导航守卫集合
        this.afterHooks = []
        // 根据当前传入的路由创建匹配对象
        this.matcher = createMatcher(options.routes || [], this)
        // 确定当前使用的路由模式 [history | hash | abstract]
        let mode = options.mode || 'hash'
        // 判断当前路由模式是否要自动回退，history模式下，如果当前浏览器不支持 pushState 并且配置了 fallback 为 true 的情况下，模式自动降级为 hash
        this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
        if (this.fallback) {
          mode = 'hash'
        }
        if (!inBrowser) {
          mode = 'abstract'
        }
        this.mode = mode
        
        switch (mode) {
          case 'history':
            this.history = new HTML5History(this, options.base)
            break
          case 'hash':
            this.history = new HashHistory(this, options.base, this.fallback)
            break
          case 'abstract':
            this.history = new AbstractHistory(this, options.base)
            break
          default:
            if (process.env.NODE_ENV !== 'production') {
              assert(false, `invalid mode: ${mode}`)
            }
        }
    }
    ....(to be continued
}
```
可以看到，在 `new VueRouter({ routes })` 时，首先执行构造方法，将参数传入后赋值给当前实例的 `options` 参数中。同时声明了一些乱七八糟的变量，其中有一条很特别：

```javascript
this.matcher = createMatcher(options.routes || [], this)
```

那么来看一下他的实现

```javascript
// https://github.com/vuejs/vue-router/blob/a8fe4fcecf59b3a25d7dd8796643870f85069e2f/src/create-matcher.js#L16
export function createMatcher(
  routes: Array < RouteConfig > ,
  router: VueRouter
): Matcher {
  ...
  return {
    match,
    addRoutes
  }
}
```

可以看到只返回了带有 `match` 和 `addRoutes` 两个方法的一个对象，那么看一下这两个方法的内容。

```javascript
// 根据用户传入的 routes 参数，将其分成三部分：
// pathList: 存储所有的 path
// pathMap: 存储所有 path -> RouteRecord 的映射
// nameMap: 存储所有 name -> RouteRecord 的映射
const {pathList, pathMap, nameMap } = createRouteMap(routes)

function addRoutes(routes) {
    // 将当前传入的 routes 添加到之前的映射中
    createRouteMap(routes, pathList, pathMap, nameMap)
}
```

那么来看一下 `RouteRecord` 的具体数据结构，就是整理了当前路由对象的配置信息。

```javascript
const record: RouteRecord = {
    // 格式化后的路径
    path: normalizedPath,
    // 使用 path-to-regexp 对 path 进行解析后的值
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
}
```

下面来看一下 `createMatcher` 返回对象的第二个参数。

```javascript
function match(
  raw: RawLocation,
  currentRoute ? : Route,
  redirectedFrom ? : Location
): Route {
  const location = normalizeLocation(raw, currentRoute, false, router)
  const {
    name
  } = location
  // 有 name 的情况
  if (name) {
    // 根据 name 获取当前路由信息
    const record = nameMap[name]
    if (process.env.NODE_ENV !== 'production') {
      warn(record, `Route with name '${name}' does not exist`)
    }
    if (!record) return _createRoute(null, location)
    const paramNames = record.regex.keys
      .filter(key => !key.optional)
      .map(key => key.name)

    if (typeof location.params !== 'object') {
      location.params = {}
    }

    if (currentRoute && typeof currentRoute.params === 'object') {
      // 遍历当前路由信息，更新 location 的信息
      for (const key in currentRoute.params) {
        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
          location.params[key] = currentRoute.params[key]
        }
      }
    }
    location.path = fillParams(record.path, location.params, `named route "${name}"`)
    return _createRoute(record, location, redirectedFrom)
  // 有 path 的情况
  } else if (location.path) {
    location.params = {}
    for (let i = 0; i < pathList.length; i++) {
      const path = pathList[i]
      const record = pathMap[path]
      // 根据当前 path 遍历所有路由信息，获取匹配 record
      if (matchRoute(record.regex, location.path, location.params)) {
        return _createRoute(record, location, redirectedFrom)
      }
    }
  }
  // no match
  return _createRoute(null, location)
}
```

可以看到不同的分支均会经过 `_createRoute()` 函数返回信息。

```javascript
// https://github.com/vuejs/vue-router/blob/a8fe4fcecf/src/create-matcher.js#L153
function _createRoute(
  record: ? RouteRecord,
  location : Location,
  redirectedFrom ? : Location
): Route {
  if (record && record.redirect) {
    // 返回重定向地址
    return redirect(record, redirectedFrom || location)
  }
  if (record && record.matchAs) {
  
    return alias(record, location, record.matchAs)
  }
  return createRoute(record, location, redirectedFrom, router)
}

// https://github.com/vuejs/vue-router/blob/a8fe4fcecf59b3a25d7dd8796643870f85069e2f/src/util/route.js#L8
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}
```

现在回到主流程，根据确认好的路由模式给 `history` 参数赋值，那么看一下，在不同路由模式下，`history` 的内容会有什么不同，那么以 `history` 模式为例看一下。

### history模式

```js
this.history = new HTML5History(this, options.base)
```

> options.base：应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"

在这个模式下，值其实是 `HTML5History` 的实例，那么看看这个类的实现

```js
export class HTML5History extends History {
  constructor (router: Router, base: ?string) {
    super(router, base)
    // 切换路由后的滚动行为
    const expectScroll = router.options.scrollBehavior
    // 判断当前是否支持并且是否设置滚动
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      setupScroll()
    }
    // 获取当前 location 除 base 之外的 path
    const initLocation = getLocation(this.base)
    // 监听浏览器的回退动作 或 history.back()
    window.addEventListener('popstate', e => {
      const current = this.current

      // 不同的浏览器在加载页面时处理popstate事件的形式存在差异。页面加载时Chrome和Safari通常会触发(emit )popstate事件，但Firefox则不会。
      const location = getLocation(this.base)
      // 如果路由没有变化，则不做任何处理
      if (this.current === START && location === initLocation) {
        return
      }
      // 调用跳转方法
      this.transitionTo(location, route => {
        if (supportsScroll) {
          handleScroll(router, route, current, true)
        }
      })
    })
  }

  go (n: number) {
    window.history.go(n)
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
      // 调用 window.history.pushState
      pushState(cleanPath(this.base + route.fullPath))
      // 在路由组件渲染完成后触发滚动方法($nextTick)
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
      // 调用 window.history.replaceState
      replaceState(cleanPath(this.base + route.fullPath))
      // 在路由组件渲染完成后触发滚动方法($nextTick)
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  ensureURL (push?: boolean) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push ? pushState(current) : replaceState(current)
    }
  }

  getCurrentLocation (): string {
    return getLocation(this.base)
  }
}
```

可以看到所有的跳转均会调用 `this.transitionTo()`，那么这个方法具体做了什么?

```js
// https://github.com/vuejs/vue-router/blob/a8fe4fcecf/src/history/base.js#L65
transitionTo(
  location: RawLocation,
  onComplete ? : Function,
  onAbort ? : Function
) {
  const route = this.router.match(location, this.current)
  // confirmTransition 执行以下导航守卫任务栈
  // 1. 在失活的组件里调用离开守卫
  // 2. 调用全局的 beforeEach 守卫
  // 3. 在重用的组件里调用 beforeRouteUpdate 守卫
  // 4. 在激活的路由配置里调用 beforeEnter
  // 5. 解析异步路由组件
  this.confirmTransition(
    route,
    () => {
      // 调用所有 afterEachHooks
      this.updateRoute(route)
      // 执行传入的 onComplete 方法
      onComplete && onComplete(route)
      this.ensureURL()

      // 第一次进入时，执行所有 ready 回调
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => {
          cb(route)
        })
      }
    },
    err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => {
          cb(err)
        })
      }
    }
  )
}
```

到现在为止，路由已经替换了，但是对应的路由组件并没有触发。如果要更新组件 `vue-router` 要和 `vue` 进行关联。

## 挂载

```js
// https://github.com/vuejs/vue-router/blob/dev/src/install.js#L6
export function install (Vue) {
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  // 将 router 信息挂载到 vue 实例
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 将 route 信息挂载到 vue 实例
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  
  //注册全局 RouterView 组件
  Vue.component('RouterView', View)
  // 注册全局 RouterLink 组件
  Vue.component('RouterLink', Link)
}
```

`VueRouter` 新增 `install` 方法，这样就可以使用 `Vue.use()` 进行挂载

## 渲染

在使用 `vue-router` 时，需要在组件内加上 `router-view` 组件进行渲染。

```js
<router-view class="view"></router-view>
```

那么我们来看一下 `<router-view>`  组件的实现。

```js
// https://github.com/vuejs/vue-router/blob/dev/src/components/view.js#L4
export default {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (_, { props, children, parent, data }) {
    ......
    const h = parent.$createElement
    const name = props.name
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})
    .......
    const matched = route.matched[depth]
    const component = cache[name] = matched.components[name]
    return h(component, data, children)
  }
}
```

可以看到该组件通过 `render` 方法进行渲染，获取的路由信息是在挂载时注入的参数，其实真实的取值是 `this._routerRoot._route`，那么 `_route` 是什么时候更新的呢？

```js
// https://github.com/vuejs/vue-router/blob/dev/src/index.js#L83
init (app: any /* Vue component instance */) {
    this.app = app
    const history = this.history
    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
}

// https://github.com/vuejs/vue-router/blob/dev/src/history/base.js#L46
listen (cb: Function) {
    this.cb = cb
}
```

在进行挂载时，会增加全局 `mixin`，组件 `beforeCreate` 生命周期会执行 `this._router.init(this)`，这时会将回调函数存储到 `cb` 参数，在路由切换是会触发该回调，即会更新 `_route` 参数的值。

同时，组件加载时，会对 `_route` 的变化进行监听，即会触发 `render` 的渲染。

```js
Vue.util.defineReactive(this, '_route', this._router.history.current)
```

## 禅

### 为什么在源码内，对象声明使用 Object.create(null) 而不是直接使用字面量 {}

使用create创建的对象，没有任何属性，我们可以把它当作一个非常纯净的map来使用，我们可以自己定义hasOwnProperty、toString方法，不管是有意还是不小心，我们完全不必担心会将原型链上的同名方法覆盖掉。

另一个使用create(null)的理由是，在我们使用for..in循环的时候会遍历对象原型链上的属性，使用create(null)就不必再对属性进行检查了。