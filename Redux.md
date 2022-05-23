# Redux

- 是JavaScript应用的状态容器，提供可预测的状态管理

- 使用一个叫action的事件来管理和更新应用状态的模式和工具库，它是集中式Store(centralized store)的方式对整个应用中使用的状态进行集中管理，其规则确保状态只能以可预测的方式更新

## React-Redux

- 可以让React组件访问state和下发action更新store，从而同Redux集成起来

## State管理

      function Counter() {
        // state: a counter value
        const [counter, setCounter] = useState(0);

        // Action: 当事件发生后，触发状态更新的代码
        const increment = () => {
          setCounter(prevCounter, prevCounter + 1);
        }

        // View: UI定义
        return (
          <div>
            Value: {counter}<button onClick={increment}>Increment</button>
          </div>
        )
      }

      state: 驱动应用的真实数据源头
      view: 基于当前状态的UI声明性描述
      actions: 根据用户输入在应用程序中发生的事件，并触发状态更新

### 单向数据流(one-way data flow)

- 用state来描述应用程序在特定时间点的状况

- 基于state渲染出View

- 当发生某些事情时（例如用户单击按钮），state会根据发生的事情进行更新，生成新的state

- 基于新生成的state重新渲染View

### 当有多个组件需要共享和使用相同的state时

- 可以从组件中提取共享state，并将其放入组件树之外的一个集中位置，这样组件树就变成了一个大View，任何组件都有可以访问state或触发action

### 不可变性Immutability

- 如果想要不可变的方式来更新，代码必须先复制原来的的object/array，然后更新它的复制体

- Redux期望所有状态更新都是使用不可变的方式

## Redux术语

### Action: 是一个具有type字段的普通JavaScript对象，描述应用程序中发生了什么事件

      const addTodoAction = {
        type: 'todos/todoAdded',  // 第一部分是这个action所属的特征或类别，第二部分是发生的具体事情
        payload: 'Buy Milk'   // 包含有关发生事情的附加信息
      }

### Action Creator: 是一个创建并返回一个action对象的函数

      const addTodo = text => {
        return (
          type: 'todos/todoAdded',
          payload: text
        )
      }

### Reducer: 是一个函数，接收当前的state和一个action对象，必要时决定如何更新状态，并返回新状态

      const initialState = { value: 0 }
      function counterReducer(state = initialState, action) {
        // 检查reducer是否关心这个action
        if(action.type === 'counter/increment') {
          // 如果是，复制state
          return (
            ...state,
            // 使用新值更新state副本
            value: state.value + 1
          )
        }
        // 返回原来的state不变
        return state;
      }

### Store 当前Redux应用的状态存在于一个名为store的对象中

### dispatch Redux store的一个方法

- 更新state的唯一方法就是调用store.dispatch()并传入一个action对象，store将执行所有reducer函数并计算出更新好的state，调用getState()可以获取新state

      store.dispatch({ type: 'counter/increment'})
      console.log(store.getState());

- dispatch的一个action可以理解为触发一个事件，发生了一些事情，我们希望store知道这件事，reducer就像事件监听一样，当它们收到了关注的action后，他就会更新state作为响应

### selector 该函数可以从store状态树中提取指定的片段

      const selectCounterValue = state => state.value
      const currentValue = selectCounterValue(store.getState())
      console.log(currentValue);

## Redux数据流

- 初始启动

  使用顶层的root reducer函数创建Redux store

  store调用一次root reducer，并将返回值保存为它的初始state

  当UI首次渲染时，UI组件访问Redux store当前的state，并使用该数据来决定要呈现的内容，同时监听state的更新，以便他们可以知道state是否已经更改

- 更新环节

  应用程序中发生了某些事情，例如用户单击按钮

  dispatch一个action到Redux store，例如dispatch({ type: 'counter/increment'})

  store用之前的state和当前的action再次运行reducer函数，并将返回值保存为新的state

  store通知所有订阅过的UI，通知他们store发生更新

  每个订阅过store数据的UI组件都会检查它们需要的state部分是否被更新

  发现数据被更新的每个组件都会强制使用新数据重新渲染，紧接着更新网页
