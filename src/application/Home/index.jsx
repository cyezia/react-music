import React from 'react';
// react-router-config 用于静态路由配置
import { renderRoutes } from "react-router-config";
import { Top, Tab, TabItem } from './style';
import { NavLink } from 'react-router-dom'; //利用NavLink组件进行路由跳转
import Player from '../Player/index';

// 页面样式
function Home(props) {
  // debugger;
  const { route } = props;
  // console.log('props: ', props);

  return (
    <div>
      <Top>
        <span className="iconfont menu" onClick={() => alert('用户中心正在开发中，敬请期待:)')}>&#xe65c;</span>
        <span className="title">云音乐</span>
        <span className="iconfont search" onClick={() => props.history.push('/search')}>&#xe62b;</span>
      </Top>
      <Tab>
        {/* NavLink 默认的样式是active  activeClassName="selected"指定当前路由的class */}
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span>排行榜</span></TabItem></NavLink>
      </Tab>
      {/* renderRoutes渲染路由表中对应的组件 */}
      { renderRoutes(route.routes) }
      <Player></Player>
    </div>
  );
}

export default React.memo(Home);