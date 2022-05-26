import React from 'react';
import { Provider } from 'react-redux';
import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';
import { renderRoutes } from 'react-router-config';
import store from './store/index';
import routes from './routes/index';
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    // Provider 作为整个App的容器，包裹在根组件的最外层 接收redux的store作为props 使的所有的子组件都可以拿到state
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {/* <i className="iconfont"></i> */}
        {/* renderRoutes (routes)  函数渲染出路由表的对应组件 */}
        { renderRoutes (routes) }
      </HashRouter>
    </Provider>
  );
}

export default App;
