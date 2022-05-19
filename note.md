#

## React的渲染机制--Reconciliation(协调)

      props/state改变
      
      render函数返回不同的元素树
      
      新旧DOM树比对(Diff)
      
      针对差异的地方更新
      
      渲染为真实DOM树

### 新旧DOM树对比的Diff算法

    - 利用shouldComponentUpdate生命周期函数减少Diff的过程：
    
    - 一般shouldComponentUpdate会比较props(属性)或state(状态)中的属性是否发生改变（浅比较），来判定是否返回true，从而触发Reconciliation过程

    - 节点相同则进入下一层节点比较；节点不同直接将原虚拟DOM树上该节点及该节点下所有后代节点，全部替换成新虚拟DOM树上同一位置的节点

### 函数式组件中的浅比较方案

      如果组件在相同的props下渲染相同的结果，可以将其包裹在React.memo中调用，通过记忆组件渲染结果的方式提高组件的性能表现，在这种情况下，React将跳过渲染组件的操作直接复用最近一次渲染结果
      
      memo，仅检查props变更

      如果函数组件被React.memo包裹，且其实现中拥有useState、useReducer或useContext，当state或context发生变化时，仍会重新渲染

## immutable数据

      - 一种利用结构共享形成持久化数据结构，一旦有部分被修改，那么将返回一个全新的对象，并且原来相同的节点会直接共享

      - 内部采用的是多叉树的结构，凡是有节点被改变，那么它与它相关的所有上级节点都更新

### immutable方法

      fromJS：将JS对象转换成immutable对象

      toJS：将immutable对象转换成JS对象

      get/getIn：获取immutable对象属性

      set：对immutable对象的属性赋值

      merge：新数据与旧数据对比，旧数据不存在的属性直接添加，旧数据中已经存在的属性用新数据中的覆盖

## CSS in JS

      const polished = require('polished'); 加载polished(一个CSS in JS库)

## styled-Components

      style.xxx` ` 表示创建xxx这个h5标签，后面紧接着的字符串里面写的是CSS代码

## 伪类和伪元素

- 伪类：用于选择处于特定状态的元素，比如当它们是这一类型的第一个元素时，或者是当鼠标指针悬浮在元素上面的时候，表现的像向文档的每个部分应用了一个类

- 伪元素：表现的像是往标记文本中加入全新的HTML元素一样
