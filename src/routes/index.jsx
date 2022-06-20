import React from 'react';
// Redirect 重定向
import { Redirect } from "react-router-dom";
import Home from '../application/Home/index';
import Recommend from '../application/Recommend/index';
import Singers from '../application/Singers/index';
import Rank from '../application/Rank/index';
import Album from '../application/Album/index';
import Singer from '../application/Singer/index';
import Search from '../application/Search/index';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,  // exact 决定是否精准匹配
        render: () => <Redirect to={"/recommend"} />  // 重定向到推荐页面
      },
      {
        path: "/recommend",
        component: Recommend,
        routes: [
          {
            path: "/recommend/:id",
            component: Album,
          }
        ]
      },
      {
        path: "/singers",
        component: Singers,
        key: "singers",
        routes: [
          {
            path: "/singers/:id",
            component: Singer
          }
        ]
      },
      {
        path: "/rank/",
        component: Rank,
        key: "rank",
        routes: [
          {
            path: "/rank/:id",
            component: Album
          }
        ]
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: Album
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: Search
      }
    ]
  }
];
