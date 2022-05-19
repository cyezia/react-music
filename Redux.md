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

- Action: 是一个具有type字段的普通JavaScript对象，描述应用程序中发生了什么事件

      const addTodoAction = {
        type: 'todos/todoAdded',  // 第一部分是这个action所属的特征或类别，第二部分是发生的具体事情
        payload: 'Buy Milk'   // 包含有关发生事情的附加信息
      }

- Action Creator: 是一个创建并返回一个action对象的函数

      const addTodo = text => {
        return (
          type: 'todos/todoAdded',
          payload: text
        )
      }

- Reducer: 是一个函数，接收当前的state和一个action对象，必要时决定如何更新状态，并返回新状态
