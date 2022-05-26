import React, { useEffect } from 'react';
import { renderRoutes } from "react-router-config";
import { connect } from 'react-redux';
import { getRankList } from './store/index';
import Loading from '../../baseUI/loading';

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