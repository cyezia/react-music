# react-router

## path属性

- Route的path属性指定路由的匹配规则

## Link组件

- 取代a标签

      <Link to="/about" component={About}>

## history属性

- 监听浏览器地址栏的变化

## 路由组件和一般组件

- 写法不同

      一般组件：<Demo />
      路由组件：<Route path="/demo" component={Demo} />

- 存放位置不同：

  一般组件：components

  路由组件：pages

- 接收的props不同：

  一般组件：写组件标签时传递了什么，就能收到什么

  路由组件：接收三个固定属性 history location match
