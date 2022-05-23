import React from 'react';
import { renderRoutes } from "react-router-config";

// 排行榜组件
function Rank(props) {
  const { route } = props;

  return (
    <div>
      <div>Rank</div>
      { renderRoutes (route.routes) }
    </div>
  )
}

export default React.memo(Rank);