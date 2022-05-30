import React from 'react';
import { Provider } from 'react-redux';
import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';
import { renderRoutes } from 'react-router-config';
import store from './store/index';
import routes from './routes/index';
import { HashRouter } from 'react-router-dom';

function App(props) {
  return (
    // Provider 作为整个App的容器，包裹在根组件的最外层 接收redux的store作为props 使的所有的子组件都可以拿到state
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {/* <i className="iconfont"></i> */}
        {/* renderRoutes (routes)  函数渲染出路由表的对应组件 问题：只能渲染一层路由，再深层的路由就无法渲染，导致Url地址变化，但是页面不刷新*/}
        {/* 解决方法：将目前所在路由的下一层子路由进行渲染 */}
        { renderRoutes (routes) }
      </HashRouter>
    </Provider>
  );
}

export default App;
