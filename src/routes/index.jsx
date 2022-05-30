import React from 'react';
// Redirect 重定向
import { Redirect } from "react-router-dom";
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Album from '../application/Album/index';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,  // exact 决定是否精准匹配
        render: () => (
          // 重定向到推荐页面
          <Redirect to={"/recommend"} />
        )
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
        component: Singers
      },
      {
        path: "/rank",
        component: Rank
      }
    ]
  }
];

// const route = [
//   {
//     path: "/",
//     component: Home,
//     routes: [
//       {
//         path: "/",
//         exact: true, // 开启严格匹配
//         render: () => (
//           <Redirect to={"/recommend"} />  // 当/匹配不到时，重定向到推荐页面
//         )
//       },
//       {
//         exact: true,
//         path: "/recommend",
//         component: Recommend
//       },
//       {
//         path: "/singers",
//         components: Singers
//       },
//       {
//         path: "/rank",
//         component: Rank
//       }
//     ]
//   }
// ];

// export default route;